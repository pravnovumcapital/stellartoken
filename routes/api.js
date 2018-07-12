var express = require('express');
var router = express.Router();
var apiController = require('../controllers/apiController');

router.get('/register', apiController.register);

module.exports = router;