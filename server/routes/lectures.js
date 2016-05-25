var express = require('express');
var router = express.Router();
var knex = require('../db/config');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

require('dotenv').load();

router.get('/:id/understandings', function(req, res, next) {
  console.log('here');
  var check = false;
  array = [];
  knex('understandings').where({lecture_id: req.params.id})
  .innerJoin('understanding_statuses', 'understandings.status_id', 'understanding_statuses.id')
  .then(function(understanding) {
      var str = '' + understanding[0].created_at
      str = str.split(' ')
      console.log(str[4]);
      array.push({time: str[4],
                  roster: [{user_id: understanding[0].user_id,
                            status_id: understanding[0].status_id
                          }]
                })
      for (var i = 1; i < understanding.length; i++) {
        check = false
        str = '' + understanding[i].created_at
        str = str.split(' ')
        for (var j = 0; j < array.length; j++) {
          if (array[j].time == str[4]) {
            array[j].roster.push({user_id: understanding[i].user_id,
                      status_id: understanding[i].status_id
                    })
            check = true
          }
        }
        if (!check) {
          array.push({time: understanding[i].created_at,
                      roster: [{user_id: understanding[i].user_id,
                                status_id: understanding[i].status_id
                              }]
                    })
        }
      }
      res.json(array);
    })
});


module.exports = router;
