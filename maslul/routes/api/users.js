"use strict";

var express = require("express");
var router = express.Router();

const ObjectID = require("mongodb").ObjectID;
const dbRouter = require("../../utils/dbRouter");

const userDB = require("../../models/users");
const tasksDB = require("../../models/taskTypes");
const watingTasksDB = require("../../models/watingTasks");
const tracksDB = require("../../models/tracks");

/**************************GET**************************/
router.get("/all", function (req, res) {
  userDB.getAll(dbRouter.getDB(req.user.mador)).then(data => {
    res.json(data);
  });
});

router.get("/all/basic", function (req, res) {
  userDB
    .getAll(dbRouter.getDB(req.user.mador), {
      firstName: 1,
      lastName: 1,
      role: 1,
      group: 1,
      track: 1,
      points: 1
    })
    .then(data => {
      res.json(data);
    });
});

router.get("/doneTasks", function (req, res) {
  userDB
    .getByQuery({
        _id: req.query.id
      },
      dbRouter.getDB(req.user.mador), {
        id: 1,
        doneTasks: 1
      }
    )
    .then(data => {
      res.json(data);
    });
});

router.get("/me", function (req, res) {
  userDB
    .getByQuery({
        _id: "s" + req.user.id
      },
      dbRouter.getDB(req.user.mador)
    )
    .then(data => {
      res.json(data[0]);
    });
});

router.get("/userById", function (req, res) {
  userDB
    .getByQuery({
        _id: req.query.userId
      },
      dbRouter.getDB(req.user.mador)
    )
    .then(data => {
      res.json(data[0]);
    });
});

router.get("/groupData", function (req, res) {
  userDB
    .getByQuery({
        group: req.query.groupId
      },
      dbRouter.getDB(req.user.mador)
    )
    .then(data => {
      res.json(data);
    });
});

router.get("/points", function (req, res) {
  userDB
    .getByQuery({
        _id: "s" + req.user.id
      },
      dbRouter.getDB(req.user.mador), {
        points: 1
      }
    )
    .then(data => {
      res.json(data);
    });
});

router.get("/all/points", function (req, res) {
  userDB
    .getByQuery({}, dbRouter.getDB(req.user.mador), {
      firstName: 1,
      lastName: 1,
      points: 1,
      group: 1
    })
    .then(data => {
      res.json(data.sort((a, b) => b.points - a.points));
    });
});

router.get("/stagesNames", function (req, res) {
  userDB.getByQuery({
    _id: req.query.userID
  }, dbRouter.getDB(req.user.mador)).then((user) => {
    res.json(user[0].stages.map(stage => stage.name));
  })
});

/**************************POST**************************/
router.post("/create", function (req, res) {
  res.send("respond with a resource");
});

router.post("/insert/dueDate", function (req, res) {
  res.send("respond with a resource");
});

router.post("/newMessage", function (req, res) {
  res.send("respond with a resource");
});

router.post("/newMessage/all", function (req, res) {
  res.send("respond with a resource");
});

/**************************PUT**************************/
router.put("/insert/doneTask", function (req, res) {
  const userid = req.body.userID;
  const doneTask = req.body.donetask;

  // Append new ObjectId
  doneTask._id = new ObjectID().toString();

  let bNeedsApproval;

  tasksDB
    .getById(doneTask.tasktypeid, dbRouter.getDB(req.user.mador))
    .then(data => {
      bNeedsApproval = data.approvalRequired;

      if (!bNeedsApproval) {
        doneTask.approval = true;
        doneTask.date = new Date(doneTask.date.$date);

        userDB.update({
            _id: userid
          },
          dbRouter.getDB(req.user.mador), {
            $inc: {
              points: doneTask.points
            }
          }
        );

        userDB.pushToId(
          userid, {
            doneTasks: doneTask
          },
          dbRouter.getDB(req.user.mador)
        );
      } else {
        doneTask.approval = false;

        userDB.pushToId(
          userid, {
            doneTasks: doneTask
          },
          dbRouter.getDB(req.user.mador)
        );

        watingTasksDB.add({
            userid: userid,
            tasktypeid: doneTask.tasktypeid,
            donetaskid: doneTask._id,
            date: new Date()
          },
          dbRouter.getDB(req.user.mador)
        );
      }

      res.json(data.approvalRequired);
    });
});

router.put("/update/doneTask", function (req, res) {
  const userid = "s" + req.user.id;
  const doneTask = req.body.donetask;
  doneTask.date = new Date(doneTask.date.date);

  userDB.update({
      _id: userid,
      "doneTasks._id": doneTask._id
    },
    dbRouter.getDB(req.user.mador), {
      $set: {
        "donetask.$": doneTask
      }
    }
  );
});

router.put("/insert/nextStage", function (req, res) {
  const stageName = req.query.nextStageName;
  const trackId = req.query.trackTypeID;
  const userId = req.query.userID;

  tracksDB
    .getByQuery({
        _id: new ObjectID(trackId)
      },
      dbRouter.getDB(req.user.mador)
    )
    .then(track => {
      const stage = track[0].stages.find(stage =>
        stage.name.includes(stageName)
      );

      stage.tasks.map(
        task => (task.tasktypeid = new ObjectID(task.tasktypeid))
      );

      userDB
        .pushToId(
          userId, {
            stages: stage
          },
          dbRouter.getDB(req.user.mador)
        )
        .then(res.send());
    });
});

router.put("/addDueDate", function (req, res) {

});

router.delete("/messages", function (req, res) {
  userDB
    .removeFields("s" + req.user.id, dbRouter.getDB(req.user.mador), {
      $unset: {
        messages: 1
      }
    })
    .then(data => {
      res.json(data);
    });
});

module.exports = router;