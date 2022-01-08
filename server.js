var express = require('express');
var app = express();
var xssFilter = require('x-xss-protection');
var router = require('./routes/app');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(xssFilter());

app.use(router);

app.set('view engine', 'ejs');

app.listen(80, function(){
  console.log("Listening on port 80");
});
