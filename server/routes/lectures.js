var express = require('express');
var router = express.Router();
var knex = require('../db/config');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

require('dotenv').load();

router.get('/:id/understandings', function(req, res, next) {
  var usersStatus = {};
  knex('understandings').where({lecture_id: req.params.id})
  .innerJoin('understanding_statuses', 'understandings.status_id', 'understanding_statuses.id')
  .then(function(understandings) {
      understandings.forEach(function(understanding){
        if(usersStatus[understanding.user_id]){
          usersStatus[understanding.user_id].push(understanding)
        }else{
          usersStatus[understanding.user_id] = [understanding]
        }
      })
      for (var user in usersStatus ) {
        usersStatus[user].sort(function (a, b) {
          return +a.created_at - +b.created_at
        })
      }
      res.json(usersStatus);
      usersStatus = {};
    })
});


module.exports = router;
