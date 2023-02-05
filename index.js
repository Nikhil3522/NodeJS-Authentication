const express = require('express');
const path = require('path');
const port = 8000;

const db = require('./config/mongoose');
const Contact = require('./models/user_credentials');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('assets'));

app.use('/', require('./routes'));

app.listen(port, function (err) {
    if (err) {
        console.log('Error in running the server', err);
    }

    console.log('Yup!My Express server is running on port: ', port);
});