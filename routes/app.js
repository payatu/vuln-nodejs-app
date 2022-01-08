const express = require('express');
const vuln_handler = require("../controllers/vuln_handler")
const router = express.Router();


router.get('/', vuln_handler.app_index);

router.get('/xss', vuln_handler.xss_lab);

router.route('/ping')
    .get(vuln_handler.ping_get)
    .post(vuln_handler.ping_post);

router.get('/sqli', vuln_handler.sqli_get);

router.get('/xxe', vuln_handler.xxe_get);

router.post('/comment', vuln_handler.xxe_comment);

router.get('/auth', vuln_handler.auth_get);

router.post('/register', vuln_handler.register_post );

router.get('/dashboard', vuln_handler.dashboard_get);

router.get('/userinfo', vuln_handler.authenticateToken, vuln_handler.userinfo_get);

router.get('/sitetoken/:username', vuln_handler.authenticateToken, vuln_handler.sitetoken_get);

router.get('/sqli/:from-:to', vuln_handler.sqli_check_train_get);

router.get('/sqli-fixed/:from-:to', vuln_handler.fixed_sqli_check_train_get);

router.get('/sqli-fixed/', vuln_handler.sqli_fixed_get)

router.get('/logout', vuln_handler.logout_get);

router.get('/jwt1', vuln_handler.jwt1_get);


module.exports = router;