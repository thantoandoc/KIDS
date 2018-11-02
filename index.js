var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');

// import router
var indexRouter = require('./routers/index');
var adminRouter = require('./routers/admin');
//import config mongoDB

// connect mongoDB

var PORT = process.env.PORT || 5010;

var app = express();

//set morgan to log
app.use(logger('dev'));
//set body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

//set view engine
app.set('/views', express.static(__dirname + "/views"));
app.set('view engine', 'ejs');
//set assest
app.use('/public', express.static(__dirname + '/public'));

// router
app.use('/', indexRouter);
app.use('/admin', adminRouter);

app.listen(PORT, function () {
    console.log(`App listening on PORT: ${PORT}`);
});
