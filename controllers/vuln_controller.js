const exec = require('child_process').exec;
const execFile = require('child_process').execFile;
const libxmljs = require('libxmljs');
const db = require('../models/db.js');
const serialize = require('node-serialize');
const mysql = require('mysql2');
const {Train, Users, Notes, Org, Wallet} = require('../models/db.js');
const ejs = require('ejs');
const html_to_pdf = require('html-pdf-node');
const {Op, Sequelize} = require('sequelize');
const md5 = require('md5');
const twofactor = require('node-2fa');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');

const con = mysql.createConnection({
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  connectTimeout: 10000,
});

// route handling
const app_index = (req, res) => {
  res.render('index');
};

const xss_lab = (req, res) => {
  const xss1 = req.query.xss1;
  const xss2 = req.query.xss2;
  const xss3 = req.query.xss3;
  res.render('xss', {
    xss1: xss1,
    xss2: xss2,
    xss3: xss3,
  });
};

const ping_get = (req, res) => {
  res.render('ping', {
    output: null,
    pingoutput: null,
  });
};

const ping_post = (req, res) => {
  const ping = req.body.ping;
  const ping1 = req.body.ping1;
  if (ping) {
    exec('ping -c 3 ' + req.body.ping, function(err, stdout, stderr) {
      output = stdout + stderr;
      res.render('ping', {
        output: output,
        pingoutput: null,
      });
    });
  }
  if (ping1) {
    execFile('/usr/bin/ping', ['-c', '3', ping1], function(err, stdout, stderr) {
      pingoutput = stdout + stderr;
      res.render('ping', {
        pingoutput: pingoutput,
        output: null,
      });
    });
  }
};

const sqli_get = (req, res) => {
  res.render('sqli');
};

const sqli_check_train_get = (req, res) => {
  const from = req.params.from;
  const to = req.params.to;
  const q = 'SELECT ntrains FROM trains where from_stnt=\'' + from + '\' and to_stnt=\'' + to + '\';';
  res.header('Content-Type', 'application/json');
  con.connect(function(err) {
    if (err) throw err;
    con.query(q, (err, results) => {
      if (err) {
        res.send(err);
      };
      res.send(JSON.stringify(results));
    });
  });
};

const sqli_fixed_get = (req, res) => {
  res.render('sqli-fixed');
};

const fixed_sqli_check_train_get = (req, res) => {
  const from = req.params.from;
  const to = req.params.to;
  Train.findAll({where: {from_stnt: from, to_stnt: to}}).then((trains) => res.send(trains))
      .catch(() => res.send('Internal error occured!'));
};

const xxe_get = (req, res) => {
  res.render('xxe', {
    comment: null,
  });
};

const xxe_comment = (req, res) => {
  const rawcomment = req.body.comment;
  const parsecomment = libxmljs.parseXmlString(rawcomment, {noent: true, noblanks: true});
  let comment = parsecomment.get('//content');
  comment = comment.text();
  // Save comment to database
  res.send(comment);
};

const auth_get = (req, res) => {
  res.render('auth');
};

const sitetoken_get = (req, res) => {
  const username = req.params['username'];
  if (!(username in tokens)) {
    res.send('Only user `admin` can access the token');
  } else {
    res.send(tokens.admin);
  }
};

const dashboard_get = (req, res) => {
  res.render('dashboard');
};

const userinfo_get = (req, res) => {
  res.send(req.user);
};

const deserialization_get = (req, res) => {
  res.render('deserialization');
};

const save_preference_post = (req, res) => {
  const preference = serialize.unserialize(req.cookies.preference);
  res.send(preference);
};

const jwt1_get = (req, res) => {
  res.render('jwt1');
};

const jwt1ApiKey = (req, res) => {
  res.send(req.user.apiToken);
};

