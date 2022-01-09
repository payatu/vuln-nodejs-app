var express = require('express');
var app = express();
var xssFilter = require('x-xss-protection');
var router = require('./routes/app');
var env = require('./env.js');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(xssFilter());

app.use(router);

app.set('view engine', 'ejs');

app.listen(env.port, function(){
  console.log("Listening on port", env.port);
});