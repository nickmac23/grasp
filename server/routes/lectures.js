var express = require('express');
var router = express.Router();
var knex = require('../db/config');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

require('dotenv').load();

// router.use("*", function(req, res, next){
//   req.user ? next() : res.status(400).send({errors:['Please log in or sign up.']})
// })

router.get('/:id/understandings', function(req, res, next) {
  req.user = {}
  req.user.id = 2;
  var usersStatus = {students: {}};
  var isInstructor = false;
  knex('lectures')
    .select('participants.user_id', 'lectures.created_at as lecture_start')
    .where({"lectures.id": req.params.id, 'participants.instructor': true})
    .innerJoin('classes', 'lectures.class_id', 'classes.id')
    .innerJoin('participants', 'classes.id', 'participants.class_id')
    .then(function (instructors) {
      for (var i = 0; i < instructors.length; i++) {
        usersStatus.lecture_start = instructors[0].lecture_start;
        isInstructor = instructors[i].user_id === req.user.id
        if(isInstructor) break;
      }


      return knex('understandings')
              .where({lecture_id: req.params.id})
              .innerJoin('understanding_statuses', 'understandings.status_id', 'understanding_statuses.id')
    }).then(function(understandings) {
      console.log(understandings);
      understandings.forEach(function(understanding){
        if(usersStatus.students[understanding.user_id]){
          usersStatus.students[understanding.user_id].push(understanding)
        }else{
          usersStatus.students[understanding.user_id] = [understanding]
        }
      })
      if(!isInstructor){
        var toReturn = {students:{}};
        toReturn.students[req.user.id] = usersStatus.students[req.user.id]
        toReturn.lecture_start = usersStatus.lecture_start
        // console.log('tore', toReturn.lecture_start);
        console.log(toReturn.students);
        usersStatus = toReturn;
      }
      for (var user in usersStatus.students ) {
        usersStatus.students[user].sort(function (a, b) {
          return +a.created_at - +b.created_at
        })
      }

      res.json(usersStatus);
      usersStatus = {};
    })
});


module.exports = router;
