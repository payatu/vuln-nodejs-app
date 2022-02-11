const express = require('express');
const vuln_controller = require("../controllers/vuln_controller");
const router = express.Router();
const auth_controller = require('../controllers/auth_controller');
const { authenticateToken } = require('../controllers/auth_controller');


router.get('/', auth_controller.authenticateToken, vuln_controller.app_index);

router.route('/register')
    .get(auth_controller.register_get)
    .post(auth_controller.register_post);

router.get('/xss', auth_controller.authenticateToken, vuln_controller.xss_lab);

router.route('/ping')
    .get(auth_controller.authenticateToken, vuln_controller.ping_get)
    .post(auth_controller.authenticateToken, vuln_controller.ping_post);

router.get('/sqli', auth_controller.authenticateToken, vuln_controller.sqli_get);

router.get('/xxe', auth_controller.authenticateToken, vuln_controller.xxe_get);

router.post('/comment', auth_controller.authenticateToken, vuln_controller.xxe_comment);

router.get('/auth', vuln_controller.auth_get);

router.get('/dashboard', vuln_controller.dashboard_get);

router.get('/userinfo', auth_controller.authenticateToken, vuln_controller.userinfo_get);

router.get('/sitetoken/:username', auth_controller.authenticateToken, vuln_controller.sitetoken_get);

router.get('/sqli/:from-:to', auth_controller.authenticateToken, vuln_controller.sqli_check_train_get);

router.get('/sqli-fixed/:from-:to', auth_controller.authenticateToken, vuln_controller.fixed_sqli_check_train_get);

router.get('/sqli-fixed/', auth_controller.authenticateToken, vuln_controller.sqli_fixed_get)

router.get('/logout', auth_controller.authenticateToken, auth_controller.logout_get);

router.get('/deserialization', auth_controller.authenticateToken, vuln_controller.deserialization_get);

router.post('/save-preference', auth_controller.authenticateToken, vuln_controller.save_preference_post);

router.get('/ssti', auth_controller.authenticateToken, vuln_controller.ssti);

router.get('/jwt1', auth_controller.authenticateToken, vuln_controller.jwt1_get);

router.get('/jwt1/apiKey', auth_controller.authenticateToken, vuln_controller.jwt1ApiKey);

router.route('/notes')
    .get(auth_controller.authenticateToken, vuln_controller.notes_get)
    .post(auth_controller.authenticateToken, vuln_controller.notes_post);

router.get('/notes/:username', auth_controller.authenticateToken, vuln_controller.userNotes_get);

router.route('/login')
    .get(auth_controller.login_get)
    .post(auth_controller.login_post);

router.get('/ticket', auth_controller.authenticateToken, vuln_controller.ticket_get);

router.get('/ticket/booking', auth_controller.authenticateToken, vuln_controller.ticket_booking_get);

router.get('/ticket/generate_ticket', vuln_controller.generate_ticket_get);

router.get('/user-edit', auth_controller.authenticateToken, vuln_controller.user_edit_get);

router.route('/edit-password')
    .get(auth_controller.authenticateToken, vuln_controller.edit_password_get)
    .post(auth_controller.authenticateToken, vuln_controller.edit_password_post)

router.route('/organization')
    .get(auth_controller.authenticateToken, vuln_controller.organization_get)
    .post(auth_controller.authenticateToken, vuln_controller.organization_post);

router.route('/organization/add-user')
    .get(auth_controller.authenticateToken, vuln_controller.add_user_get)
    .post(auth_controller.authenticateToken, vuln_controller.add_user_post);

router.get('/organization/myorg', auth_controller.authenticateToken, vuln_controller.myorg_get);

router.get('/organization/myorg/users', auth_controller.authenticateToken, vuln_controller.myorg_users_get);

router.get('/api-token', auth_controller.authenticateToken, vuln_controller.apitoken_get);

router.get('/api-token/show', auth_controller.authenticateToken, vuln_controller.apitokenShow_get);

router.get('/cors-api-token', auth_controller.authenticateToken, vuln_controller.cors_api_token_get);

router.route('/cors-csrf-edit-password')
    .get(auth_controller.authenticateToken, vuln_controller.cors_csrf_edit_password_get)
    .post(auth_controller.authenticateToken, vuln_controller.cors_csrf_edit_password_post)
    .options(vuln_controller.cors_csrf_edit_password_option);

router.route('/setup-totp')
    .get(auth_controller.authenticateToken, vuln_controller.totp_setup_get)
    .post(auth_controller.authenticateToken, vuln_controller.totp_setup_post);

router.route('/totp-verification')
    .get(auth_controller.authenticateToken, vuln_controller.login_totp_verification_get)
    .post(auth_controller.authenticateToken, vuln_controller.login_totp_verification_post);

router.post('/disable-totp', auth_controller.authenticateToken, vuln_controller.totp_disable_post);

router.get('/cross-site-websocket-hijacking', auth_controller.authenticateToken, vuln_controller.websocket_hijacking_get);

router.get('/websocket-xss', auth_controller.authenticateToken, vuln_controller.websocket_xss_get);

router.route('/react*')
    .get(auth_controller.authenticateToken, vuln_controller.react_xss_get)
    .post(vuln_controller.react_xss_post);

router.route('/mongodb-notes')
    .get(auth_controller.authenticateToken, vuln_controller.mongodb_notes_get)
    .post(auth_controller.authenticateToken, vuln_controller.mongodb_save_notes_post)

router.route('/mongodb-notes/show-notes')
    .post(auth_controller.authenticateToken, vuln_controller.mongodb_show_notes_post);
module.exports = router;