var express = require('express');
var router = express.Router();
var knex = require('../db/config');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

require('dotenv').load();

router.use("*", function(req, res, next){
  req.user ? next() : res.status(400).send({errors:['Please log in or sign up.']})
})

router.get('/participations', function(req, res, next) {
    var userId = req.user.id;
    knex('users')
        .select('classes.id',
            'classes.name as class_name',
            'classes.description as class_description',
            'participants.instructor')
        .where('users.id', userId)
        .innerJoin('participants', 'participants.user_id', 'users.id')
        .innerJoin('classes', 'participants.class_id', 'classes.id')
        .then(function(classes) {
            if (classes.length === 0) {
                return res.status(400).json({
                    error: "You are not signed up for any classes."
                })
            } else {

                classes = classes.map(function(classObj) {
                    var obj = {};
                    obj.attributes = classObj;
                    obj.links = {
                        summary: req.v1ApiURL + "/classes/" + classObj.id + "/summary"
                    }
                    return obj
                })
                res.json(classes);
            }
        })
});

// router.get('/:userId/classes', function(req, res, next) {
//   var newClasses;
//   var userId = req.params.userId;
//   console.log(userId);
//   knex('users')
//     .select('classes.id',
//             'participants.instructor',
//             'classes.name as class_name',
//             'classes.description as class_description',
//             'lectures.name as lecture_name',
//             'lectures.description as lecture_description',
//             'lectures.id as lecture_id',
//             'lectures.instructor_id')
//     .where('users.id', userId)
//     .innerJoin('participants', 'users.id', 'participants.user_id' )
//     .innerJoin('classes', 'participants.class_id', 'classes.id')
//     .innerJoin('lectures', 'classes.id', 'lectures.class_id')
//     .then(function(classes){
//
//       console.log();
//
//       newClasses = classes.reduce(function(prev, classObj) {
//         prevClass = prev[classObj.id];
//
//         if (prevClass) {
//           prevClass.lectures.push({ id: classObj.lecture_id,
//                                     name: classObj.lecture_name,
//                                     description: classObj.lecture_description,
//                                     instructor_id: classObj.instructor_id});
//         } else {
//           prev[classObj.id] = classObj;
//           classObj.lectures = [{  id: classObj.lecture_id,
//                                   name: classObj.lecture_name,
//                                   description: classObj.lecture_description,
//                                   instructor_id: classObj.instructor_id}]
//         }
//         delete classObj.lecture_id;
//         delete classObj.lecture_name;
//         delete classObj.lecture_description;
//         delete classObj.instructor_id;
//
//         return prev;
//       }, {})
//
//       return knex('participants')
//               .whereIn('class_id', Object.keys(newClasses))
//               .innerJoin('users', 'participants.user_id', 'users.id')
//               .select('users.*',
//                       'participants.instructor',
//                       'participants.id as participant_id',
//                       'participants.class_id')
//     }).then(function(participants){
//       console.log(participants);
//
//       participants.forEach(function(participant){
//         var classObj = newClasses[participant.class_id]
//         if(participant.instructor) {
//           classObj.lectures.forEach(function(lecture){
//             if(lecture.instructor_id === participant.participant_id){
//               lecture.instructor = participant;
//               delete lecture.instructor_id;
//             }
//           })
//         }
//         delete participant.password;
//         if(classObj.participants){
//
//           classObj.participants.push(participant);
//         } else {
//
//           classObj.participants = [participant];
//         }
//       })
//
//       var classes = []
//       for (var classId in newClasses) {
//         if (newClasses.hasOwnProperty(classId)) {
//           classes.push(newClasses[classId]);
//         }
//       }
//
//       res.json(classes);
//     })
//
// });


module.exports = router;
