const express = require('express');
const router = express.Router();
const User = require('../../model/facebook');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var chuyenobjectid = require('mongodb').ObjectID;
var FacebookStrategy = require('passport-facebook').Strategy;
const keys = require('../../key/fb');
router.get('/', (req, res) => {
    res.render('page/home');
});

passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(id, done) {
    User.findById(id, (user, err) => {
        done(err, user);
    });
});


passport.use(new FacebookStrategy({
        clientID: keys.facebookClientID,
        clientSecret: keys.facebookClientSecret,
        callbackURL: "/loginfacebook/auth/facebook/callback",
        profileFields: ['email', 'gender', 'locale', 'displayName']
    },
    function(accessToken, refreshToken, profile, cb) {
        User.findOne({ id: profile.id }, function(err, user) {
            if (err) {
                return cb(err, false, { message: err });
            };
            if (user) {
                return cb(null, user);
            } else {
                var newUser = new User();
                newUser.id = profile.id;
                newUser.token = accessToken;
                newUser.name = profile.name;
                newUser.email = profile.email;
                newUser.save(function(err, newuser) {
                    if (err) {
                        return cb(null, false, { message: err + " !!! Please try again" });
                    } else {
                        return cb(null, newuser);
                    }
                });
                console.log(profile);
            }

        });
    }
));

router.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email']
}));
router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/loginfacebook',
    failureRedirect: '/loginfacebook/login'
}));

router.get('/login', (req, res) => {
    res.json('loll');
});

module.exports = router;