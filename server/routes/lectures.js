var express = require('express');
var router = express.Router();
var knex = require('../db/config');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

require('dotenv').load();

router.get('/:id/understandings', function(req, res, next) {
  knex('understandings').where({lecture_id: req.params.id})
  .innerJoin('understanding_statuses', 'understandings.status_id', 'understanding_statuses.id')
  .then(function(understandings) {
    console.log(understandings);
    res.json({});
  })

});


module.exports = router;
