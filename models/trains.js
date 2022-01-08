const pg = require('pg')
const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:secret@localhost/vulnlab');

sequelize
    .authenticate()
    .then(()=>{
        console.log('Connected to database!')
    })
    .catch((err)=>{
        console.log('Unable to connect to database', err)
    });

const Train = sequelize.define('train', {'from_stnt': Sequelize.STRING, 
    'to_stnt': Sequelize.STRING, 'ntrains': Sequelize.INTEGER});

sequelize.sync({force: true})
    .then(()=>{
        Train.bulkCreate([
            {from_stnt: 'Delhi', to_stnt:'Kolkata', ntrains: 7},
            {from_stnt: 'Delhi', to_stnt:'Mumbai', ntrains: 9},
            {from_stnt: 'Delhi', to_stnt:'Lucknow', ntrains: 6},
            {from_stnt: 'Delhi', to_stnt:'Ahmedabad', ntrains: 5},
            {from_stnt: 'Delhi', to_stnt:'Chennai', ntrains: 3}
        ]).then(()=>{
            return Train.findAll();
        }).then((train)=>{
            console.log(train);
        });
    });

module.exports = {
    Train
}
