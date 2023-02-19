const express = require('express');
const router = express.Router();
const userController = require('../controllers/users_controller');  
const passport = require('passport');

router.use(express.json());
router.use(express.urlencoded({extended:false}));

router.get('/', userController.login);
router.get('/home', passport.checkAuthentication , userController.home);
router.get('/signup', userController.signup);
router.post('/create-user', userController.createUser);
router.get('/wrongPass', userController.wrongPass)
router.post('/loginUser', passport.authenticate(
    'local',
    {failureRedirect: '/wrongPass'},
), userController.loginUser);
router.get('/change-password', passport.checkAuthentication, userController.changePassword);
router.post('/change-password', userController.submitChangePassword);
router.get('/forgetPassword', userController.forgetPassword);
router.post('/sendOTP', userController.sendOTP);
router.post('/submitPasswordFromForget', userController.submitPasswordFromForget);
router.get('/logout', userController.logout);

router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/sign-in'}), userController.loginUser);

module.exports = router ;