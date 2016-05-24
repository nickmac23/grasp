var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ v1: req.v1ApiURL });
});


router.get('/v1', function(req, res, next) {
  var response = {
    auth: req.v1ApiURL + '/auth'
  }

  res.json(response);
})

module.exports = router;
