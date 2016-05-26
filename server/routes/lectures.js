var express = require('express');
var router = express.Router();
var knex = require('../db/config');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

require('dotenv').load();

router.use("*", function(req, res, next){
  req.user ? next() : res.status(400).send({errors:['Please log in or sign up.']})
})

router.get('/:id/understandings', function(req, res, next) {
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
      console.log(instructors, "lecture_start from instructors");


      return knex('understandings')
              .where({lecture_id: req.params.id})
              .innerJoin('understanding_statuses', 'understandings.status_id', 'understanding_statuses.id')
    }).then(function(understandings) {
      understandings.forEach(function(understanding){
        console.log(usersStatus.lecture_start);
        if(usersStatus.students[understanding.user_id]){
          usersStatus.students[understanding.user_id].push(understanding)
        }else{
          usersStatus.students[understanding.user_id] = [understanding]
        }
      })

      if(!isInstructor){
        var toReturn = {};
        toReturn[req.user.id] = usersStatus[req.user.id]
        usersStatus = toReturn;
      }

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
