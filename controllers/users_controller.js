const user_credentials = require('../models/user_credentials');
const passport = require('../config/passport-local-strategy');
const bcrypt = require('bcryptjs');
var nodemailer = require('nodemailer');


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

module.exports.forgetPassword = function(req, res){
  return res.render('forgetPassword', {
    stage: 1,
    message: ""
  });
}

var val = 0;

module.exports.sendOTP = function(req, res){
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'casimir.hoeger71@ethereal.email',//SMTP email
            pass: 'cv7fptBJsaGbr6Yx9R' //SMTP password
        }
    });
    val = Math.floor(1000 + Math.random() * 9000);

    var mailOptions = {
        from: 'casimir.hoeger71@ethereal.email',//SMTP email
        to: req.body.email,
        subject: 'OTP for change password',
        text: `Your OTP is ${val}`
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log("error in sending email", error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });

    return res.render('forgetPassword', {
        stage: 2,
        email: req.body.email,
        message: ""
      });
}

module.exports.submitPasswordFromForget = async function(req, res){
    if(val == req.body.OTP){
        if(req.body.newPassword == req.body.confirmPassword){
            let encryptPassword = await bcrypt.hash(req.body.newPassword, 10);
            user_credentials.findOne({email: req.body.email}, async function(err, user){
                if(err){
                    console.log("Error in finding the user");
                }
                console.log("User name", user);
                const update =  { $set: {name: user.name, email: user.email, password: encryptPassword}};
                await user_credentials.updateOne({email: req.body.email}, update, {});
            });
           
            return res.redirect('/');
        }else{
            return res.render('forgetPassword', {
                stage: 2,
                email: req.body.email,
                message: "Password and Confirm Password is not same!"
            });
        }
    }else{
        return res.render('forgetPassword', {
            stage: 2,
            email: req.body.email,
            message: "Please Enter correct OTP!"
        });
    }

}