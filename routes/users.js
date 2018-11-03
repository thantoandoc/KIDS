const express = require('express');
const router = express.Router();
const User = require('../model/user');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './anhsanpham')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname)
    }
});


const upload = multer({ storage: storage });

function checkAdmin(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('users/login');
}

router.get('/', checkAdmin, (req, res) => {
    res.render('admin/main/index', { erors: null });
});

router.get('/login', function(req, res, next) {
    res.render('admin/login/login');
});


router.post('/login', passport.authenticate('local', {
    successRedirect: '/users',
    failureRedirect: '/users/login',
    failureFlash: true
}), (req, res, next) => {
    req.flash('You are now logged in');
    req.redirect('users')
});
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy((username, password, done) => {
    User.getUserByUsername(username, (err, user) => {
        if (err) throw err;
        if (!user) {
            return done(null, false, { message: 'Unknown User' });
        }
        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) return done(err);
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Invalid Password' });
            }
        });
    });
}));

router.get('/register', (req, res) => {
    res.render('admin/login/register', { errors: null });
})

router.post('/register', upload.single('img'), (req, res, next) => {

    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;
    const img = req.file.filename
        // if (req.file) {
        //     console.log('Uploading File...');
        //     var img = req.file.filename;
        // } else {
        //     console.log('No File Uploaded...');
        //     var img = 'noimage.jpg';
        // }

    // Form Validator

    req.checkBody('email', 'Email field is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username field is required').notEmpty();
    req.checkBody('password', 'Password field is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    // Check Errors
    var errors = req.validationErrors();

    if (errors) {
        res.render('admin/login/register', {
            errors: errors
        });
    } else {
        const newUser = new User({
            username: username,
            email: email,
            password: password,
            img: img
        });

        User.createuser(newUser, function(err, user) {
            if (err) throw err;
            console.log(user);
        });

        req.flash('success', 'You are now registered and can login');

        res.location('/users/login');
        res.redirect('/users/login');
    }
});
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'you are now logout');
    res.redirect('/users/login');
});

router.get('/getuser', checkAdmin, (req, res) => {
    User.find().then(data => {
        res.render('admin/login/list', { data: data });
    });
});

module.exports = router;