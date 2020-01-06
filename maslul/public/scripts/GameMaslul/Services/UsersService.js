gameMaslulApp.service('UsersService', ['$http',
    function ($http) {

        // DONE
        this.getMe = function () {
            return ($http({
                method: 'GET',
                url: '/api/users/me'
            }));
        };

        // DONE
        this.deleteMessages = function () {
            return ($http({
                method: 'DELETE',
                url: '/api/users/messages'
            }));
        };

        // DONE
        this.getGroupPoints = function (groupName) {
            return ($http({
                method: 'GET',
                url: '/api/group/points',
                params: {
                    groupName: groupName
                }
            }));
        };

        // DONE
        this.getAllPoints = function () {
            return ($http({
                method: 'GET',
                url: '/api/users/all/points'
            }));
        };


        // Done
        this.insertDoneTask = function (userID, donetask) {
            return ($http({
                method: 'PUT',
                url: '/api/users/insert/doneTask',
                data: {
                    userID: userID,
                    donetask: donetask
                }
            }));
        };

        // Done
        this.deleteDoneTask = function (userID, taskid,points) {
            return ($http({
                method: 'DELETE',
                url: '/api/users/doneTask',
                params: {
                    userID: userID,
                    taskid: taskid,
                    points: points
                }
            }));
        };

        // Done
        this.updateDoneTask = function (userID, donetask) {
            return ($http({
                method: 'PUT',
                url: '/api/users/update/doneTask',
                data: {
                    userID: userID,
                    donetask: donetask
                }
            }));
        };

}]);