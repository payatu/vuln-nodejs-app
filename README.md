# Vulnerable NodeJS Application
<br>
<a href="https://github.com/tauh33dkhan/vuln-nodejs-app/blob/master/vuln-nodejs-app.png?raw=true"><img src="https://github.com/tauh33dkhan/vuln-nodejs-app/blob/master/vuln-nodejs-app.png?raw=true" alt="vuln-nodejs-app" border="0">
<br>
</a>

## Installation

### Using docker-compose 

1. Download the repository.

```bash
git clone https://github.com/tauh33dkhan/vuln-nodejs-app.git
cd ./vuln-nodejs-app
```
2. Download and build the image.

```bash
docker-compose up --build -d
```

3. Start the application.
```
docker-compose up -d  # Remove -d flag if you want to see logs
```
access the application http://localhost:9000

### Manual install

1. Download the repository.

```bash
git clone https://github.com/tauh33dkhan/vuln-nodejs-app.git
cd ./vuln-nodejs-app
```

2. Create **mysql** database.

```bash
$ mysql -u root -p

mysql> create database vuln_nodejs_app;

```

3. Update your mysql username and password inside **.env** file.

```html
DB_PORT=3306
DB_NAME=vuln_nodejs_app
DB_USER=vuln_nodejs_user
DB_PASS=passw0rd
HOST_PORT=9000

```

4. Install the dependencies.

```bash
npm install
```

5. Start the server

```bash
node server.js
```
access the application http://localhost:9000

## TODO:

* <s>Dockerize the application</s>.
* Add more vulnerabilites.
* <s>Use database to store user information</s>.

