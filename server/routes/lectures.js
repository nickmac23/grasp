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
    .select('participants.user_id', 'lectures.started_at as lecture_start', 'lectures.ended_at as lecture_end')
    .where({"lectures.id": req.params.id, 'participants.instructor': true})
    .innerJoin('classes', 'lectures.class_id', 'classes.id')
    .innerJoin('participants', 'classes.id', 'participants.class_id')
    .then(function (instructors) {
      for (var i = 0; i < instructors.length; i++) {
        usersStatus.lecture_start = instructors[0].lecture_start;
        usersStatus.lecture_end = instructors[0].lecture_end;
        isInstructor = instructors[i].user_id === req.user.id
        if(isInstructor) break;
      }

      return knex('understandings')
              .select("understandings.*", 'understanding_statuses.status')
              .where({lecture_id: req.params.id})
              .innerJoin('understanding_statuses', 'understandings.status_id', 'understanding_statuses.id')
    }).then(function(understandings) {

      console.log(JSON.stringify(understandings, null, '  '));

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
        toReturn.lecture_end = usersStatus.lecture_end
        // console.log('tore', toReturn.lecture_start);
        usersStatus = toReturn;
      }
      for (var user in usersStatus.students ) {
        console.log('students****', usersStatus.students[user]);
        usersStatus.students[user].sort(function(a, b){
          return new Date(a.created_at) - new Date(b.created_at)
        })
        // usersStatus.students[user].sort(function (a, b) {
        //   return +a.created_at - +b.created_at
        // })
      }
      res.json(usersStatus);
      usersStatus = {};
    })
});


router.post('/:id/start', function (req, res, next) {
  var toReturn = {};
  console.log("STARTING");
  knex('lectures')
      .where({'id': req.params.id})
      .then(function (lectureCheck) {
        if(lectureCheck[0].started_at) {
          console.log(lectureCheck)
          return Promise.reject(["Lecture has already started :(."])
        } else {
          return knex('lectures')
              .where({'id': req.params.id})
              .update({ 'started_at': new Date(Date.now()), 'is_active': true })
              .returning('*')
        }
      })
      .then(function (lecture) {
        console.log(lecture)
        toReturn.attributes = lecture[0];
        toReturn.links = {}
        res.json(toReturn)
      }).catch(function (err) {
        console.log(err);
        res.status(400).send({ errors:err })
  })
});

router.post('/:id/stop', function (req, res, next) {
  var toReturn = {};
  knex('lectures')
      .where({'id': req.params.id})
      .then(function (lectureCheck) {
        if(lectureCheck[0].ended_at) {
          console.log(lectureCheck)
          return Promise.reject(["Lecture has already started :(."])
        } else {
          return knex('lectures')
              .where({'id': req.params.id})
              .update({ 'ended_at': new Date(Date.now()), 'is_active': false })
              .returning('*')
        }
      })
      .then(function (lecture) {
        console.log(lecture)
        toReturn.attributes = lecture[0];
        toReturn.links = {}
        res.json(toReturn)
      }).catch(function (err) {
    console.log(err);
    res.status(400).send({ errors:err })
  })
});

module.exports = router;
