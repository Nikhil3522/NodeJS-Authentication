const user_credentials = require('../models/user_credentials');
const bcrypt = require('bcryptjs');


module.exports.login = function (req, res) {
    if(req.isAuthenticated()){
        return res.redirect('/home');
    }

    return res.render('login', {
        message: ""
    });
}

module.exports.signup = function (req, res) {
    if(req.isAuthenticated()){
        return res.redirect('/home');
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
    return res.redirect('/home');
    // var userEmail;
    // try{
    //     userEmail = await user_credentials.findOne({email: req.body.email})

    //     // var passwordMatch = await passwordCompare(req.body.password, userEmail.password);
    //     var passwordMatch = await bcrypt.compare(req.body.password, userEmail.password);


    //     if(passwordMatch){
    //         var mailOptions = {
    //             from: 'casimir.hoeger71@ethereal.email',//SMTP email
    //             to: `${req.body.email}`,
    //             subject: 'Successfully Logged In',
    //             text: 'You logged In'
    //         };

    //         transporter.sendMail(mailOptions, function(error, info){
    //             if (error) {
    //               console.log("error in sending email", error);
    //             } else {
    //               console.log('Email sent: ' + info.response);
    //             }
    //         });

    //         res.cookie("user_id", userEmail.id);

    //         res.status(201).render('home');

     
    //     }else{
    //         return  res.render('login', {
    //             message: "Wrong Password"
    //         });
    //     }
    // }catch{
    //     if(!userEmail){
    //         res.status(400).send("Invalid Email or password!")
    //     }else{
    //         res.status(400).send("Something went wrong!")
    //     }
    // }
}