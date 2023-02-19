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

module.exports = router ;