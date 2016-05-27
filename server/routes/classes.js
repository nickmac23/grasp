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


// Add Class
router.post('/', function (req, res, next) {
  var user = req.user;
  var errors = [];
  var toReturn = { attributes: {},
                   links: {} };

  if(!req.body.name) errors.push('Please enter an class name');
  if(!req.body.description) errors.push('Please enter an class description');
  if(errors.length > 0) return res.status(400).send({errors: errors});

  knex('users').where({ 'users.id': user.id })
    .innerJoin('participants', 'users.id', 'participants.user_id')
    .innerJoin('classes', 'participants.class_id', 'classes.id')
    .then(function (classes) {

      var currentClass = classes.find(function(currentClass){
        return currentClass.name.toLowerCase() === req.body.name.toLowerCase();
      });

      if(currentClass){
        errors.push("Class name already exists.")
        return Promise.reject(errors);
      }
      return knex('classes').insert(req.body)
      .returning('*')
    }).then(function (newClass) {
      newClass = newClass[0];

      newClass.class_name = newClass.name;
      delete newClass.name;
      newClass.class_description = newClass.description;
      delete newClass.description;
      delete newClass.created_at;
      newClass.instructor = true;

      toReturn.attributes = newClass;
      toReturn.links = {
        summary: req.v1ApiURL+"/classes/"+newClass.id+"/summary"
      };
      //toReturn.attributes.lectures = [];
      return knex('participants').insert({ user_id: user.id, class_id: newClass.id, instructor: true });
    }).then(function(){
      res.json(toReturn);

      // participant = participant[0];
      // newParticipant = { attributes: {},
      //                    links: {} };
      //
      // newParticipant.attributes = mapUserParticipant(user, participant);
      // newParticipant.links = {
      //   delete: req.v1ApiURL + '/classes/' + req.params.id + '/participants/' + participant.id
      // }
      //
      // toReturn.attributes.participants = [newParticipant];
      // toReturn.links = {
      //   lectures: {
      //     post: req.v1ApiURL + "/classes/"+req.params.id+"/lectures"
      //   },
      //   participants: {
      //     post: req.v1ApiURL + '/classes/' + req.params.id + '/participants'
      //   }
      // }

      // res.json(toReturn);
    }).catch(function(err){
      console.log(err);
      res.status(400).send({errors: errors});
    })
});



router.get('/:id/summary', function(req, res, next){
  var result = {attributes:{},
                links:{} };
  knex('classes')
    .select('lectures.id as lecture_id',
            'lectures.name',
            'lectures.description',
            'lectures.created_at',
            'lectures.ended_at',
            'lectures.is_active')
    .where('classes.id', req.params.id)
    .innerJoin('lectures', 'classes.id', 'lectures.class_id')
    .then(function(lectures){

      result.attributes.lectures = lectures.map(function(lecture){
        return {
          attributes: lecture,
          links: {
            understandings: req.v1ApiURL + "/lectures/" + lecture.lecture_id + '/understandings',
            start: req.v1ApiURL + "/lectures/" + lecture.lecture_id + '/start',
            stop: req.v1ApiURL + "/lectures/" + lecture.lecture_id + '/stop'
          }
        }
      })

      return knex('classes')
        .where('classes.id', req.params.id)
        .select('users.id as user_id',
                'users.email',
                'users.name',
                'participants.id',
                'participants.instructor')
        .innerJoin('participants', 'classes.id', 'participants.class_id')
        .innerJoin('users', 'participants.user_id', 'users.id')
    }).then(function(participants){
      result.attributes.participants = participants.map(function(participant){
        return {
          attributes: participant,
          links: {
            delete: req.v1ApiURL + '/classes/' + req.params.id + '/participants/' + participant.id
          }
        }
      })
      console.log(participants);

      result.links = {
        lectures: {
          post: req.v1ApiURL + "/classes/"+req.params.id+"/lectures"
        },
        participants: {
          post: req.v1ApiURL + '/classes/' + req.params.id + '/participants'
        }
      }
      res.json(result);
    })
})


router.post('/:id/participants', isInstructor, function (req, res, next) {
  console.log('in server', req.body);
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
      attributes: {email: req.body.email,
                  name: req.body.name,
                  user_id: newParticipant.user_id
                },
      links: {
        delete: req.v1ApiURL + '/classes/'+req.params.id+'/participants/'+newParticipant.id
      }
    }
    res.json(result)
  }).catch(function(err){
    console.log(err);
    res.status(400).send({errors:[err]})
  })
});

router.delete('/:id/participants/:participantId', isInstructor, function(req,res,next){
  knex('participants').where({'class_id': req.params.id, 'instructor': true}).count('id').then(function(instructorCount){
    if(+instructorCount[0].count === 1){
      return Promise.reject(["You cannot remove the last instructor :("])
    }
    console.log(instructorCount, 'instr count');
    return knex('participants')
            .where({ 'id': req.params.participantId, 'class_id': req.params.id })
            .del()
            .returning('*')
  }).then(function (participant) {
    console.log('IN DELETE',participant);
    toReturn = {
      attributes: participant,
    }
    res.json(participant);
  }).catch(function(err){
    console.log(err);
    res.status(400).send({ errors:err })
  })
})

router.post('/:id/lectures', isInstructor, function (req, res, next) {
  var user = req.user;
  var lecture = req.body;
  toReturn = { attributes: {},
               links: {} };
  var errors = [];

  if(!lecture.name) errors.push('please enter a lecture name');
  if(!lecture.description) errors.push('please enter a description');
  if(errors.length > 0) return res.status(400).send({errors: errors});

  lecture.class_id = req.params.id;
  knex('classes')
    .where({'classes.id': req.params.id})
    .innerJoin('lectures', 'classes.id', 'lectures.class_id')
    .then(function (classLectures) {
      var lecture = classLectures.find(function (lecture) {
        return lecture.name.toLowerCase() === req.body.name.toLowerCase()
      })
      if (lecture) return Promise.reject(["Lecture name already exists in this class."])
      return knex('participants').where('user_id', req.user.id).first();
    }).then(function(participant){
    lecture.instructor_id = participant.id;
    return knex('lectures').insert(lecture).returning('*');
  }).then(function (newLecture) {
    newLecture = newLecture[0];
    newLecture.lecture_id = newLecture.id;
    console.log(newLecture);
    delete newLecture.id;
    delete newLecture.class_id;
    delete newLecture.instructor_id;
    toReturn.links = {
      understandings: req.v1ApiURL + '/lectures/' + newLecture.lecture_id + '/understandings',
      start: req.v1ApiURL + '/lectures/' + newLecture.lecture_id + '/start',
      stop: req.v1ApiURL + '/lectures/' + newLecture.lecture_id + '/stop'
    }
    toReturn.attributes = newLecture
    res.json(toReturn);
  }).catch(function (err) {
    res.status(400).send({errors: err})
  })

});

module.exports = router;


function mapUserParticipant(user, participant){
  var newParticipant = {};
  newParticipant = participant;
  newParticipant.user_id = user.id;
  newParticipant.name = user.name;
  newParticipant.email = user.email;
  newParticipant.id = user.id;

  return newParticipant
}
