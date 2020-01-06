manageMaslulApp.service('TracksTypesService', ['$http', 
    function($http){
    
        // --------------------------------------- GET ---------------------------------------
        // DONE
        this.getTracksTypesNamesOfTaskType = function(taskTypeID){
            return ($http({
                method: 'GET',
                url: '/api/tracks/byTaskID',
                params: {taskTypeID: taskTypeID}
            }));
        };
        
        //Done
        this.create = function(trackTypeName){
            return ($http({
                method: 'PUT',
                url: '/api/tracks/create',
                params: {trackTypeName: trackTypeName}
            }));
        };
        
        // Done
        this.get = function(trackTypeID){
            return ($http({
                method: 'GET',
                url: '/api/tracks/byTrackId',
                params: {trackTypeID: trackTypeID}
            }));
        };
        
        // Done
        this.getAll = function(){
            return ($http({
                method: 'GET',
                url: '/api/tracks/all'
            }));
        };
        
        // Done
        this.getStagesNames = function(trackTypeID){
            return ($http({
                method: 'GET',
                url: '/api/tracks/stages/names',
                params: {trackTypeID: trackTypeID}
            }));
        };
        
        // Done
        this.update = function(trackType){
            return ($http({
                method: 'POST',
                url: '/api/tracks/update',
                data: trackType
            }));
        };

        // Done
        this.create = function(trackTypeName){
            return ($http({
                method: 'PUT',
                url: '/api/tracks/create',
                params: {trackTypeName: trackTypeName}
            }));
        };
}]);