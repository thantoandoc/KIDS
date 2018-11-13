const express = require('express');
const router = express.Router();
const User = require('../../model/google');
const passport = require('passport');

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../../key/key');
router.get('/', (req, res) => {
    res.render('page/home');
})

passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    done(null, user);
});


passport.use(new GoogleStrategy({
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: "/logingoogle/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, cb) {
        User.findOne({ googleId: profile.id }, function(err, user) {
            if (err) {
                return cb(err, false, { message: err });
            } else {
                if (user != '' && user != null) {
                    return cb(null, user, { message: "User " });
                } else {
                    var username = profile.displayName.split(' ');
                    var userData = new User({
                        name: profile.displayName,
                        username: username[0],
                        password: username[0],
                        img: username[0],
                        // facebookId: '',
                        googleId: profile.id,
                    });
                    // send email to user just in case required to send the newly created
                    // credentails to user for future login without using google login
                    userData.save(function(err, newuser) {
                        if (err) {
                            return cb(null, false, { message: err + " !!! Please try again" });
                        } else {
                            return cb(null, newuser);
                        }
                    });
                }
            }
            console.log('access token', accessToken);
            console.log('refreshToken', refreshToken);
            console.log('profile', profile);
        });
    }
));

router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));
router.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/logingoogle',
    failureRedirect: '/logingoogle/login'
}));



module.exports = router;