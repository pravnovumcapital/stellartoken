var express = require('express');
var router = express.Router();

var accountController = require('../controllers/accountController');
/* GET home page. */
router.get('/', function(req, res, next) {
	//console.log('Now the value for FOO is:', process.env.DA);
	console.log('Now the value for ENV is:', process.env.NODE_ENV);
  res.redirect('/register/hello@novum.capital');
});

router.get('/register', function(req, res, next) {
	//console.log('Now the value for FOO is:', process.env.DA);
  res.redirect('/register/hello@novum.capital');
});

module.exports = router;
