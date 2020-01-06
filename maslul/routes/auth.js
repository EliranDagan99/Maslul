var express = require("express");
var router = express.Router();
var passport = require("../app").passport;

/* GET users listing. */
router.get(
  "/oauth/return",
  passport.authenticate("provider", {
    failureRedirect: "/login"
  }),
  function(req, res) {
    res.redirect("/");
  }
);

module.exports = router;
