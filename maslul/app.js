var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

//  var express = require("express");
var session = require("express-session");
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(cookieParser());
app.use("/assets", express.static(path.join(__dirname, "public")));

// Init Excpress Session - Must come Before The Passport.initialize() ....
app.use(
  session({
    secret: "somesecret",
    resave: true,
    saveUninitialized: true
  })
);

// Passport Init
let passport;

// Check in which env were working on
if (process.env.NODE_ENV !== "production") {
  // Import env Variables
  require("dotenv").config();

  passport = require("./auth/localAuthStrategy");
} else {
  passport = require("./auth/AzureActiveDirectoryAuthStrategy.js");
}

app.use(passport.initialize());
app.use(passport.session());

module.exports.passport = passport;

// Init Routes
const indexRouter = require("./routes/index.js");
const authRouter = require("./routes/auth.js");
const apiRouter = require("./routes/api.js");

// Routes Definition
app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports.app = app;