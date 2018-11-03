const express = require('express');
const router = express.Router();
const User = require('../../model/user');
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


function bodauTiengViet(str) {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/ /g, "-");
    str = str.replace(/\./g, "-");
    return str;
};

function checkAdmin(req, res, next) {

    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/admin/login');
    }
};

router.get('/', checkAdmin, (req, res) => {
    res.redirect('/users/list');
});

router.get('/list', checkAdmin, (req, res) => {
    User.find().then(data => {
        res.render('admin/user/list', { data: data });
    });
});

router.get('/add', checkAdmin, (req, res) => {
    res.render('admin/user/add', { errors: null });
});

router.post('/add', upload.single('img'), (req, res, next) => {
    const username = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const password2 = req.body.password2;
    const img = req.file.filename;

    req.checkBody('email', 'Email field is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username field is required').notEmpty();
    req.checkBody('password', 'Password field is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    const errors = req.validationErrors();
    if (errors) {
        res.render('admin/user/add', { errors: errors });
    } else {
        const newUser = new User({
            username: username,
            email: email,
            password: password,
            password2: password2,
            img: img
        });
        User.createuser(newUser, (err, user) => {
            if (err) throw err;
            console.log(user);
        });
        req.flash('success_msg', 'Đã Thêm Thành Công');
        res.redirect('/users/add');

    }
});

router.get('/list', checkAdmin, (req, res, next) => {
    User.find().then(data => {
        res.render('admin/user/list', { data: data });
    });
});


router.get('/:id/delete', checkAdmin, (req, res, next) => {
    User.findById(req.params.id).remove(function() {
        req.flash('success_msg', 'Đã Xoá Thành Công');
        res.redirect('/users/list');
    });
});
module.exports = router;