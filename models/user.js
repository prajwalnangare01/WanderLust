const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose').default;


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true 
    },
    email: {type: String, required: true},
    password: String
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('user', userSchema);