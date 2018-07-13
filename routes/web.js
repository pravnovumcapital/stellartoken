var express = require('express');
var router = express.Router();
var webController = require('../controllers/webController');

router.get('/:email', webController.register);
router.get('/detail/:id', webController.detail);

module.exports = router;