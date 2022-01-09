const express = require('express');
const vuln_handler = require("../controllers/vuln_handler")
const router = express.Router();


router.get('/', vuln_handler.authenticateToken, vuln_handler.app_index);

router.route('/register')
    .get(vuln_handler.register_get)
    .post(vuln_handler.register_post);

router.get('/xss', vuln_handler.authenticateToken, vuln_handler.xss_lab);

router.route('/ping', vuln_handler.authenticateToken)
    .get(vuln_handler.ping_get)
    .post(vuln_handler.ping_post);

router.get('/sqli', vuln_handler.authenticateToken, vuln_handler.sqli_get);

router.get('/xxe', vuln_handler.authenticateToken, vuln_handler.xxe_get);

router.post('/comment', vuln_handler.authenticateToken, vuln_handler.xxe_comment);

router.get('/auth', vuln_handler.auth_get);

router.get('/dashboard', vuln_handler.dashboard_get);

router.get('/userinfo', vuln_handler.authenticateToken, vuln_handler.userinfo_get);

router.get('/sitetoken/:username', vuln_handler.authenticateToken, vuln_handler.sitetoken_get);

router.get('/sqli/:from-:to', vuln_handler.authenticateToken, vuln_handler.sqli_check_train_get);

router.get('/sqli-fixed/:from-:to', vuln_handler.authenticateToken, vuln_handler.fixed_sqli_check_train_get);

router.get('/sqli-fixed/', vuln_handler.authenticateToken, vuln_handler.sqli_fixed_get)

router.get('/logout', vuln_handler.authenticateToken, vuln_handler.logout_get);

router.get('/deserialization', vuln_handler.authenticateToken, vuln_handler.deserialization_get);

router.post('/save-preference', vuln_handler.authenticateToken, vuln_handler.save_preference_post);

router.get('/ssti', vuln_handler.authenticateToken, vuln_handler.ssti);

router.get('/logout', vuln_handler.authenticateToken, vuln_handler.logout_get);

router.get('/jwt1', vuln_handler.authenticateToken, vuln_handler.jwt1_get);

router.get('/jwt1/apiKey', vuln_handler.authenticateToken, vuln_handler.jwt1ApiKey);
module.exports = router;