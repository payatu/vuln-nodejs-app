const md5 = require('md5');
const crypto = require('crypto');
const {Users, Org, Wallet} = require('../models/db');
const jwt = require('jsonwebtoken');
const emailvalidator = require('email-validator');

function generateAccessToken(username) {
  const payload = {'username': username};
  return jwt.sign(payload, process.env.JWT_SECRET);
}

function authenticateToken(req, res, next) {
  const jwt_token = req.cookies.authToken;
  if (jwt_token == null) {
    return res.redirect('/login');
  };

  jwt.verify(jwt_token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    Users.findOne({attributes: ['id', 'username', 'email', 'orgname', 'apiToken', 'totpSecret', 'profilePic'], where: {username: user.username}})
        .then((queryResult) => {
          if (queryResult == null) {
            res.clearCookie('authToken', '');
            res.redirect('/login');
          } else {
            req.user = queryResult;
            next();
          }
        });
  });
}

const register_get = (req, res) => {
  res.render('register.ejs');
};

function gift_crypto(max, min) {
  return (Math.random() * (max - min) + min).toFixed(8);
}

const register_post = (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  if (!emailvalidator.validate(email)) {
    res.send(res.status(400).send('Invalid email'));
  }
  Users.findAll({where: {username: username}})
      .then((count) => {
        if (count.length != 0) {
          res.status(403).send('User already registerd!');
        } else {
          if (username !== '' & password !== '' & email !== '') {
            const apiToken = crypto.randomBytes(20).toString('hex');
            Users.create({username: username, email: email, password: md5(password), orgname: '', apiToken: apiToken, totpSecret: ''});
            Org.create({orgname: '', owner: username});
            Wallet.create({username: username, BTC: gift_crypto(0.0025, 0.001), ETH: gift_crypto(0.5, 0.1)});
            const jwt_token = generateAccessToken(username, email);
            res.cookie('authToken', jwt_token);
            res.send(jwt_token);
          } else {
            res.status(400).send('username/password/email can not be null');
          }
        }
      });
};

const logout_get = (req, res) => {
  res.clearCookie('authToken', '');
  res.redirect('/login');
};

const login_get = (req, res) => {
  res.render('login');
};

const login_post = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username !== '' & password !== '') {
    Users.findOne({where: {username: username, password: md5(password)}})
        .then((user) => {
          if (user) {
            const jwt_token = generateAccessToken(username, user.email);
            if (user.totpSecret != '') {
              res.cookie('authToken', jwt_token);
              res.status(200).send('/totp-verification');
            } else {
              res.cookie('authToken', jwt_token);
              res.status(200).send('/');
            }
          } else {
            res.status(403).send('Invalid username/password.');
          }
        });
  } else {
    res.status(400).send();
  }
};

module.exports = {
  register_get,
  register_post,
  authenticateToken,
  logout_get,
  login_get,
  login_post,
};
