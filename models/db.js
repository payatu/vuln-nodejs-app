const Sequelize = require('sequelize');
const env = require('../env.js');
const sequelize = new Sequelize(`mysql://${env.mySQLUser}:${env.mySQLPass}@${env.mySQLHost}/${env.mySQLDB}`);
const crypto = require('crypto');

sequelize
    .authenticate()
    .then(()=>{
        console.log('Connected to database!')
    })
    .catch((err)=>{
        console.log('Unable to connect to database', err)
    });

const Train = sequelize.define('trains', {'from_stnt': Sequelize.STRING, 
    'to_stnt': Sequelize.STRING, 'ntrains': Sequelize.INTEGER});

const Users = sequelize.define('users', {'username': Sequelize.STRING,
    'email': Sequelize.STRING, 'password': Sequelize.STRING, 'orgname': Sequelize.STRING,
    'apiToken': Sequelize.STRING})

const Org = sequelize.define('orgs',{"orgname":Sequelize.STRING, "owner":Sequelize.STRING})

const Notes = sequelize.define('notes', {"username": Sequelize.STRING, "noteTitle": Sequelize.STRING,
"noteBody": Sequelize.STRING}) 


sequelize.sync({force: true})
    .then(()=>{
        Train.bulkCreate([
            {from_stnt: 'Delhi', to_stnt:'Kolkata', ntrains: 7},
            {from_stnt: 'Delhi', to_stnt:'Mumbai', ntrains: 9},
            {from_stnt: 'Delhi', to_stnt:'Lucknow', ntrains: 6},
            {from_stnt: 'Delhi', to_stnt:'Ahmedabad', ntrains: 5},
            {from_stnt: 'Delhi', to_stnt:'Chennai', ntrains: 3}
        ]);
        // Debug promise
        // .then(()=>{
        //     return Train.findAll();
        // }).then((train)=>{
        //     console.log(train);
        // }); 
        Users.create(
            {username: 'vulnlabAdmin', email:'vulnlabAdmin@vuln.js', password: 'SuperSecurePassword', orgname: '', apiToken: crypto.randomBytes(20).toString('hex')}
        );
        Notes.create(
            {username:'vulnlabAdmin', noteTitle:'ThisIsAdminNote', noteBody:'SuperSecretNote'}
        );
    });

module.exports = {
    Train,
    Users,
    Notes,
    Org
}
