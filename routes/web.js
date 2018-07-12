var express = require('express');
var router = express.Router();
var webController = require('../controllers/webController');

router.get('/', webController.register);


module.exports = router;