//require the library
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://localhost/NodeJS_Authentication", { useNewUrlParser: true });
//connect to the database
// mongoose.connect('mongodb://localhost/NodeJS_Authentication');

//acquire the connection (to check if it is successful)
const db = mongoose.connection;

// error 
db.on('error', console.error.bind(console, 'error connecting to db'));

// up and running then print the message 
db.once('open', function(){
    console.log('Successfuly connected to the datebase');
});