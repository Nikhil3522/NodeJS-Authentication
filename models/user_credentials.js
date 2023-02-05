
const mongoose = require('mongoose');
 
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});


const UserSchema = mongoose.model('UserSchema', userSchema);

module.exports = UserSchema;