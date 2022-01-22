var exec = require('child_process').exec;
var execFile = require('child_process').execFile;
var libxmljs = require('libxmljs');
var db = require('../models/db.js');
var serialize = require('node-serialize');
const mysql = require('mysql2');
const { Train, Users, Notes, Org } = require('../models/db.js');
var ejs = require('ejs');
var html_to_pdf = require('html-pdf-node');
const { Op } = require('sequelize')
const md5 = require('md5');

var con = mysql.createConnection({
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    connectTimeout: 10000
});

// route handling
const app_index = (req, res) => {
    res.render('index');
}

const xss_lab = (req, res) => {
    const xss1 = req.query.xss1;
    const xss2 = req.query.xss2;
    const xss3 = req.query.xss3;
    res.render('xss', {
        xss1: xss1,
        xss2: xss2,
        xss3: xss3
    });
}

const ping_get = (req, res) => {
    res.render('ping', {
        output: null,
        pingoutput: null
    })
}

const ping_post = (req, res) => {
    const ping = req.body.ping;
    const ping1 = req.body.ping1;
    if (ping) {
        exec('ping -c 3 ' + req.body.ping, function (err, stdout, stderr) {
            output = stdout + stderr;
            res.render('ping', {
                output: output,
                pingoutput: null
            });
        });
    }
    if (ping1) {
        execFile('/usr/bin/ping', ['-c', '3', ping1], function (err, stdout, stderr) {
            pingoutput = stdout + stderr;
            res.render('ping', {
                pingoutput: pingoutput,
                output: null
            });
        });
    }
}

const sqli_get = (req, res) => {
    res.render('sqli')
}

const sqli_check_train_get = (req, res) => {
    const from = req.params.from;
    const to = req.params.to;
    const q = "SELECT ntrains FROM trains where from_stnt='" + from + "' and to_stnt='" + to + "';";
    con.connect(function (err) {
        if (err) throw err;
        con.query(q, (err, results) => {
            if (err) {
                res.send(err);
            };
            res.send(JSON.stringify(results));
        });
    });
}

const sqli_fixed_get = (req, res) => {
    res.render('sqli-fixed');
}

const fixed_sqli_check_train_get = (req, res) => {
    const from = req.params.from;
    const to = req.params.to;
    Train.findAll({ where: { from_stnt: from, to_stnt: to } }).then((trains) => res.send(trains))
        .catch(() => res.send('Internal error occured!'));
}

const xxe_get = (req, res) => {
    res.render('xxe', {
        comment: null
    });
}

const xxe_comment = (req, res) => {
    const rawcomment = req.body.comment;
    const parsecomment = libxmljs.parseXmlString(rawcomment, { noent: true, noblanks: true });
    var comment = parsecomment.get('//content');
    comment = comment.text();
    res.send(comment);
}

const auth_get = (req, res) => {
    res.render('auth');
}

const sitetoken_get = (req, res) => {
    const username = req.params['username'];
    if (!(username in tokens)) {
        res.send("Only user `admin` can access the token");
    } else {
        res.send(tokens.admin)
    }
}

const dashboard_get = (req, res) => {
    res.render('dashboard');
}

const userinfo_get = (req, res) => {
    res.send(req.user);
}

const deserialization_get = (req, res) => {
    res.render('deserialization');
}


const save_preference_post = (req, res) => {
    const preference = serialize.unserialize(req.cookies.preference);
    res.send(preference);
}

const ssti = (req, res) => {
    const op = req.query.op;
    var totalTrains = 'Total Number of Trains: 37';
    var totalStation = 'Total Number of Station: 4';
    var stationList = `{"stationList": ["Lucknow", "Mumbai", "Delhi", "Kanpur"]}`
    if (req.query.op) {
        var template = `Result: <p><%=` + op + `%>`;
    } else {
        var template = `<a href="/ssti?op=stationList">Station List</a>
        <br>
        <a href="/ssti?op=totalTrains">Total Trains</a>
        <br>
        <a href="/ssti?op=totalStation">Total Station</a>`;
    }
    res.send(ejs.render(template, {
        totalTrains: totalTrains,
        totalStation: totalStation,
        stationList: stationList
    }));
}

const jwt1_get = (req, res) => {
    res.render('jwt1');
}
// user for BAC lab
var apiKeyObject = { "vulnlabAdmin": "YouHaveCompletedTheExcercise" };

const jwt1ApiKey = (req, res) => {
    const username = req.user.username;
    // in real application they will fetch this information from database.
    if (!(username in apiKeyObject)) {
        res.send("8992f664e4829c4e4d5e477e0c619f5c");
    } else {

        res.send(apiKeyObject.vulnlabAdmin);
    }
}

const notes_get = (req, res) => {
    res.render('notes', {
        username: req.user.username
    });
}

const notes_post = (req, res) => {
    const noteTitle = req.body.noteTitle;
    const noteBody = req.body.noteBody;
    const username = req.user.username;
    Notes.create({ username: username, noteTitle: noteTitle, noteBody: noteBody })
        .then((note) => {
            res.send(JSON.stringify(note));
        })
}

const userNotes_get = (req, res) => {
    const username = req.params.username;
    Notes.findAll({ where: { username: username } })
        .then((queryResult) => {
            res.header("Content-Type", "application/json")
            res.send(JSON.stringify(queryResult));
        })
}


const ticket_get = (req, res) => {
    res.render('ticket');
}

const generate_ticket_get = (req, res) => {
    res.render('ticket-booking', {
        passenger: req.query.passenger_name,
        from_stnt: req.query.from_stnt,
        to_stnt: req.query.to_stnt,
        date: req.query.date
    });
}

