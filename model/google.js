const mongoose = require('mongoose');
var passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

var mongoDBConfig = require('../config/mongoDB');
mongoose.connect(mongoDBConfig.getURLDatabase(), { useNewUrlParser: true, useCreateIndex: true }, function(err) {
    if (err) {
        console.log('Some problem with the connection ' + err);
    } else {
        console.log('The Mongoose connection is ready');
    }
});

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
        allowNull: true
    },
    cout: {
        type: Number,
        default: 0
    }

}, { autoIndex: false });


module.exports = mongoose.model('googles', userSchema);