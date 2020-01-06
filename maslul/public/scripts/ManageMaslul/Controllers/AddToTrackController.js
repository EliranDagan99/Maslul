manageMaslulApp.controller('AddToTrackController', ['$scope', 'UsersService', 'TracksTypesService',
    function($scope, UsersService, TracksTypesService) {
        // Refresh the page data
        var refreshData = function() {
            
            // Get the basic users data
            UsersService.getAllBasicData().then(function(response){

                $scope.users = response.data;

                // Add display name for search
                angular.forEach($scope.users, function(user, key) {
                    user.displayName = user.firstName + " " + user.lastName + " (" + user._id + ")"; 
                });

            }, function(result){
                alertify.error("שגיאה בטעינת רשימת המשתמשים");
            });

            // Get the track types options
            TracksTypesService.getAll().then(function(response){
                $scope.tracksTypes = response.data;
            }, function(result){
                alertify.error("שגיאה בטעינת סוגי המסלולים");
            });
        };
        
        refreshData();
        
        $scope.addUsersToTrackType = function(selectedUser, selectedTrackType, selectedStageName){

             selectedUser = selectedUser.originalObject;
             UsersService.updateTrack(selectedUser._id, selectedTrackType._id).then(function(response){
                 alertify.success("המשתמש " + selectedUser.displayName + " נוסף בהצלחה למסלול");
                 
                 if (selectedStageName) {
                     UsersService.insertNextStage(selectedUser._id, selectedTrackType._id, selectedStageName).then(function(resposne){
                         alertify.success("המשתמש " + selectedUser.displayName + " הוכנס בהצלחה לשלב " + selectedStageName);   
                     }, function(result){
                         alertify.error("שגיאה בהכנסת השלב " + selectedStageName + " למשתמש " + selectedUser.displayName);
                     });
                 }
             }, function(result){
                 alertify.error("שגיאה בשיוך המשתמש " + selectedUser.displayName + " למסלול");
             });
        };
    }
]);