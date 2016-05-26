var express = require('express');
var router = express.Router();
var knex = require('../db/config');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

require('dotenv').load();

function isInstructor(req, res, next){
  knex('participants').where({ 'user_id': req.user.id, 'class_id': req.params.id }).first().then(function(participant){
    if(participant.instructor) return next();
    res.status(400).send({errors: ["Please login as an instructor."]})
  }).catch(function(err){
    console.log(err);
    res.status(400).send({errors: ["Please login as an instructor."]})
  })
}

router.use("*", function(req, res, next){
  req.user ? next() : res.status(400).send({errors:['Please log in or sign up.']})
});

router.get('/:id/summary', function(req, res, next){
  var result = {attributes:{}};
  knex('classes')
    .select('lectures.id as lecture_id',
            'lectures.name',
            'lectures.description',
            'lectures.created_at',
            'lectures.is_active')
    .where('classes.id', req.params.id)
    .innerJoin('lectures', 'classes.id', 'lectures.class_id')
    .then(function(lectures){

      result.attributes.lectures = lectures.map(function(lecture){
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
      result.attributes.participants = participants.map(function(participant){
        return {
          attributes: participant,
          links: {}
        }
      })
      console.log(participants);

      result.links = {
        lectures: {
          post: req.v1ApiURL + "/classes/"+req.params.id+"/lectures"
        }
      }
      res.json(result);
    })
})

router.post('/', function (req, res, next) {
  var user = req.user;
    return knex('classes').insert(req.body)
        .returning('*')
        .then(function (newClass) {
          res.json(newClass);
        })
});

router.post('/:id/participants', isInstructor, function (req, res, next) {
  var participant = req.body
  var errors = [];
  var personToAdd;

  if(!participant.email) errors.push('Please enter an email');
  if(errors.length > 0) return res.status(400).send({errors: errors});

  knex('users').where('email', req.body.email.toLowerCase()).first().then(function(user){
    if(!user) return Promise.reject("This user is has not signed up.");
    personToAdd = user;
    return knex('participants').where({'user_id': user.id, 'class_id': req.params.id}).count("id").first();
  }).then(function(result){
    count = +result.count
    if(count > 0){
      return Promise.reject("This user is already participating in the class.")
    }else{
      return knex('participants')
              .insert({ user_id: personToAdd.id, class_id: req.params.id, instructor: !!req.body.instructor })
              .returning('*');
    }
  }).then(function (newParticipant) {
    newParticipant = newParticipant[0];
    result = {
      attributes: newParticipant,
      links: {
        delete: req.v1ApiURL + '/'+req.params.id+'/participants/'+newParticipant.id
      }
    }
    res.json(result)
  }).catch(function(err){
    console.log(err);
    res.status(400).send({errors:[err]})
  })
});

router.post('/:id/lectures', isInstructor, function (req, res, next) {
  var user = req.user;
  var lecture = req.body;
  var errors = [];

  if(!lecture.name) errors.push('please enter a lecture name');
  if(!lecture.description) errors.push('please enter a description');
  if(errors.length > 0) return res.status(400).send({errors: errors});

  lecture.class_id = req.params.id;

  knex('participants').where('user_id', req.user.id).first().then(function(participant){
    lecture.instructor_id = participant.id;
    return knex('lectures').insert(lecture).returning('*');
  }).then(function (newLecture) {
    res.json(newLecture);
  })

});

module.exports = router;
