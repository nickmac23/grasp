var express = require('express');
var router = express.Router();
var knex = require('../db/config');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

require('dotenv').load();

router.use("*", function(req, res, next){
  req.user ? next() : res.status(400).send({errors:['Please log in or sign up.']})
})

router.get('/:id/summary', function(req, res, next){
  var result = {};
  knex('classes')
    .select('lectures.id as lecture_id',
            'lectures.name',
            'lectures.description',
            'lectures.created_at',
            'lectures.is_active')
    .where('classes.id', req.params.id)
    .innerJoin('lectures', 'classes.id', 'lectures.class_id')
    .then(function(lectures){

      result.lectures = lectures.map(function(lecture){
        return {
          attributes: lecture,
          links: {
            understandings: req.v1ApiURL + "/lectures/" + lecture.lecture_id + '/understandings'
          }
        }
      })

      return knex('classes')
        .where('classes.id', req.params.id)
        .select('users.id',
                'users.email',
                'users.name',
                'participants.id as participant_id',
                'participants.instructor')
        .innerJoin('participants', 'classes.id', 'participants.class_id')
        .innerJoin('users', 'participants.user_id', 'users.id')
    }).then(function(participants){
      result.participants = participants.map(function(participant){
        return {
          attributes: participant,
          links: {}
        }
      })
      console.log(participants);
      res.json(result);
    })
})

module.exports = router;
