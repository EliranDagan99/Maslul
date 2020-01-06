const dbConnection = require("../utils/dbConn");

const tracksTypes = new dbConnection("tracksTypes");

module.exports = tracksTypes;
