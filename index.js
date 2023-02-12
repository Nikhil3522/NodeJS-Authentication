const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const port = 8000;
const Noty = require("noty");
// used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const db = require('./config/mongoose');

const app = express();

app.use(express.urlencoded());

app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('assets'));

app.use(session({
    name: 'codeial',
    // TODO change the secret before deployment in production mode
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', require('./routes'));

app.listen(port, function (err) {
    if (err) {
        console.log('Error in running the server', err);
    }

    console.log('Yup!My Express server is running on port: ', port);
});