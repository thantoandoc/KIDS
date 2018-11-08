const express = require('express');
const router = express.Router();
const User = require('../../model/user');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './anhsanpham')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname);
    }
});
const upload = multer({ storage: storage });

router.get('/', (req, res) => res.render('page/home', { errors: null }));


router.post('/login', (req, res) => {
    User.findOne({ email: req.body.email }, (errors, user) => {
        if (!user) {
            res.render('page/login', { errors: 'Invalid email or password' });
        } else {
            if (req.body.password === user.password) {
                req.session.user = user;
                res.redirect('page/user/');
            } else {
                res.render('page/login', { errors: 'Invalid email or password' });
            }
        }
    });
});


router.post('/register', upload.single('img'), (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const img = req.file.filename;

    req.checkBody('email', 'Email field is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username field is required').notEmpty();
    req.checkBody('password', 'Password field is required').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        res.render('page/register', { errors: errors })
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

        res.location('/page/login');
        res.redirect('/page/login');
    }
});

module.exports = router;