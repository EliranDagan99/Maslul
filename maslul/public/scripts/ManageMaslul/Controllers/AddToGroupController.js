manageMaslulApp.controller('AddToGroupController', ['$scope', 'UsersService', 'GroupsService',
    function($scope, UsersService, GroupsService) {
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

            // Get the groups options
            GroupsService.getAll().then(function(response){
                $scope.groups = response.data;
            }, function(result){
                alertify.error("שגיאה בטעינת הקבוצות");
            });
        };
        
        refreshData();
        
        $scope.addUsersToGroup = function(){
             var selectedUser = $scope.selectedUser.originalObject;
             UsersService.updateGroup(selectedUser._id, $scope.selectedGroup).then(function(response){
                 alertify.success("המשתמש " + selectedUser.displayName + " נוסף בהצלחה לקבוצה");
             }, function(result){
                 alertify.error("שגיאה בשיוך המשתמש " + selectedUser.displayName + " לקבוצה");
             });
        };
    }
]);