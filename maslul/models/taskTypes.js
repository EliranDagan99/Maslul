const dbConnection = require("../utils/dbConn");

const taskTypes = new dbConnection("tasksTypes");

module.exports = taskTypes;
