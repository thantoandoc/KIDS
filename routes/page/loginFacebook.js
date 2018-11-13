const express = require('express');
const router = express.Router();
const User = require('../../model/facebook');
const passport = require('passport');

var FacebookStrategy = require('passport-facebook').Strategy;
const keys = require('../../key/fb');
router.get('/', (req, res) => {
    res.render('page/home');
});

passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    done(null, user);
});


passport.use(new FacebookStrategy({
        clientID: keys.facebookClientID,
        clientSecret: keys.facebookClientSecret,
        callbackURL: "/loginfacebook/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, cb) {
        User.findOne({ facebookId: profile.id }, function(err, user) {
            if (err) {
                return cb(err, false, { message: err });
            };
            if (user) {
                return cb(null, user);
            } else {
                // var username = profile.displayName.split(' ');
                var userData = new User();
                userData.facebookId = profile.id;
                userData.token = accessToken;
                userData.name = profile.displayName;
                userData.email = profile.emails[0].value;
                userData.photo = profile.photos[0].value;

                // send email to user just in case required to send the newly created
                // credentails to user for future login without using google login
                userData.save(function(err, newuser) {
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
    scope: ['profile', 'email']
}));
router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/loginfacebook',
    failureRedirect: '/loginfacebook/login'
}));

router.get('/login', (req, res) => {
    res.json('loll');
});

module.exports = router;