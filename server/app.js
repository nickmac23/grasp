var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var knex = require('./db/config')
var cors = require('cors');
var jwt = require('jsonwebtoken');

var routes = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');
var api = require('./routes/api');
var lectures = require('./routes/lectures');
var classes = require('./routes/classes');
var users = require('./routes/users');
var app = express();

app.use(cors());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set api url
app.use(function(req, res, next){
  req.v1ApiURL = 'https://'+req.get('host')+'/api/v1';
  next();
});

// Set user object on request
app.use(function(req, res, next){

  var token = req.headers.authentication;
  if(token){
    try {
      var decoded = jwt.verify(token, process.env.JWT_SECRET);
    }catch(e){
      console.log(e);
      return res.status(401).send({errors: ["Invalid token"]})
    }
    console.log(decoded);
    knex('users').where({id: decoded.userId}).first().then(function(user){
      delete user.password;
      req.user = user;
      next();
    }).catch(function(err){
      console.log(err);
      next();
    })
  }else{
    next();
  }
});

app.use('/', routes);
app.use('/api', api);
app.use('/api/v1/auth', auth);
app.use('/api/v1/lectures', lectures);
app.use('/api/v1/classes', classes);
app.use('/api/v1/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.json({
    message: err.message,
    error: {}
  });
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});


module.exports = app;
