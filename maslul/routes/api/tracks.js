"use strict";

var express = require("express");
var router = express.Router();
const ObjectID = require("mongodb").ObjectID;

const tracksDB = require("../../models/tracks");
const dbRouter = require("../../utils/dbRouter");

/*GET*/
// DONE
router.get("/all", function(req, res) {
  tracksDB
    .getAll(dbRouter.getDB(req.user.mador), { name: 1, "stages.name": 1 })
    .then(data => {
      res.json(data);
    });
});

// DONE
router.get("/byTaskID", function(req, res) {
  const tracksWithTask = [];

  tracksDB
    .getByQuery(
      {
        "stages.tasks": {
          $elemMatch: { tasktypeid: new ObjectID(req.query.taskTypeID) }
        }
      },
      dbRouter.getDB(req.user.mador),
      { name: 1 }
    )
    .then(data => {
      res.json(data);
    });
});

// Done
router.get("/byTrackId", function(req, res) {
  tracksDB
    .getById(req.query.trackTypeID, dbRouter.getDB(req.user.mador))
    .then(data => {
      res.json(data);
    });
});

// TO DO
router.get("/stages/names", function(req, res) {
  tracksDB
    .getByQuery(
      { _id: new ObjectID(req.query.trackTypeID) },
      dbRouter.getDB(req.user.mador),
      { "stages.name": 1 }
    )
    .then(data => {
      res.json(data[0].stages.map(stage => stage.name));
    });
});

/*Post*/
router.put("/create", function(req, res) {
  const newTrack = {
    _id: new ObjectID(),
    name: req.query.trackTypeName
  };

  tracksDB.add(newTrack, dbRouter.getDB(req.user.mador)).then(res.send());
});

router.post("/update", function(req, res) {
  const updatedTrack = req.body;
  updatedTrack._id = new ObjectID(updatedTrack._id);

  updatedTrack.stages.forEach(stage => {
    stage.tasks.forEach(task => {
      task.tasktypeid = new ObjectID(task.tasktypeid);
    });
  });

  tracksDB
    .update(
      { _id: updatedTrack._id },
      dbRouter.getDB(req.user.mador),
      updatedTrack
    )
    .then(res.send());
});

/*Delete - add that feature later*/
router.delete("/delete", function(req, res) {
  res.send("respond with a resource");
});

module.exports = router;
