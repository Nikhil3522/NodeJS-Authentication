const express = require('express');

// const app = express();

const user_credentials = require('../models/user_credentials');

const router = express.Router();
console.log("Router loaded");

router.use(express.json());
router.use(express.urlencoded({extended:false}));

router.get('/', function (req, res) {
    return res.render('login');
});

router.get('/signup', function (req, res) {
    return res.render('signup');
});

router.post('/create-user', function(req, res){
    if(req.body.password == req.body.confirmPassword){
        user_credentials.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }, function(err, newUser){
            if(err){
                console.log('error in creating a user!');
                return;
            }
    
            console.log('*******', newUser);
            return res.redirect('/');
        })
    }else{
        console.log("Password and confirm password is not equal",req.body.password, " ",req.body.confirmPassword );
    }
});

router.post('/loginUser', async function(req, res){
    var userEmail;
    try{
        userEmail = await user_credentials.findOne({email: req.body.email})

        if(userEmail.password === req.body.password){
            res.status(201).render('home');
        }else{
            res.send("Password or email are not correct!");
        }
    }catch{
        if(!userEmail){
            res.status(400).send("Invalid Email or password!")
        }else{
            res.status(400).send("Something went wrong!")
        }
    }
})

module.exports = router ;