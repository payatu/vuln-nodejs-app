var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://vuln_nodejs_app:passw0rd@cluster0.leydh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  dbo = db.db('vuln_nodejs_app');
  dbo.collection("mongodb-notes").find({username:'hacker'}).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
  });
});
