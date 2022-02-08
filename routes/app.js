const express = require('express');
const vuln_handler = require("../controllers/vuln_handler");
const router = express.Router();
const auth_controller = require('../controllers/auth_controller');
const { authenticateToken } = require('../controllers/auth_controller');


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

router.get('/jwt1', auth_controller.authenticateToken, vuln_handler.jwt1_get);

router.get('/jwt1/apiKey', auth_controller.authenticateToken, vuln_handler.jwt1ApiKey);

router.route('/notes')
    .get(auth_controller.authenticateToken, vuln_handler.notes_get)
    .post(auth_controller.authenticateToken, vuln_handler.notes_post);

router.get('/notes/:username', auth_controller.authenticateToken, vuln_handler.userNotes_get);

router.route('/login')
    .get(auth_controller.login_get)
    .post(auth_controller.login_post);

router.get('/ticket', auth_controller.authenticateToken, vuln_handler.ticket_get);

router.get('/ticket/booking', auth_controller.authenticateToken, vuln_handler.ticket_booking_get);

router.get('/ticket/generate_ticket', vuln_handler.generate_ticket_get);

router.get('/user-edit', auth_controller.authenticateToken, vuln_handler.user_edit_get);

router.route('/edit-password')
    .get(auth_controller.authenticateToken, vuln_handler.edit_password_get)
    .post(auth_controller.authenticateToken, vuln_handler.edit_password_post)

router.route('/organization')
    .get(auth_controller.authenticateToken, vuln_handler.organization_get)
    .post(auth_controller.authenticateToken, vuln_handler.organization_post);

router.route('/organization/add-user')
    .get(auth_controller.authenticateToken, vuln_handler.add_user_get)
    .post(auth_controller.authenticateToken, vuln_handler.add_user_post);

router.get('/organization/myorg', auth_controller.authenticateToken, vuln_handler.myorg_get);

router.get('/organization/myorg/users', auth_controller.authenticateToken, vuln_handler.myorg_users_get);

router.get('/api-token', auth_controller.authenticateToken, vuln_handler.apitoken_get);

router.get('/api-token/show', auth_controller.authenticateToken, vuln_handler.apitokenShow_get);

router.get('/cors-api-token', auth_controller.authenticateToken, vuln_handler.cors_api_token_get);

router.route('/cors-csrf-edit-password')
    .get(auth_controller.authenticateToken, vuln_handler.cors_csrf_edit_password_get)
    .post(auth_controller.authenticateToken, vuln_handler.cors_csrf_edit_password_post)
    .options(vuln_handler.cors_csrf_edit_password_option);

router.route('/setup-totp')
    .get(auth_controller.authenticateToken, vuln_handler.totp_setup_get)
    .post(auth_controller.authenticateToken, vuln_handler.totp_setup_post);

router.route('/totp-verification')
    .get(auth_controller.authenticateToken, vuln_handler.login_totp_verification_get)
    .post(auth_controller.authenticateToken, vuln_handler.login_totp_verification_post);

router.post('/disable-totp', auth_controller.authenticateToken, vuln_handler.totp_disable_post);

router.get('/cross-site-websocket-hijacking', auth_controller.authenticateToken, vuln_handler.websocket_hijacking_get);

router.get('/websocket-xss', auth_controller.authenticateToken, vuln_handler.websocket_xss_get);

router.route('/react-xss')
    .get(auth_controller.authenticateToken, vuln_handler.react_xss_get)
    .options(vuln_handler.react_xss_options)
    .post(vuln_handler.react_xss_post);
    
module.exports = router;