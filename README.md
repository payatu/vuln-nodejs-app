<div align="center">
<h1>
  Vulnerable NodeJS Application
</h1>
  
[![License](https://img.shields.io/badge/license--_red.svg)](https://opensource.org/licenses)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/github.com/payatu/vuln-nodejs-app/issues) 
[![version](https://img.shields.io/badge/version-v1.0-blue.svg?style=flat)](https://github.com/payatu/vuln-nodejs-app)
<br><br>
</div>

Vulnerable NodeJS application is developed for web application penetration testers, developers and secure code review. It can be easily deployed using docker or by manual install complete steps are provided below. this application will help you in learning how to find vulnerabilities in web applicaiton using black box, white box approach and in learning how to fix them.
  
<h2> How to use it?</h2>
  
  - Black box testing: Deploy the appplication using docker and start solving the exercises.
  - Secure code review:  Manually install the application this will allow you to use debugger while solving the exercises and will help you in finding vulnerabilities in application code.
  - Developers: Identify vulnerabilities in application code & try to fix them.

<h2>Tech Stack</h2>

- NodeJS
- Application design pattern: MVC
- Web framework: Express
- Template Engine: EJS
- SQL Database: MySQL
- NoSQL Database: MongoDB
- React to cover ReactJS exercise
- JWT for authentication
- GraphQL
- Socket.IO
- Docker

<h2> Preview </h2>
<a href="https://github.com/payatu/vuln-nodejs-app/blob/master/vuln-nodejs-app.png?raw=true"><img src="https://github.com/payatu/vuln-nodejs-app/blob/master/vuln-nodejs-app.png?raw=true" alt="vuln-nodejs-app" border="0">
<br>
</a>

<h2> Complete list of exercises </h2>

1. Command Injection
2. Insecure Deserialization
3. SQL Injection
4. XML external entity injection
5. XSS
6. Server Side Template Injection
7. JWT weak secret
8. Insecure direct object references
9. SSRF via PDF generator
10. postMessage XSS
11. postMessage CSRF
12. Information Disclosure using addEventListener
13. CORS Information Disclosure
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
25. XSS using SVG file uplaod
26. JSONP Injection
27. NoSQL Javascript Injection

<h2> Installation </h2>

<h3> Using docker-compose </h3> 

1. Clone the repository.

```bash
git clone https://github.com/payatu/vuln-nodejs-app.git
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

1. Clone the repository.

```bash
git clone https://github.com/payatu/vuln-nodejs-app.git
cd ./vuln-nodejs-app
```

2. Create **MySQL** database.

```bash
$ mysql -u <mysql_user> -p

mysql> create database vuln_nodejs_app;

```

3. Update your MySQL and MongoDB database username and password inside **.env** file.

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


4. Install dependencies.

```bash
npm install
```

5. Build React frontend.

```bash
npm run build
```

6. Start the server

```bash
node server.js
```
You can now access the application at http://localhost:9000
<br>
<h2> Solutions </h2>

Available in markdown and pdf format.

**PDF:** <a href="https://github.com/payatu/vuln-nodejs-app/blob/master/solutions/solutions.pdf">solutions.pdf</a><br/> 
**Markdown:** <a href="https://github.com/payatu/vuln-nodejs-app/blob/master/solutions/solutions.md">solutions.md</a><br/>
<br>
<h2>Contribution</h2>

Contributions are always appreciated and you can contribute in this project by following ways:

- By adding more exercises.
- By reporting issues or by solving open issues.
- By making pull request it can be for anything (UI, New Feature, Fixing mistyped words etc) 
- Don't have time to code but have an idea of exercise open a issue and we will implement it.
- By spreading the word about this project.
- By doing write-up of exercise we will add your writeup in community write-ups section.

<h2> TODO: </h2>

* <s>Dockerize the application</s>.
* Add more vulnerabilites.
* <s>Use database to store user information</s>.

<h2>Author</h2>
<a href="https://twitter.com/tauh33dkhan">@tauh33dkhan</a>

