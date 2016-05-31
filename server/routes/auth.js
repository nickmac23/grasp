var express = require('express');
var router = express.Router();
var knex = require('../db/config');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

require('dotenv').load();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ signup: req.v1ApiURL + '/auth/signup',
             login: req.v1ApiURL + '/auth/login',
             me: req.v1ApiURL + '/auth/me'
           });
});

router.post('/signup', function(req, res, next) {
  var newUser = req.body;
  var errors = [];
  console.log(newUser);
  if(!newUser.name) errors.push('please enter your name');
  if(!newUser.password) errors.push('please enter a password');
  if(!newUser.email) errors.push('please enter a email');
  if(errors.length > 0) return res.status(400).send({errors: errors});

  var password = bcrypt.hashSync(newUser.password, 10);
  knex('users').insert({name: newUser.name, password: password, email:newUser.email.toLowerCase()})
               .returning('*')
               .then(function(users){
    var userId = {userId: users[0].id}
    var token = jwt.sign(userId, process.env.JWT_SECRET);
    console.log(token);
    res.json({token: token});
  }).catch(function(err){
    console.log(err);
    res.status(400).send({errors: ['please select a different email']});
  })

});


router.post('/login', function(req, res, next) {
  console.log('test');
  var user = req.body;
  var errors = [];

  console.log(user);
  if(!user.email) errors.push('please enter your email');
  if(!user.password) errors.push('please enter a password');
  if(errors.length > 0) return res.status(400).send({errors: errors});

  knex('users').where('email', user.email.toLowerCase())
    .first()
    .then(function(dbUser){
      console.log(dbUser);
      if(bcrypt.compareSync(user.password, dbUser.password)){
        var token = jwt.sign({userId: dbUser.id}, process.env.JWT_SECRET);
        console.log(token);
        res.json({token: token});
      }else{
        return Promise.reject('invalid password');
      }
  }).catch(function(err){
    console.log(err);
    res.status(400).send({errors: ['You have entered an invalid email or password']});
  })
});


router.get('/me', function(req, res, next){
  console.log('in server USER', req.user);
  if (req.user) {
    res.json(req.user);
  }else{
    res.status(200).send({});
  }
})

module.exports = router;
