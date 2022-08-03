const express = require('express');
const app = express();
const router = require('./routes/app');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const {Users, Wallet} = require('./models/db');
const request = require('request');
const path = require('path');
const fileUpload = require('express-fileupload');

require('dotenv').config();

app.use(cookieParser());

app.use(express.urlencoded({extended: true}));

app.use(express.json());

app.use(fileUpload());

app.use(express.static('./uploads'));

app.use(router);

app.use(express.static('./assets'));

app.use(express.static(path.resolve(__dirname, './vuln_react_app/build')));

app.set('view engine', 'ejs');

const server = app.listen(process.env.HOST_PORT, function() {
  console.log('Listening on port ', process.env.HOST_PORT);
});

const io = require('socket.io')(server);
io.use((socket, next) => {
  const cookies = cookie.parse(socket.request.headers.cookie || '');
  const jwt_token = cookies.authToken;
  if (jwt_token) {
    jwt.verify(jwt_token, process.env.JWT_SECRET, (err, user) => {
      if (err) return next(new Error('Authentication error'));
      Users.findOne({attributes: ['username'], where: {username: user.username}})
          .then((queryResult) => {
            if (queryResult == null) return next(new Error('User does not exist in database!'));
            socket.user = queryResult;
            next();
          });
    });
  } else {
    next(new Error('Authentication error'));
  }
})
    .on('connection', function(socket) {
      console.log('A new client is connected');

      socket.on('crypto_usd_value', function(message) {
        Wallet.findOne({where: {username: socket.user.username}}, {attributes: ['BTC', 'ETH']})
            .then((crypto_balance)=>{
              const bitcoin_quantity = crypto_balance.BTC;
              const ethereum_quantity = crypto_balance.ETH;
              request('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cethereum&vs_currencies=usd', {json: true}, (err, res, body)=>{
                if (err) {
                  return console.log(err);
                }
                const bitcoin_usd_value = bitcoin_quantity * body.bitcoin.usd + Math.floor(Math.random() * 100);
                const ethereum_usd_value = ethereum_quantity * body.ethereum.usd + Math.floor(Math.random() * 100);
                const total_usd_value = bitcoin_usd_value + ethereum_usd_value + Math.floor(Math.random() * 100);
                socket.emit('crypto_usd_value', {'user': socket.user.username, 'btc': bitcoin_usd_value, 'eth': ethereum_usd_value, 'total': total_usd_value});
              });
            });
      });

      socket.on('new_message', (data) => {
        io.sockets.emit('new_message', {message: data.message, username: socket.user.username, login_user: socket.user.username});
      });
    });
