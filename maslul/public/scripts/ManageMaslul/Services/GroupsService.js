manageMaslulApp.service('GroupsService', ['$http', 
    function($http){

        // --------------------------------------- GET ---------------------------------------

        // Done
        this.getAll = function(){
            return ($http({
                method: 'GET',
                url: '/api/group/all'
            }));
        };

        // --------------------------------------- DML ---------------------------------------

        // Done
        this.create = function(groupName){
            return ($http({
                method: 'PUT',
                url: '/api/group/create',
                data: {groupName: groupName}
            }));
        };
        
        // Done
        this.remove = function(groupName){
            return ($http({
                method: 'DELETE',
                url: '/api/group/remove',
                params: {groupName: groupName}
            }));
        };
}]);