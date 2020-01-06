var express = require('express');
var router = express.Router();

// get all resources
var usersRoutes = require('./api/users');
const filesRoutes = require('./api/files');
const groupRoutes = require('./api/group');
const tasksRoute = require('./api/tasks');
const tracksRoute = require('./api/tracks');
const waitingApproval = require('./api/waitingTasks');

// Set auth for /api

// Set additional routes
router.use('/users', usersRoutes);
router.use('/file', filesRoutes);
router.use('/group', groupRoutes);
router.use('/tasks', tasksRoute);
router.use('/tracks', tracksRoute);
router.use('/waiting', waitingApproval);


module.exports = router;