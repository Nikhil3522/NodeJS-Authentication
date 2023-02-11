const express = require('express');
const router = express.Router();
const userController = require('../controllers/users_controller');  

router.use(express.json());
router.use(express.urlencoded({extended:false}));

router.get('/', userController.login);
router.get('/signup', userController.signup);
router.post('/create-user', userController.createUser);
router.post('/loginUser', userController.loginUser);

module.exports = router ;