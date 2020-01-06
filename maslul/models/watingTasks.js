const dbConnection = require("../utils/dbConn");

const waitingApprovalTask = new dbConnection("waitingApprovalTask");

module.exports = waitingApprovalTask;
