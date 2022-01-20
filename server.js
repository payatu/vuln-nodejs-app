var express = require('express');
var app = express();
var xssFilter = require('x-xss-protection');
var router = require('./routes/app');
const cookieParser = require('cookie-parser');
require("dotenv").config();

app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(router);
app.use(express.static('./assets'))

app.set('view engine', 'ejs');

app.listen(process.env.HOST_PORT, function(){
  console.log("Listening on port tester", process.env.HOST_PORT);
});
