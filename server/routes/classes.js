var express = require('express');
var router = express.Router();
var knex = require('../db/config');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

require('dotenv').load();

router.use("*", function(req, res, next){
  req.user ? next() : res.status(400).send({errors:['Please log in or sign up.']})
})

router.get('/', function(req, res, next) {
  knex('classes').where({user_id: req.user.id})
});


module.exports = router;
