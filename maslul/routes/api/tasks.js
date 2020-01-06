"use strict";

var express = require("express");
var router = express.Router();

const ObjectID = require("mongodb").ObjectID;
const tasksDB = require("../../models/taskTypes");
const dbRouter = require("../../utils/dbRouter");

/*GET*/
// DONE
router.get("/all", function(req, res) {
  tasksDB.getAll(dbRouter.getDB(req.user.mador)).then(data => {
    res.json(data);
  });
});

// DONE.
router.get("/all/bonus", function(req, res) {
  tasksDB
    .getByQuery({ bonus: { $eq: true } }, dbRouter.getDB(req.user.mador))
    .then(data => {
      res.json(data);
    });
});

// DONE
router.get("/getById", function(req, res) {
  tasksDB
    .getById(req.query.id, dbRouter.getDB(req.user.mador))
    .then(data => {
      res.json(data);
    });
});

/*POST*/
router.post("/update", function(req, res) {
  const updatedTask = req.body;
  updatedTask._id = new ObjectID(updatedTask._id);

  tasksDB
    .update({ _id: updatedTask._id }, dbRouter.getDB(req.user.mador), updatedTask)
    .then(res.send());
});

router.post("/create", function(req, res) {
  const newTask = req.body;
  newTask._id = new ObjectID(newTask._id);

  tasksDB.add(newTask, dbRouter.getDB(req.user.mador)).then(res.send());
});

/*Delete*/
router.delete("/delete", function(req, res) {
  tasksDB
    .remove(
      { _id: new ObjectID(req.query.id) },
      dbRouter.getDB(req.user.mador)
    )
    .then(res.send());
});

module.exports = router;
