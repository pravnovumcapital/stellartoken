var express = require('express');
var router = express.Router();
var apiController = require('../controllers/apiController');

router.post('/register', apiController.register);

module.exports = router;