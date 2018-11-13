const express = require('express');
const path = require('path');
const session = require('client-sessions');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
// const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const expressValidator = require('express-validator');
const multer = require('multer');
const upload = multer({ dest: './uploads' });
const flash = require('connect-flash');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const mongoDBConfig = require('./config/mongoDB');
const User = require('./model/user');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const PORT = process.env.PORT || 3000;

/**
 * include router
 */
const index = require('./routes/index');
const admin = require('./routes/admin/admin');
const users = require('./routes/admin/users');
const cate = require('./routes/admin/cates');
const userPage = require('./routes/page/user');
const home = require('./routes/page/home');
const videoRouter = require('./routes/admin/video');
const google = require('./routes/page/loginGoogle');
const facebook = require('./routes/page/loginFacebook');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
mongoose.connect(mongoDBConfig.getURLDatabase(), { useNewUrlParser: true }, function(err) {
    if (err) {
        console.log('Some problem with the connection ' + err);
    } else {
        console.log('The Mongoose connection is ready');
    }
});
// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(session({ secret: "daiphong", resave: false, saveUninitialized: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/anhsanpham', express.static('anhsanpham'));


app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));
// app.use(session({
//     secret: 'secret',
//     resave: true,
//     key: 'user',
//     saveUninitialized: true
// }));
app.use(session({
    cookieName: 'session',
    secret: 'eg[isfd-8yF9-7w2315df{}+Ijsli;;to8',
    resave: false,
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    httpOnly: true,
    secure: true,
    ephemeral: true,
    saveUninitialized: true
}));
app.use(function(req, res, next) {
    if (req.session && req.session.user) {
        User.findOne({ email: req.session.user.email }, function(err, user) {
            if (user) {
                req.user = user;
                delete req.user.password; // delete the password from the session
                req.session.user = user; //refresh the session value
                res.locals.user = user;
            }
            // finishing processing the middleware and run the route
            next();
        });
    } else {
        next();
    }
});

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});




app.use('/home', home);
app.use('/', index);
app.use('/users', users);
app.use('/admin', admin);
app.use('/admin/cate', cate);
app.use('/admin/video', videoRouter);
app.use('/userpage', userPage);
app.use('/logingoogle', google);
app.use('/loginfacebook', facebook);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(PORT, function() {
    console.log(`App listening on PORT: ${PORT}`);
});

module.exports = app;