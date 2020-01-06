manageMaslulApp.service('UsersService', ['$http',
    function ($http) {

        // --------------------------------------- GET ---------------------------------------

        // Done
        this.getAllUsers = function () {
            return ($http({
                method: 'GET',
                url: '/api/users/all',
            }));
        };


        // Done
        this.getDoneTasks = function (id) {
            return ($http({
                method: 'GET',
                url: '/api/users/doneTasks',
                params: {
                    id: id
                }
            }));
        };

        // Done
        this.getAllBasicData = function () {
            return ($http({
                method: 'GET',
                url: '/api/users/all/basic'
            }));
        };


        // Done
        this.getGroupAllData = function (groupName) {
            return ($http({
                method: 'GET',
                url: '/api/users/groupData',
                params: {
                    groupName: groupName
                }
            }));
        };

        // Done
        this.get = function (userId) {
            return ($http({
                method: 'GET',
                url: '/api/users/userById',
                params: {
                    userId: userId
                }
            }));
        };

        // Done
        this.getMe = function () {
            return ($http({
                method: 'GET',
                url: '/api/users/me'
            }));
        };

        // Done
        this.insertNextStage = function (userID, trackTypeID, nextStageName) {
            return ($http({
                method: 'PUT',
                url: '/api/users/insert/nextStage',
                params: {
                    userID: userID,
                    trackTypeID: trackTypeID,
                    nextStageName: nextStageName
                }
            }));
        };

        // Done
        this.getStagesNames = function (userID) {
            return ($http({
                method: 'GET',
                url: '/api/users/stagesNames',
                params: {
                    userID: userID
                }
            }));
        };

        this.getGroupPoints = function (groupName) {
            return ($http({
                method: 'GET',
                url: '/users/getGroupPoints',
                params: {
                    groupName: groupName
                }
            }));
        };

        this.getAllPoints = function () {
            return ($http({
                method: 'GET',
                url: '/users/getAllPoints'
            }));
        };

        // --------------------------------------- DML ---------------------------------------

        this.createNewUser = function (userID, firstName, lastName, role) {
            return ($http({
                method: 'PUT',
                url: '/users/createNewUser',
                params: {
                    userID: userID,
                    firstName: firstName,
                    lastName: lastName,
                    role: role
                }
            }));
        };

        this.updateBasicDetails = function (userID, firstName, lastName, role) {
            return ($http({
                method: 'PUT',
                url: '/users/updateBasicDetails',
                params: {
                    userID: userID,
                    firstName: firstName,
                    lastName: lastName,
                    role: role
                }
            }));
        };

        this.updateGroup = function (userID, groupName) {
            return ($http({
                method: 'PUT',
                url: '/users/updateGroup',
                params: {
                    userID: userID,
                    groupName: groupName
                }
            }));
        };

        this.updateTrack = function (userID, trackID) {
            return ($http({
                method: 'PUT',
                url: '/users/updateTrack',
                params: {
                    userID: userID,
                    trackID: trackID
                }
            }));
        };

        this.insertDoneTask = function (userID, donetask) {
            return ($http({
                method: 'PUT',
                url: '/users/insertDoneTask',
                data: {
                    userID: userID,
                    donetask: donetask
                }
            }));
        };

        this.updateDoneTask = function (userID, donetask) {
            return ($http({
                method: 'PUT',
                url: '/users/updateDoneTask',
                data: {
                    userID: userID,
                    donetask: donetask
                }
            }));
        };

        this.addDueDate = function (userID, wantedTask, stage) {
            return ($http({
                method: 'PUT',
                url: '/api/users/addDueDate',
                data: {
                    userID: userID,
                    wantedTask: wantedTask,
                    stage: stage
                }
            }));
        };

        this.deleteDoneTask = function (userID, taskid) {
            return ($http({
                method: 'DELETE',
                url: '/users/deleteDoneTask',
                params: {
                    userID: userID,
                    taskid: taskid
                }
            }));
        };

        this.addNewMessage = function (userid, text) {
            return ($http({
                method: 'PUT',
                url: '/users/addNewMessage',
                params: {
                    userid: userid,
                    text: text
                }
            }));
        };

        this.addNewMessageToEveryone = function (text) {
            return ($http({
                method: 'PUT',
                url: '/users/addNewMessageToEveryone',
                params: {
                    text: text
                }
            }));
        };

        this.deleteMessages = function () {
            return ($http({
                method: 'DELETE',
                url: '/users/deleteMessages'
            }));
        };
    }
]);