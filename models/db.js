const Sequelize = require('sequelize');
const crypto = require('crypto');
require("dotenv").config();


const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASS, {
    dialect: 'mysql',
    dialectOptions: {
        host: process.env.DB_HOST
    }
})

sequelize
    .authenticate()
    .then(() => {
        console.log('Connected to database!')
    })
    .catch((err) => {
        console.log(err)
        console.log('Unable to connect to database!')
    });

const Train = sequelize.define('trains', {
    'from_stnt': Sequelize.STRING,
    'to_stnt': Sequelize.STRING,
    'ntrains': Sequelize.INTEGER
});

const Users = sequelize.define('users', {
    'username': Sequelize.STRING,
    'email': Sequelize.STRING, 
    'password': Sequelize.STRING, 
    'orgname': Sequelize.STRING,
    'apiToken': Sequelize.STRING,
    'totpSecret': Sequelize.STRING,
    "profilePic": {
        type: Sequelize.STRING,
        defaultValue: "default.png"
    }
})

const Org = sequelize.define('orgs', { 
    "orgname": Sequelize.STRING, 
    "owner": Sequelize.STRING 
})

const Notes = sequelize.define('notes', {
    "userid": Sequelize.INTEGER,
    "username": Sequelize.STRING, 
    "noteTitle": Sequelize.STRING,
    "noteBody": Sequelize.STRING
})

const Wallet = sequelize.define('wallets',{
    "username": Sequelize.STRING,
    "BTC": Sequelize.FLOAT,
    "ETH": Sequelize.FLOAT
})

sequelize.sync({ force: true })
    .then(() => {
        Train.bulkCreate([
            { from_stnt: 'Delhi', to_stnt: 'Kolkata', ntrains: 7 },
            { from_stnt: 'Delhi', to_stnt: 'Mumbai', ntrains: 9 },
            { from_stnt: 'Delhi', to_stnt: 'Lucknow', ntrains: 6 },
            { from_stnt: 'Delhi', to_stnt: 'Ahmedabad', ntrains: 5 },
            { from_stnt: 'Delhi', to_stnt: 'Chennai', ntrains: 3 }
        ]);
        Users.create({
            username: 'vulnlabAdmin', 
            email: 'vulnlabAdmin@vuln.js',
            password: 'SuperSecurePassword',
            orgname: '',
            apiToken:"YouHaveCompletedTheExcercise",
            totpSecret: '',
            profilePic: 'default.png' }
        );
        Notes.create({
            userid:'1',
            username: 'vulnlabAdmin',
            noteTitle: 'ThisIsAdminNote',
            noteBody: 'SuperSecretNote'
        });
        Wallet.create({
            username: "vulnlabAdmin",
            BTC: "0.00245",
            ETH: "0.5"
        })
    })
    .catch((err) => {
        console.log(err)
        console.log('Unable to connect to database!')
    });

module.exports = {
    Train,
    Users,
    Notes,
    Org,
    Wallet
}
