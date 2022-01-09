# vuln-nodejs-app

## Installation

1. Download

```bash
git clone https://github.com/tauh33dkhan/vuln-nodejs-app.git
cd ./vuln-nodejs-app
```

2. Create **mysql** database.

```bash
$ mysql -u root -p

mysql> create database vuln_nodejs_app;

```

3. Update your mysql username and password inside **env.js** file.

```html
module.exports = {
  listen: "0.0.0.0",
  port:	  "9000",
  mySQLHost: "0.0.0.0",
  mySQLPort: "3306",
  mySQLUser: "root",
  mySQLDB: "vuln_nodejs_app",
  mySQLPass: "<your-password>"
}
```

4. Install the dependencies.

```bash
npm install
```

5. Start the server

```bash
node server.js
```

## TODO:

* Dockerize the application.
* Add more vulnerabilites.
* Use database to store user information.