function notFoundPage(input) {
  if (input == undefined) input = '';
  const template = `<!DOCTYPE html><html><body>
    <h1>Error: 404</h1>
    <b><p>Page Not Found: /ssti/`+ input + `</p></b></body></html>`;
  const html = ejs.render(template, {name: 'Venus'});
  return html;
}

const ssti = (req, res) => {
  const user_supplied_path = req.query.path;
  const html = notFoundPage(user_supplied_path);
  res.send(html).status(404);
};

const notes_get = (req, res) => {
  res.render('notes', {
    userid: req.user.id,
  });
};

const notes_post = (req, res) => {
  const noteTitle = req.body.noteTitle;
  const noteBody = req.body.noteBody;
  const username = req.user.username;
  const userid = req.user.id;
  Notes.create({userid: userid, username: username, noteTitle: noteTitle, noteBody: noteBody})
      .then((note) => {
        res.header('Content-Type', 'application/json').send(JSON.stringify(note));
      });
};

const userNotes_get = (req, res) => {
  const userid = req.params.userid;
  Notes.findAll({where: {userid: userid}})
      .then((queryResult) => {
        res.header('Content-Type', 'application/json');
        res.send(JSON.stringify(queryResult));
      });
};

const ticket_get = (req, res) => {
  res.render('ticket');
};

const generate_ticket_get = (req, res) => {
  res.render('ticket-booking', {
    passenger: req.query.passenger_name,
    from_stnt: req.query.from_stnt,
    to_stnt: req.query.to_stnt,
    date: req.query.date,
  });
};

const ticket_booking_get = (req, res) => {
  const options = {path: 'ticket.pdf'};
  const file = {url: `http://localhost:${process.env.HOST_PORT}/ticket/generate_ticket?passenger_name=${req.query.passenger_name}&from_stnt=${req.query.from_stnt}&to_stnt=${req.query.to_stnt}&date=${req.query.date}`};

  html_to_pdf.generatePdf(file, options).then((pdfBuffer) => {
    res.header('Content-Disposition', 'attachment; filename="ticket.pdf"');
    res.send(pdfBuffer);
  });
};

const user_edit_get = (req, res) => {
  Users.findOne({where: {username: req.user.username}})
      .then((user) => {
        res.render('user-edit', {
          username: user.username,
          email: user.email,
        });
      });
};

const edit_password_post = (req, res) => {
  Users.update({password: md5(req.body.password)}, {where: {username: req.user.username}})
      .then((queryResults) => {
        res.send('Password updated!');
      })
      .catch((err) => {
        res.send('Unexpected error occured');
      });
};

const edit_password_get = (req, res) => {
  res.render('edit_password');
};

const organization_get = (req, res) => {
  const token = req.cookies.authToken;
  res.render('organization', {
    token,
  });
};

const organization_post = (req, res) => {
  Org.update({orgname: req.body.orgname}, {where: {owner: req.user.username}})
      .then(() => {
        Users.update({orgname: req.body.orgname}, {where: {username: req.user.username}});
        res.send(req.body.orgname);
      });
};


const add_user_get = (req, res) => {
  Org.findOne({attributes: ['orgname']}, {where: {owner: req.user.username}})
      .then((queryResult) => {
        const orgname = queryResult.orgname;
        Users.findAll({where: {username: {[Op.ne]: req.user.username}}, attributes: ['username']})
            .then((users) => {
              res.render('add-user', {
                orgname,
                users,
              });
            })
            .catch((err) => {
              console.log(err);
            });
      });
};

const add_user_post = (req, res) => {
  Org.findOne({attributes: ['orgname'], where: {owner: req.user.username}})
      .then((queryResult) => {
        Users.update({orgname: queryResult.orgname}, {where: {username: req.body.user}})
            .then((updateResult) => {
              res.send('User added!');
            });
      });
};


