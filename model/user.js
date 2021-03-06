const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var mongoDBConfig = require('../config/mongoDB');
mongoose.connect(mongoDBConfig.getURLDatabase(), { useNewUrlParser: true, useCreateIndex: true }, function(err) {
    if (err) {
        console.log('Some problem with the connection ' + err);
    } else {
        console.log('The Mongoose connection is ready');
    }
});

//UserSchema

var userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true

    },
    password: {
        type: String,
        required: true

    },
    email: {
        type: String,
        index: true,
        required: true

    },
    img: {
        type: String,
        required: true

    },
    chanel: {
        type: String,
        default: null
    },
    cout: {
        type: Number,
        default: 0
    }

}, { autoIndex: false });


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