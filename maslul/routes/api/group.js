"use strict";

var express = require("express");
var router = express.Router();

const userDB = require("../../models/users");
const groupDB = require("../../models/groups");
const dbRouter = require("../../utils/dbRouter");

/*GET*/
router.get("/all", function(req, res) {
  groupDB.getAll(dbRouter.getDB(req.user.mador)).then(data => {
    res.json(data.map(user => user._id));
  });
});

router.get("/name/byId", function(req, res) {
  res.send("respond with a resource");
});

router.get("/all/names", function(req, res) {
  res.send("respond with a resource");
});

router.get("/all/data", function(req, res) {
  res.send("respond with a resource");
});

router.get("/points", function(req, res) {
  userDB
    .getByQuery(
      { group: { $eq: req.query.groupName } },
      dbRouter.getDB(req.user.mador),
      { firstName: 1, lastName: 1, points: 1 }
    )
    .then(data => {
      res.json(data.sort((a, b) => b.points - a.points));
    });
});

/*POST*/
router.put("/create", function(req, res) {
  groupDB
    .add({ _id: req.body.groupName }, dbRouter.getDB(req.user.mador))
    .then(() => res.send("הקבוצה נוספה בהצלחה"));
});

/*DELETE*/
router.delete("/remove", function(req, res) {
  groupDB
    .remove({ _id: req.query.groupName }, dbRouter.getDB(req.user.mador))
    .then(() => res.send("הקבוצה נמחקה בהצלחה"));
});

module.exports = router;
