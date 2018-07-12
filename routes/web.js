var express = require('express');
var router = express.Router();
var webController = require('../controllers/webController');

router.get('/', webController.register);
router.post('/', webController.register_post);
router.get('/:id', webController.detail);

module.exports = router;