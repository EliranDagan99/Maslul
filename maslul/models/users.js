const dbConnection = require("../utils/dbConn");

const users = new dbConnection("users");

module.exports = users;
