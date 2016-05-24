var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ signup: req.v1ApiURL + '/auth/signup',
             login: req.v1ApiURL + '/auth/login'
           });
});

router.get('/signup', function(req, res, next) {
  res.json({token: ""});
})


router.get('/login', function(req, res, next) {
  res.json({token:""});
})

module.exports = router;
