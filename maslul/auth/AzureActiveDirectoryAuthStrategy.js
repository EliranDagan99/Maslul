"use strict";

const AzureOAuth2Strategy = require("passport-azure-oauth2");
const jwt = require("jwt-simple");
const config = require("../config").config;
const passport = require("passport");
const axios = require("axios");

const users = [];

const findUserByOid = async function(oid, fn) {
  const registeredUser = users.find(user => user.oid === oid);

  if (registeredUser !== undefined) {
    return fn(null, registeredUser);
  }

  return fn(null, null);
};

const requestUserGroups = async function(Oid) {
  return await axios
    .get(config.userGroupsService, {
      params: {
        uid: Oid
      }
    })
    .then(res => {
      console.log({
        "serever responese": res.data
      });
      return res.data;
    })
    .catch(rej => {
      console.log({
        "serever responese": res.data
      });
      return rej;
    });
};

passport.use(
  "provider",
  new AzureOAuth2Strategy(
    {
      clientID: config.clientID,
      clientSecret: config.clientSecret,
      callbackURL: config.callbackUri,
      resource: config.resource,
      tenant: config.tenant,
      state: config.state,
      skipUserProfile: config.skipUserProfile
    },
    function(accessToken, refreshtoken, params, profile, done) {
      const UserDetails = jwt.decode(params.id_token, "", true);

      if (!UserDetails.oid) {
        return done(new Error("No User Found"), null);
      }

      // asynchronous verification, for effect...
      findUserByOid(UserDetails.oid, async function(err, user) {
        if (err) {
          return done(err);
        }

        // The user Never Logged on To The server Therfore he will be added
        // To The Cache "Auto-registration"
        if (!user) {
          // GetMoreUserData [optional]
          if (config.getUserGroups) {
            //UserDetails.userGroups = await requestUserGroups(UserDetails.oid);
          }

          users.push(UserDetails);
          return done(null, user);
        }
        return done(null, user);
      });
    }
  )
);

passport.serializeUser(function(user, done) {
  console.log("profile : ", user);
  done(null, user.oid);
});

passport.deserializeUser((oid, done) => {
  findUserByOid(oid, function(err, user) {
    user.id = user.upn.split("@")[0].split("u")[1];
    user.mador = 85;
    done(err, user);
  });
});

module.exports = passport;
