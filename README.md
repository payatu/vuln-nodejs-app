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
$ mysql -u <mysql_user> -p

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

5. Build ReactJs frontend.

```bash
npm run build
```

6. Start the server

```bash
node server.js
```
access the application http://localhost:9000

## Exercises

* Command Injection
* Insecure Deserialization
* SQL Injection
* XML external entity injection
* XSS
* Server Side Template Injection
* JWT weak secret
* Insecure direct object references
* SSRF via PDF generator
* Web message XSS
* Web message CSRF
* Web message Information Disclosure
* CORS information Disclosure
* CORS CSRF
* 2FA Insecure Implementation
* Cross-Site WebSocket Hijacking
* WebSocket XSS
* ReactJS XSS

## TODO:

* <s>Dockerize the application</s>.
* Add more vulnerabilites.
* <s>Use database to store user information</s>.

