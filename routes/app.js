const express = require('express');
const vuln_handler = require("../controllers/vuln_handler");
const router = express.Router();
const auth_controller = require('../controllers/auth_controller');


router.get('/', auth_controller.authenticateToken, vuln_handler.app_index);

router.route('/register')
    .get(auth_controller.register_get)
    .post(auth_controller.register_post);

router.get('/xss', auth_controller.authenticateToken, vuln_handler.xss_lab);

router.route('/ping')
    .get(auth_controller.authenticateToken, vuln_handler.ping_get)
    .post(auth_controller.authenticateToken, vuln_handler.ping_post);

router.get('/sqli', auth_controller.authenticateToken, vuln_handler.sqli_get);

router.get('/xxe', auth_controller.authenticateToken, vuln_handler.xxe_get);

router.post('/comment', auth_controller.authenticateToken, vuln_handler.xxe_comment);

router.get('/auth', vuln_handler.auth_get);

router.get('/dashboard', vuln_handler.dashboard_get);

router.get('/userinfo', auth_controller.authenticateToken, vuln_handler.userinfo_get);

router.get('/sitetoken/:username', auth_controller.authenticateToken, vuln_handler.sitetoken_get);

router.get('/sqli/:from-:to', auth_controller.authenticateToken, vuln_handler.sqli_check_train_get);

router.get('/sqli-fixed/:from-:to', auth_controller.authenticateToken, vuln_handler.fixed_sqli_check_train_get);

router.get('/sqli-fixed/', auth_controller.authenticateToken, vuln_handler.sqli_fixed_get)

router.get('/logout', auth_controller.authenticateToken, auth_controller.logout_get);

router.get('/deserialization', auth_controller.authenticateToken, vuln_handler.deserialization_get);

router.post('/save-preference', auth_controller.authenticateToken, vuln_handler.save_preference_post);

router.get('/ssti', auth_controller.authenticateToken, vuln_handler.ssti);

router.get('/logout', auth_controller.authenticateToken, auth_controller.logout_get);

router.get('/jwt1', auth_controller.authenticateToken, vuln_handler.jwt1_get);

router.get('/jwt1/apiKey', auth_controller.authenticateToken, vuln_handler.jwt1ApiKey);

router.route('/notes')
    .get(auth_controller.authenticateToken, vuln_handler.notes_get)
    .post(auth_controller.authenticateToken, vuln_handler.notes_post);

router.get('/notes/:username', auth_controller.authenticateToken, vuln_handler.userNotes_get);

router.route('/login')
    .get(auth_controller.login_get)
    .post(auth_controller.login_post);

module.exports = router;