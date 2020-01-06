"use strict";

var express = require("express");
var router = express.Router();
const ObjectID = require("mongodb").ObjectID;

const dbRouter = require("../../utils/dbRouter");
const userDB = require("../../models/users");
const tasksDB = require("../../models/taskTypes");
const watingTasksDB = require("../../models/watingTasks");

/**************************GET**************************/
router.get("/all", function(req, res) {
  watingTasksDB
    .getAll(dbRouter.getDB(req.user.mador))
    .then(data => res.json(data));
});

/**************************POST**************************/
router.put("/approve", function(req, res) {
  tasksDB
    .getById(req.query.taskid, dbRouter.getDB(req.user.mador))
    .then(data => {
      const task = data;

      userDB
        .update(
          { _id: req.query.userID },
          dbRouter.getDB(req.user.mador),
          { $inc: { points: task.points } }
        )
        .then(() => res.send("המשימה הושלמה"));
    });
});

/**************************DELETE**************************/
router.delete("/remove", function(req, res) {
  watingTasksDB
    .remove(
      { _id: new ObjectID(req.query.waitingApprovalTaskID) },
      dbRouter.getDB(req.user.mador)
    )
    .then(() => {
      res.send("המשימה נמחקה");
    });
});

module.exports = router;
