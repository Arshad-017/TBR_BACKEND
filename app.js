var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let dotenv = require('dotenv').config()
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var cors = require('cors')
var app = express();
var portListen = ( process.env.PORT )  || 3000 ;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// app.use('/users', usersRouter);


console.log("Port Running at ......" + portListen);

app.listen(portListen)

module.exports = app;
