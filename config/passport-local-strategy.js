const passport = require('passport');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
var nodemailer = require('nodemailer');
const user_credentials = require('../models/user_credentials');

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'casimir.hoeger71@ethereal.email',//SMTP email
        pass: 'cv7fptBJsaGbr6Yx9R' //SMTP password
    }
});

// authentication using passport
passport.use(new LocalStrategy({
        usernameField: 'email'
    },
    function(email, password, done){
        // find a user and establish the identity
        user_credentials.findOne({email: email}, async function(err, user)  {
            if (err){
                console.log('Error in finding user --> Passport');
                return done(err);
            }

            console.log("password", password);
            console.log("user", user);

            var passwordMatch = await bcrypt.compare(password, user.password);
            console.log("passwordMatch", passwordMatch);

            if (!user || !passwordMatch){
                console.log('Invalid Username/Password');
                return done(null, false);
            }

            var mailOptions = {
                from: 'casimir.hoeger71@ethereal.email',//SMTP email
                to: user.email,
                subject: 'Successfully Logged In',
                text: 'You logged In'
            };

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log("error in sending email", error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
            });

            return done(null, user);
        });
    }


));

// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user, done){
    done(null, user.id);
});

// deserializing the user from the key in the cookies
passport.deserializeUser(function(id, done){
    user_credentials.findById(id, function(err, user){
        if(err){
            console.log('Error in finding user --> Passport');
            return done(err);
        }

        return done(null, user);
    });
});

// check if the user is authenticated
passport.checkAuthentication = function(req, res, next){
    // if the user is signed in, then pass on the request to the next function(controller's action)
    if (req.isAuthenticated()){
        return next();
    }

    // if the user is not signed in
    return res.redirect('/');
}

passport.setAuthenticatedUser = function(req, res, next){
    if (req.isAuthenticated()){
        // req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
        res.locals.user = req.user;
    }

    next();
}

// check if the user is notauthenticated
// passport.checkNotauthentication = function(req, res, next){
//     // if the user is signed in, then pass on the request to the next function(controller's action)
//     if (req.isAuthenticated()){
//         // return next();
//     }else{
//         return next();

//     }


//     // // if the user is not signed in
//     // return res.redirect('/');
// }



module.exports = passport;