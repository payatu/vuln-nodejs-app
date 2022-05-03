const express = require('express');
const vuln_controller = require("../controllers/vuln_controller");
const router = express.Router();
const auth_controller = require('../controllers/auth_controller');
const { authenticateToken } = require('../controllers/auth_controller');
const { schema }  = require('../models/graphql-schema')
const { graphqlHTTP } = require('express-graphql')

router.get('/', authenticateToken, vuln_controller.app_index);

router.route('/register')
    .get(auth_controller.register_get)
    .post(auth_controller.register_post);

router.get('/xss', authenticateToken, vuln_controller.xss_lab);

router.get('/ssti', authenticateToken, vuln_controller.ssti);

router.route('/ping')
    .get(authenticateToken, vuln_controller.ping_get)
    .post(authenticateToken, vuln_controller.ping_post);

router.get('/sqli', authenticateToken, vuln_controller.sqli_get);

router.get('/xxe', authenticateToken, vuln_controller.xxe_get);

router.post('/comment', authenticateToken, vuln_controller.xxe_comment);

router.get('/auth', vuln_controller.auth_get);

router.get('/dashboard', vuln_controller.dashboard_get);

router.get('/userinfo', authenticateToken, vuln_controller.userinfo_get);

router.get('/sitetoken/:username', authenticateToken, vuln_controller.sitetoken_get);

router.get('/sqli/:from-:to', authenticateToken, vuln_controller.sqli_check_train_get);

router.get('/sqli-fixed/:from-:to', authenticateToken, vuln_controller.fixed_sqli_check_train_get);

router.get('/sqli-fixed/', authenticateToken, vuln_controller.sqli_fixed_get)

router.get('/logout', authenticateToken, auth_controller.logout_get);

router.get('/deserialization', authenticateToken, vuln_controller.deserialization_get);

router.post('/save-preference', authenticateToken, vuln_controller.save_preference_post);

router.get('/jwt1', authenticateToken, vuln_controller.jwt1_get);

router.get('/jwt1/apiKey', authenticateToken, vuln_controller.jwt1ApiKey);

router.route('/notes')
    .get(authenticateToken, vuln_controller.notes_get)
    .post(authenticateToken, vuln_controller.notes_post);

router.get('/notes/user/:userid', authenticateToken, vuln_controller.userNotes_get);

router.route('/login')
    .get(auth_controller.login_get)
    .post(auth_controller.login_post);

router.get('/ticket', authenticateToken, vuln_controller.ticket_get);

router.get('/ticket/booking', authenticateToken, vuln_controller.ticket_booking_get);

router.get('/ticket/generate_ticket', vuln_controller.generate_ticket_get);

router.get('/user-edit', authenticateToken, vuln_controller.user_edit_get);

router.route('/edit-password')
    .get(authenticateToken, vuln_controller.edit_password_get)
    .post(authenticateToken, vuln_controller.edit_password_post)

router.route('/organization')
    .get(authenticateToken, vuln_controller.organization_get)
    .post(authenticateToken, vuln_controller.organization_post);

router.route('/organization/add-user')
    .get(authenticateToken, vuln_controller.add_user_get)
    .post(authenticateToken, vuln_controller.add_user_post);

router.get('/organization/myorg', authenticateToken, vuln_controller.myorg_get);

router.get('/organization/myorg/users', authenticateToken, vuln_controller.myorg_users_get);

router.get('/api-token', authenticateToken, vuln_controller.apitoken_get);

router.get('/api-token/show', authenticateToken, vuln_controller.apitokenShow_get);

router.get('/cors-api-token', authenticateToken, vuln_controller.cors_api_token_get);

router.route('/cors-csrf-edit-password')
    .get(authenticateToken, vuln_controller.cors_csrf_edit_password_get)
    .post(authenticateToken, vuln_controller.cors_csrf_edit_password_post)
    .options(vuln_controller.cors_csrf_edit_password_option);

router.route('/setup-totp')
    .get(authenticateToken, vuln_controller.totp_setup_get)
    .post(authenticateToken, vuln_controller.totp_setup_post);

router.route('/totp-verification')
    .get(authenticateToken, vuln_controller.login_totp_verification_get)
    .post(authenticateToken, vuln_controller.login_totp_verification_post);

router.post('/disable-totp', authenticateToken, vuln_controller.totp_disable_post);

router.get('/cross-site-websocket-hijacking', authenticateToken, vuln_controller.websocket_hijacking_get);

router.get('/websocket-xss', authenticateToken, vuln_controller.websocket_xss_get);

router.route('/react*')
    .get(authenticateToken, vuln_controller.react_xss_get)
    .post(vuln_controller.react_xss_post);

router.route('/mongodb-notes')
    .get(authenticateToken, vuln_controller.mongodb_notes_get)
    .post(authenticateToken, vuln_controller.mongodb_save_notes_post)

router.route('/mongodb-notes/show-notes')
    .post(authenticateToken, vuln_controller.mongodb_show_notes_post);

// GraphQL rotuer
router.use('/graphql', authenticateToken, graphqlHTTP({
    schema: schema,
    rootValue: vuln_controller.graphqlroot
}))

router.get('/graphql-user-profile', authenticateToken, vuln_controller.graphql_user_profile_get);

router.get('/graphql-information-disclosure', authenticateToken, vuln_controller.graphql_information_disclosure_get);

router.get('/graphql-update-profile', authenticateToken, vuln_controller.graphql_update_profile_get);

router.get('/graphql-idor-show-profile', authenticateToken, vuln_controller.graphql_idor_get);

router.route('/svg-xss')
    .get(authenticateToken, vuln_controller.svg_xss_get)
    .post(authenticateToken, vuln_controller.svg_xss_fileupload_post);

router.get('/jsonp-injection', authenticateToken, vuln_controller.jsonp_injection_get);

router.get('/jsonp-injection/wallet-usd-balance', authenticateToken, vuln_controller.jsonp_wallet_get);

router.get('/nosql-js-injection', authenticateToken, vuln_controller.nosql_javascript_injection_get);

router.post('/unlock-secret', authenticateToken, vuln_controller.secret_post);

module.exports = router;