const myorg_get = (req, res) => {
  Org.findOne({where: {owner: req.user.username}})
      .then((queryResult) => {
        if (!queryResult.orgname == '') {
          res.send(queryResult.orgname);
        } else {
          res.status(404).send('No org found!');
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send('Internal Server Error');
      });
};

const myorg_users_get = (req, res) => {
  Org.findOne({attributes: ['orgname'], where: {owner: req.user.username}})
      .then((queryResult) => {
        if (!queryResult.orgname == '') {
          Users.findAll({attributes: ['username'], where: {username: {[Op.ne]: req.user.username}, orgname: queryResult.orgname}})
              .then((queryResult) => {
                if (!queryResult == '') {
                  res.send(queryResult);
                } else {
                  res.status(404).send('No org users found!');
                }
              });
        } else {
          res.status(404).send('No org found!');
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(404).send('Internal Server Error');
      });
};

const apitoken_get = (req, res) => {
  res.render('webmessage-api-token');
};

const apitokenShow_get = (req, res) => {
  const apiToken = req.user.apiToken;
  res.render('webmessage-api-token-popup', {apiToken});
};

const cors_api_token_get = (req, res) => {
  const apiToken = req.user.apiToken;
  if (req.get('origin') !== undefined) {
    res.header('Access-Control-Allow-Origin', req.get('origin'));
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  res.render('cors-api-token', {apiToken});
};

const cors_csrf_edit_password_get = (req, res) => {
  res.render('cors-edit-password');
};

const cors_csrf_edit_password_post = (req, res) => {
  if (req.get('origin') !== undefined) {
    res.header('Access-Control-Allow-Origin', req.get('origin'));
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  if (!req.is('application/json')) return res.status(400).send('Invalid content type');
  if (req.body.password == '' || req.body.password == undefined || req.body.password == null) return res.sendStatus('400');
  Users.update({password: md5(req.body.password)}, {where: {username: req.user.username}})
      .then((queryResults) => {
        res.send('Password update Successful!');
      })
      .catch((err) => {
        res.send('Unexpected error occured');
      });
};

// handle Preflight (OPTIONS) request
const cors_csrf_edit_password_option = (req, res) => {
  if (req.get('origin') !== undefined) {
    res.header('Access-Control-Allow-Origin', req.get('origin'));
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Max-Age', '5');
  }
  res.send(200);
};

const tmp_totpSecret = {};
const totp_setup_get = (req, res) => {
  if (req.user.totpSecret == '') {
    const newSecret = twofactor.generateSecret({name: 'vuln-nodejs-app', account: req.user.email});
    tmp_totpSecret[req.user.username] = newSecret.secret;
    res.render('totp', {
      qr: newSecret.qr,
    });
  } else {
    const qr = '';
    res.render('totp', {
      qr,
    });
  }
};

const totp_setup_post = (req, res) => {
  const username = req.user.username;
  if (!(username in tmp_totpSecret)) {
    res.status(400).send('Unauthorized');
  } else {
    const verification_Token = twofactor.generateToken(tmp_totpSecret[username]);
    const verify = twofactor.verifyToken(tmp_totpSecret[username], req.body.totp_verify);
    if (verify != null) {
      if (verify.delta == '0') {
        Users.update({totpSecret: tmp_totpSecret[username]}, {where: {username: username}})
            .then((result) => {
              if (result.length == 1) {
                res.send('2fa verfied! Logout & try to bypasss it');
              }
            });
      }
    } else {
      res.status(400).send('Verification failed!, Try again.');
    }
  }
};

const login_totp_verification_get = (req, res) => {
  res.render('login_totp_verification');
};

const login_totp_verification_post = (req, res) => {
  if (req.user.totpSecret != '' || req.body.totp_code != '' || req.body.totp_code != null || req.body.totp_code == undefined) {
    const verify = twofactor.verifyToken(req.user.totpSecret, req.body.totp_code);
    if (verify != null) {
      if (verify.delta == '0') {
        res.send('/');
      }
    } else {
      res.status(403).send('Verification failed!, Try again.');
    }
  }
};

const totp_disable_post = (req, res) => {
  const totp_disable_code = req.body.totp_disable;
  if (req.user.totpSecret === '') return res.status(403).send('TOTP is not enabled for this user');
  const verify = twofactor.verifyToken(req.user.totpSecret, totp_disable_code);
  if (verify === null) return res.status(403).send('Invalid code, Try again!');
  if (verify.delta == '0') {
    Users.update({totpSecret: ''}, {where: {username: req.user.username}})
        .then((result) => {
          if (result.length == 1) {
            res.send('2FA Disabled');
          } else {
            res.status(403).send('Internal error, Try again!');
          }
        });
  } else {
    res.status(403).send('TOTP code expired!');
  }
};

const websocket_hijacking_get = (req, res) => {
  Wallet.findOne({where: {username: req.user.username}}, {attributes: ['BTC', 'ETH']})
      .then((crypto_balance) => {
        res.render('cross-site-websocket-hijacking', {
          BTC: crypto_balance.BTC,
          ETH: crypto_balance.ETH,
        });
      });
};

const websocket_xss_get = (req, res) => {
  res.render('websocket-xss', {
    username: req.user.username,
  });
};

const react_xss_get = (req, res) => {
  res.sendFile(path.resolve(__dirname, '../vuln_react_app/build', 'index.html'));
};

const react_xss_post = (req, res) => {
  res.header('Access-Control-Allow-Origin', req.get('origin'));
  res.header('Access-Control-Allow-Credentials', 'true');
  res.send({name: req.body.name, email: req.body.email, website: req.body.website});
};

const react_xss_options = (req, res) => {
  if (req.get('origin') !== undefined) {
    res.header('Access-Control-Allow-Origin', req.get('origin'));
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Max-Age', '5');
  }
  res.send(200);
};

if (process.env.MONGODB_ADMINUSERNAME != '' && process.env.MONGODB_ADMINPASSWORD != '') {
  var dbURL = `mongodb://${process.env.MONGODB_ADMINUSERNAME}:${process.env.MONGODB_ADMINPASSWORD}@${process.env.MONGODB_SERVER}:27017/`;
} else {
  var dbURL = 'mongodb://localhost:27017/';
}

const mongodb_config = {connectTimeoutMS: 2000};

MongoClient.connect(dbURL, mongodb_config, (err, db) => {
  if (err) return console.log('MongoDB connection error: NoSQL exercise will not work ' + err);
  const dbo = db.db('vuln_nodejs_app');
  dbo.dropCollection('mongodb-notes', (err, deleted) => {
    if (deleted) console.log('Dropping old mongodb collection');
  });
  dbo.collection('mongodb-notes').insertOne({username: 'SuperSecretUser', noteTitle: 'SuperSecretNote', noteBody: 'YOU HAVE SOLVED THE CHALLENGE'}, (err, result) => {
    if (err) return console.log('Internal Error: unable to insert data into mongodb-notes collection');
  });
  dbo.dropCollection('secret', (err, deleted) => {
    if (deleted) console.log('Dropping old mongodb collection');
  });
  dbo.collection('secret').insertOne({password: 'SuperSecretPassword!!', flag: '$flag{You_have_solved_this_exercise}'}, (err, result) => {
    if (err) return console.log('Internal Error: unable to insert data into mongodb-notes collection');
  });
});

const mongodb_notes_get = (req, res) => {
  res.render('mongodb-notes', {
    username: req.user.username,
  });
};

const mongodb_save_notes_post = (req, res) => {
  const noteObj = {username: req.user.username, noteTitle: req.body.noteTitle, noteBody: req.body.noteBody};
  MongoClient.connect(dbURL, mongodb_config, (err, db) => {
    if (err) {
      console.log(err);
      res.status(500).send('Internal error!');
    }
    dbo = db.db('vuln_nodejs_app');
    dbo.collection('mongodb-notes').insertOne(noteObj, (err, result) => {
      if (err) return res.status(500).send('Internal error!');
      res.send({'success': 'true'});
    });
  });
};

const mongodb_show_notes_post = (req, res) => {
  MongoClient.connect(dbURL, mongodb_config, (err, client) => {
    if (err) return res.status('500').send('MongoDB is not installed, Please follow the installation guideline.');
    const db = client.db('vuln_nodejs_app');
    db.collection('mongodb-notes').find({username: req.body.username}).toArray()
        .then((notes) => {
          res.send(notes);
        }).catch((err) => {
          res.status(500).send('Internal error!');
        });
  });
};

// GrqphQl root
const graphqlroot = {
  user: graphql_GetUser,
  listUsers: graphql_AllUsers,
  updateProfile: graphql_UpdateProfile,
  showProfile: graphql_ShowProfile,
};

async function graphql_GetUser(arg) {
  const username = arg.username;
  const q = 'SELECT * FROM users where username=\'' + username + '\';';
  await con.connect();
  const userdata = await con.promise().query(q);
  return userdata[0][0];
}

async function graphql_AllUsers() {
  const q = 'SELECT username, email from users;';
  await con.connect();
  const userdata = await con.promise().query(q);
  return userdata[0];
}

async function graphql_UpdateProfile(args, req) {
  const updateQuery = `UPDATE users SET email='${args.email}', password='${md5(args.password)}' WHERE username = '${req.user.username}';`;
  await con.connect();
  const updateResult = await con.promise().query(updateQuery);
  const updateStatus = JSON.stringify(updateResult[0].affectedRows); // returns update status
  return 'Update Successful!';
}

async function graphql_ShowProfile(args) {
  const userid = args.userid;
  const q = 'SELECT * FROM users where id=\'' + userid + '\';';
  await con.connect();
  const userdata = await con.promise().query(q);
  return userdata[0][0];
}

const graphql_user_profile_get = (req, res) => {
  res.render('graphql-user-profile', {
    username: req.user.username,
  });
};
const graphql_information_disclosure_get = (req, res) => {
  res.render('graphql-information-disclosure');
};

const graphql_update_profile_get = (req, res) => {
  res.render('graphql-update-profile', {
    username: req.user.username,
  });
};

const graphql_idor_get = (req, res) => {
  res.render('graphql-idor-show-profile', {
    userid: req.user.id,
  });
};

const svg_xss_get = (req, res) => {
  var profilePic = req.user.profilePic;
  if (profilePic != 'default.png') {
    var profilePic = `${req.user.username}/${req.user.profilePic}`;
  }
  res.render('svg-xss', {
    profilePic: profilePic,
  });
};

// clean upload directory
const ud = __dirname + '/../assets/uploads/';
fs.readdir(ud, (err, files) => {
  if (err) {
    throw err;
  }
  files.forEach((file) => {
    const fileDir = path.join(ud, file);
    if (file !== 'default.png') {
      fs.rmdirSync(fileDir, {recursive: true}, (err) => {
        throw err;
      });
    }
  });
});

const svg_xss_fileupload_post = (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  const profilePic = req.files.profilePic;
  const profilePicName = profilePic.name;
  const profilePicExtension = path.extname(profilePicName);
  const allowedExtension = ['.png', '.jpg', '.jpeg', '.svg'];
  if (!allowedExtension.includes(profilePicExtension)) {
    return res.status(422).send('Only .PNG,.JPEG,.SVG files are allowed');
  }
  // Use the mv() method to place the file somewhere on your server
  const uploadDir = __dirname + `/../assets/uploads/${req.user.username}/`;
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }
  const uploadPath = uploadDir + profilePicName;
  profilePic.mv(uploadPath, function(err) {
    if (err) {
      return res.status(500).send(err);
    }
    Users.update({profilePic: profilePicName}, {where: {username: req.user.username}})
        .then((msg) => {
          res.redirect('/svg-xss');
        })
        .catch((err) => {
          res.status(500).send(err);
        });
  });
};

const jsonp_injection_get = (req, res) => {
  Wallet.findOne({where: {username: req.user.username}}, {attributes: ['BTC', 'ETH']})
      .then((crypto_balance) => {
        res.render('jsonp-injection', {
          BTC: crypto_balance.BTC,
          ETH: crypto_balance.ETH,
        });
      });
};

const jsonp_wallet_get = (req, res) => {
  Wallet.findOne({where: {username: req.user.username}}, {attributes: ['BTC', 'ETH']})
      .then((crypto_balance) => {
        const bitcoin_quantity = crypto_balance.BTC;
        const ethereum_quantity = crypto_balance.ETH;
        const request = require('request');
        request('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cethereum&vs_currencies=usd', {json: true}, (err, response, body) => {
          if (err) {
            return console.log(err);
          }
          const bitcoin_usd_value = bitcoin_quantity * body.bitcoin.usd + Math.floor(Math.random() * 100);
          const ethereum_usd_value = ethereum_quantity * body.ethereum.usd + Math.floor(Math.random() * 100);
          const total_usd_value = bitcoin_usd_value + ethereum_usd_value + Math.floor(Math.random() * 100);
          const data = {username: req.user.username, btc: bitcoin_usd_value, eth: ethereum_usd_value, total: total_usd_value};
          res.jsonp(data);
        });
      });
};

const nosql_javascript_injection_get = (req, res) => {
  res.render('nosql-javascript-injection');
};

const secret_post = (req, res) => {
  MongoClient.connect(dbURL, mongodb_config, (err, client) => {
    if (err) return res.status('500').send('MongoDB is not installed, Please follow the installation guideline.');
    const db = client.db('vuln_nodejs_app');
    db.collection('secret').find({$where: 'this.password ==\''+req.body.password+'\''}).toArray()
        .then((secret) => {
          if (secret.length == 0) return res.status(403).send('Incorrect password!');
          res.send(secret[0].flag);
        }).catch((err) => {
          res.status(500).send('Internal server error!');
        });
  });
};


module.exports = {
  app_index,
  xss_lab,
  ping_get,
  ping_post,
  sqli_get,
  xxe_get,
  xxe_comment,
  ssti,
  auth_get,
  sitetoken_get,
  dashboard_get,
  userinfo_get,
  sqli_check_train_get,
  fixed_sqli_check_train_get,
  sqli_fixed_get,
  deserialization_get,
  save_preference_post,
  jwt1_get,
  jwt1ApiKey,
  notes_get,
  notes_post,
  userNotes_get,
  ticket_get,
  ticket_booking_get,
  generate_ticket_get,
  user_edit_get,
  edit_password_get,
  edit_password_post,
  organization_get,
  organization_post,
  add_user_get,
  add_user_post,
  myorg_get,
  myorg_users_get,
  apitoken_get,
  apitokenShow_get,
  cors_api_token_get,
  cors_csrf_edit_password_get,
  cors_csrf_edit_password_post,
  cors_csrf_edit_password_option,
  totp_setup_get,
  totp_setup_post,
  login_totp_verification_get,
  login_totp_verification_post,
  totp_disable_post,
  websocket_hijacking_get,
  websocket_xss_get,
  react_xss_get,
  react_xss_options,
  react_xss_post,
  mongodb_notes_get,
  mongodb_save_notes_post,
  mongodb_show_notes_post,
  graphql_user_profile_get,
  graphqlroot,
  graphql_information_disclosure_get,
  graphql_update_profile_get,
  graphql_idor_get,
  svg_xss_get,
  svg_xss_fileupload_post,
  jsonp_injection_get,
  jsonp_wallet_get,
  nosql_javascript_injection_get,
  secret_post,
};
