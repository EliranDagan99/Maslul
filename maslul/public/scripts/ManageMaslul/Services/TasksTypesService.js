manageMaslulApp.service('TasksTypesService', ['$http', 
    function($http){
    
        // --------------------------------------- GET ---------------------------------------
        
        // DONE
        this.getAll = function(){
            return ($http({
                method: 'GET',
                url: '/api/tasks/all'
            }));
        };
        
        // DONE
        this.get = function(id){
            return ($http({
                method: 'GET',
                url: '/api/tasks/getById',
                params: {id: id}
            }));
        };
        
       // --------------------------------------- DML ---------------------------------------

       // Done
        this.update = function(taskType){
            return ($http({
                method: 'POST',
                url: '/api/tasks/update',
                data: taskType
            }));
        }; 
        
        //Done
        this.create = function(taskType){
            return ($http({
                method: 'POST',
                url: '/api/tasks/create',
                data: taskType
            }));
        };
        
        //Done
        this.delete = function(id){
            return ($http({
                method: 'DELETE',
                url: '/api/tasks/delete',
                params: {id: id}
            }));
        };
}]);