const ticket_booking_get = (req, res) => {

    let options = { path: "test.pdf" };
    let file = { url: `http://localhost:${env.HOST_PORT}/ticket/generate_ticket?passenger_name=${req.query.passenger_name}&from_stnt=${req.query.from_stnt}&to_stnt=${req.query.to_stnt}&date=${req.query.date}` };

    html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
        res.header('Content-Disposition', 'attachment; filename="ticket.pdf"');
        res.send(pdfBuffer);
    });
}

const user_edit_get = (req, res) => {
    Users.findOne({ where: { username: req.user.username } })
        .then((user) => {
            console.log(user);
            res.render('user-edit', {
                username: user.username,
                email: user.email
            })
        })




}

const edit_password_post = (req, res) => {
    Users.update({ password: md5(req.body.password) }, { where: { username: req.user.username } })
        .then((queryResults) => {
            res.send("Password update Successfull!");
        })
        .catch((err) => {
            res.send('Unexpected error occured');
        })
}

const edit_password_get = (req, res) => {
    res.render('edit_password');
}

const organization_get = (req, res) => {
    const token = req.cookies.authToken;
    res.render('organization', {
        token
    });
}

const organization_post = (req, res) => {
    Org.update({ orgname: req.body.orgname }, { where: { owner: req.user.username } })
        .then(() => {
            Users.update({ orgname: req.body.orgname }, { where: { username: req.user.username } });
            res.send(req.body.orgname);
        })
}


const add_user_get = (req, res) => {
    Org.findOne({ attributes: ['orgname'] }, { where: { owner: req.user.username } })
        .then((queryResult) => {
            const orgname = queryResult.orgname;
            Users.findAll({ where: { username: { [Op.ne]: req.user.username } }, attributes: ['username'] })
                .then((users) => {
                    console.log(users);
                    res.render('add-user', {
                        orgname,
                        users
                    });
                })
                .catch((err) => {
                    console.log(err)
                })
        })
}

const add_user_post = (req, res) => {
    Org.findOne({ attributes: ['orgname'], where: { owner: req.user.username } })
        .then((queryResult) => {
            console.log(queryResult.orgname);
            Users.update({ orgname: queryResult.orgname }, { where: { username: req.body.user } })
                .then((updateResult) => {
                    res.send('User added!')
                });
        })
}


const myorg_get = (req, res) => {
    Org.findOne({ where: { owner: req.user.username } })
        .then((queryResult) => {
            console.log(queryResult)
            if (!queryResult.orgname == '') {
                res.send(queryResult.orgname);
            } else {
                res.status(404).send("No org found!")
            }
        })
        .catch((err) => {
            console.log(err)
            res.status(500).send("Internal Server Error")
        })
}

const myorg_users_get = (req, res) => {
    Org.findOne({ attributes: ['orgname'], where: { owner: req.user.username } })
        .then((queryResult) => {
            if (!queryResult.orgname == '') {
                Users.findAll({ attributes: ['username'], where: { username: { [Op.ne]: req.user.username }, orgname: queryResult.orgname } })
                    .then((queryResult) => {
                        if (!queryResult == '') {
                            res.send(queryResult);
                        } else {
                            res.status(404).send("No org users found!")
                        }
                    })
            } else {
                res.status(404).send('No org found!');
            }
        })
        .catch((err) => {
            console.log(err)
            res.status(404).send("Internal Server Error")
        })
}

const apitoken_get = (req, res) => {
    res.render('api-token');
}

const apitokenShow_get = (req, res) => {
    const apiToken = req.user.apiToken
    res.render('api-token-popup', { apiToken });
}

const cors_api_token_get = (req, res) => {
    const apiToken = req.user.apiToken;
    if (req.get('origin') !== undefined) {
        res.header("Access-Control-Allow-Origin", req.get('origin'));
        res.header("Access-Control-Allow-Credentials", 'true');
    }
    res.render('cors-api-token', { apiToken })
}

const cors_csrf_edit_password_get = (req, res) => {
    res.render('cors-edit-password');
}

const cors_csrf_edit_password_post = (req, res) => {
    if (req.get('origin') !== undefined) {
        res.header("Access-Control-Allow-Origin", req.get('origin'));
        res.header("Access-Control-Allow-Credentials", 'true');
    }
    if (!req.is('application/json')) return res.status(400).send('Invalid content type')
    if (req.body.password == '' || req.body.password == undefined || req.body.password == null) return res.sendStatus('400');
    Users.update({ password: md5(req.body.password) }, { where: { username: req.user.username } })
        .then((queryResults) => {
            res.send("Password update Successfull!");
        })
        .catch((err) => {
            res.send('Unexpected error occured');
        })
}

const cors_csrf_edit_password_option = (req, res) => {
    if (req.get('origin') !== undefined) {
        res.header("Access-Control-Allow-Origin", req.get('origin'));
        res.header("Access-Control-Allow-Credentials", 'true');
        res.header("Access-Control-Allow-Methods", 'GET, POST');
        res.header("Access-Control-Allow-Headers", 'Content-Type');
        res.header("Access-Control-Max-Age", '5');
    }
    res.send(200);
}


module.exports = {
    app_index,
    xss_lab,
    ping_get,
    ping_post,
    sqli_get,
    xxe_get,
    xxe_comment,
    auth_get,
    sitetoken_get,
    dashboard_get,
    userinfo_get,
    sqli_check_train_get,
    fixed_sqli_check_train_get,
    sqli_fixed_get,
    deserialization_get,
    save_preference_post,
    ssti,
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
    cors_csrf_edit_password_option
}
