const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    userName: String,
    email: String,
    password: String,
    friends: [],
    requests: [],
    receive: [],
    chatDB: []
})

const User = mongoose.model('User', UserSchema);

module.exports = User;