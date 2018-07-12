var express = require('express');
var router = express.Router();

var accountController = require('../controllers/accountController');
/* GET home page. */
router.get('/', function(req, res, next) {
	//console.log('Now the value for FOO is:', process.env.DA);
	console.log('Now the value for ENV is:', process.env.NODE_ENV);
  res.render('index', { title: 'Express' });
});

router.get('/generate-key',accountController.generateAccount);
router.get('/test/:amount/:secret',accountController.test);
//router.get('/trust/:id',accountController.trust);
//router.get('/transfer',accountController.transferCall);

module.exports = router;
