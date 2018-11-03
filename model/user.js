const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
mongoose.connect('mongodb://localhost/balokids', { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);
const db = mongoose.connection;


//UserSchema

var userSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    password: {
        type: String

    },
    email: {
        type: String

    },
    img: {
        type: String

    }
}, { collection: 'user' });


var user = module.exports = mongoose.model('user', userSchema);

module.exports.getUserById = function(id, callback) {
    user.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback) {
    var query = { username: username };
    user.findOne(query, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        callback(null, isMatch);
    });
}

module.exports.createuser = (newUser, callback) => {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            // Store hash in your password DB.
            newUser.password = hash;
            newUser.save(callback);
        });
    });

};