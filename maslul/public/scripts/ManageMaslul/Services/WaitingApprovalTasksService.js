manageMaslulApp.service('WaitingApprovalTasksService', ['$http', 
    function($http){
        
        // --------------------------------------- DML ---------------------------------------

        this.remove = function(waitingApprovalTaskID){
            return ($http({
                method: 'DELETE',
                url: '/api/waiting/remove',
                params: {waitingApprovalTaskID: waitingApprovalTaskID}
            }));
        };
        
        // --------------------------------------- GET ---------------------------------------
        
        this.getAll = function(){
            return ($http({
                method: 'GET',
                url: '/api/waiting/all'
            }));
        };

        this.approveDoneTask = function (userID, taskid) {
            return ($http({
                method: 'PUT',
                url: '/api/waiting/approve',
                params: {
                    userID: userID,
                    taskid: taskid
                }
            }));
        };
}]);