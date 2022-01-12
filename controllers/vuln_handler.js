var exec = require('child_process').exec;
var execFile = require('child_process').execFile;
var libxmljs = require('libxmljs');
var db = require('../models/db.js');
var serialize = require('node-serialize');
const mysql = require('mysql2');
const { Train, Users, Notes } = require('../models/db.js');
var env = require('../env.js');
var ejs = require('ejs')


var con = mysql.createConnection({
    host: env.mySQLHost,
    port: env.mySQLPort,
    database: env.mySQLDB,
    user: env.mySQLUser,
    password: env.mySQLPass
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
    con.connect(function(err) {
        if (err) throw err;
        con.query(q, (err, results) => {
          if (err){
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
    db.Train.findAll({ where: { from_stnt: from, to_stnt: to } }).then((trains) => res.send(trains))
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
    const preference = serialize.unserialize(req.cookies.preference)
    console.log(preference)
    res.send(preference);
}

const ssti = (req, res) => {
    const op = req.query.op;
    var totalTrains = 'Total Number of Trains: 37';
    var totalStation = 'Total Number of Station: 4';
    var stationList = `{"stationList": ["Lucknow", "Mumbai", "Delhi", "Kanpur"]}`
    if (req.query.op){
        var template = `Result: <p><%=` + op + `%>`;
    } else {
        var template = `<a href="/ssti?op=stationList">Station List</a>
        <br>
        <a href="/ssti?op=totalTrains">Total Trains</a>
        <br>
        <a href="/ssti?op=totalStation">Total Station</a>`;
    }
    res.send(ejs.render(template, { totalTrains: totalTrains,
        totalStation: totalStation,
        stationList: stationList
    }));
}

const jwt1_get = (req, res) =>{
    res.render('jwt1');
}
// user for BAC lab
var apiKeyObject = { "vulnlabAdmin": "YouHaveCompletedTheExcercise" };

const jwt1ApiKey = (req, res) => {
    const username = req.user.username;
    // in real application they will fetch this information from database.
    if (!(username in apiKeyObject)){
        res.send("8992f664e4829c4e4d5e477e0c619f5c");
    } else {
        
        res.send(apiKeyObject.vulnlabAdmin);
    }
}

const notes_get = (req,res)=>{
    res.render('notes', {
        username: req.user.username
    });
}

const notes_post = (req, res)=>{
    const noteTitle = req.body.noteTitle;
    const noteBody = req.body.noteBody;
    const username = req.user.username;
    Notes.create({username: username, noteTitle: noteTitle, noteBody: noteBody})
        .then((note)=>{
            res.send(JSON.stringify(note));
        })
}

const userNotes_get = (req, res)=> {
    const username = req.params.username;
    Notes.findAll({where:{username:username}})
        .then((result)=>{
            res.header("Content-Type", "application/json")
            res.send(JSON.stringify(result));
        })
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
}