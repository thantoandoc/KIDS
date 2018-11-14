const mongoose = require('mongoose');
var passport = require('passport');
var bcrypt = require('bcryptjs');
var chuyenobjectid = require('mongodb').ObjectID;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
var mongoDBConfig = require('../config/mongoDB');
mongoose.connect(mongoDBConfig.getURLDatabase(), { useNewUrlParser: true }, function(err) {
    if (err) {
        console.log('Some problem with the connection ' + err);
    } else {
        console.log('The Mongoose connection is ready');
    }
});
//googleId dau? day la id .. cha
var userSchema = mongoose.Schema({

    googleId: String,
    token: String,
    email: String,
    name: String,
    photo: String,
    chanel: {
        type: String,
        default: null
    },
    cout: {
        type: Number,
        default: 0
    }

}, { autoIndex: false });

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
}
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
}

module.exports = mongoose.model('googles', userSchema);