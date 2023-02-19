const user_credentials = require('../models/user_credentials');
const bcrypt = require('bcryptjs');


module.exports.login = function (req, res) {
    console.log("user information", req.user);
    if(req.isAuthenticated()){
        return res.render('home',{
            user: req.user
        });
    }

    return res.render('login', {
        message: ""
    });
}

module.exports.signup = function (req, res) {
    if(req.isAuthenticated()){
        return res.render('home',{
            user: req.user
        });
    }

    return res.render('signup');
}

module.exports.createUser = async function(req, res){
    if(req.body.password == req.body.confirmPassword){
        let encryptPassword = await bcrypt.hash(req.body.password, 10);
        user_credentials.create({
            name: req.body.name,
            email: req.body.email,
            password: encryptPassword,
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
}

module.exports.wrongPass = async function(req, res){
    return  res.render('login', {
        message: "Wrong Password"
    });
}

module.exports.home = function (req, res){
    res.status(201).render('home');
}

module.exports.loginUser = async function(req, res){
    return res.redirect('/');
}

module.exports.changePassword = async function(req, res){
    return  res.render('changePassword');
}

module.exports.submitChangePassword = async function(req, res){
    var passwordMatch = await bcrypt.compare(req.body.currentPassword, req.user.password);
    if((req.body.newPassword == req.body.confirmNewPassword) && (passwordMatch)){
        let encryptPassword = await bcrypt.hash(req.body.newPassword, 10);
        const update =  { $set: {name: req.user.name, email: req.user.email, password: encryptPassword}};
        await user_credentials.updateOne({email: req.user.email}, update, {});
        return res.redirect('/');

    }else{
        return res.redirect('/change-password');
    }
}