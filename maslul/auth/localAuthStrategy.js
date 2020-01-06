"use strict";

var LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");

passport.use("provider",
  new LocalStrategy(function (username, password, done) {
    return done(null, {
      id: "8430239", // Optional - Change to your Id
      mador: 85 // Toval - is 85
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

module.exports = passport;