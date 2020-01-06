"use strict";

var express = require("express");
var router = express.Router();
var passport = require("../app").passport;
const url = require("url");

const ensureAuthenticated = (req, res, next) => {
  if (
    req.user === undefined &&
    req.path !== "/login" &&
    req.path !== "/auth/oauth/return"
  ) {
    // Redirect To /login if needed
    res.redirect(
      url.format({
        pathname: "/login",
        query: {
          username: "bla",
          password: "bla"
        }
      })
    );
  } else {
    next();
  }
};

router.use(ensureAuthenticated);

/* GET home page. */
router.get("/", (req, res) => {
  res.redirect("/assets/Game.html");
});

router.get("/Manage", (req, res) => {
  res.redirect("/assets/Manage.html");
});

router.get(
  "/login",
  passport.authenticate("provider", {
    successRedirect: "/"
  })
);

module.exports = router;