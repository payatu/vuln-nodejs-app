# Vulnerable NodeJS Application
<br>
<a href="https://github.com/tauh33dkhan/vuln-nodejs-app/blob/master/vuln-nodejs-app.png?raw=true"><img src="https://github.com/tauh33dkhan/vuln-nodejs-app/blob/master/vuln-nodejs-app.png?raw=true" alt="vuln-nodejs-app" border="0">
<br>
</a>

## Exercises

1. Command Injection
2. Insecure Deserialization
3. SQL Injection
4. XML external entity injection
5. XSS
6. Server Side Template Injection
7. JWT weak secret
8. Insecure direct object references
9. SSRF via PDF generator
10. Web message XSS
11. Web message CSRF
12. Web message Information Disclosure
13. CORS information Disclosure
14. CORS CSRF
15. 2FA Insecure Implementation
16. Cross-Site WebSocket Hijacking
17. WebSocket XSS
18. ReactJS href XSS
19. React ref-innerHTML XSS
20. NoSQL Injection
21. GraphQL Information Disclosure
22. GraphQL SQL Injection
23. GraphQL CSRF
24. GraphQL IDOR
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

3. Update your mysql and mongodb database username and password inside **.env** file.

```html
DB_PORT=3306
DB_NAME=vuln_nodejs_app
DB_USER=vuln_nodejs_user
DB_PASS=passw0rd
HOST_PORT=9000
JWT_SECRET=secret
MONGODB_SERVER=localhost
MONGODB_ADMINUSERNAME=
MONGODB_ADMINPASSWORD=
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
You can now access the application at http://localhost:9000

## Solutions

**PDF:** <a href="https://github.com/payatu/vuln-nodejs-app/blob/master/solutions/solutions.pdf">solutions.pdf</a><br/> 
**Markdown:** <a href="https://github.com/payatu/vuln-nodejs-app/blob/master/solutions/solutions.md">solutions.md</a><br/> 

## TODO:

* <s>Dockerize the application</s>.
* Add more vulnerabilites.
* <s>Use database to store user information</s>.

