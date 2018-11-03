var express = require('express');
var path = require('path');

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var expressValidator = require('express-validator');
var multer = require('multer');
var upload = multer({ dest: './uploads' });
var flash = require('connect-flash');
var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
var mongoDBConfig = require('./config/mongoDB');

var PORT = process.env.PORT || 3000;

/**
 * include router
 */
var index = require('./routes/index');
var admin = require('./routes/admin');
var users = require('./routes/users');
var cate = require('./routes/cates');
const videoRouter = require('./routes/admin/video');

var app = express();

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
app.use(express.static(path.join(__dirname, 'public')));
app.use('/anhsanpham', express.static('anhsanpham'));
//app.use(session({ secret: 'chauminhthien', resave: true, saveUninitialized: true }))


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

app.use(session({
    secret: 'secret',
    resave: true,
    key: 'user',
    saveUninitialized: true

}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});





app.use('/', index);
app.use('/users', users);
app.use('/admin', admin);
app.use('/admin/cate', cate);
app.use('/admin/video', videoRouter);



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
})