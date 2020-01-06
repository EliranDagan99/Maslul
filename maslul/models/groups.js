const dbConnection = require("../utils/dbConn");

const Cycles = new dbConnection("groups");

module.exports = Cycles;