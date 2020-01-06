'use strict';

var express = require('express');
var router = express.Router();

/**************************GET**************************/
router.get('/file', function(req, res) {
    res.send('respond with a resource');
});


/**************************POST**************************/
router.post('/upload', function(req, res) {
    res.send('respond with a resource');
});


/**************************DELETE**************************/
router.delete('/remove', function(req, res) {
    res.send('respond with a resource');
});

module.exports = router; 