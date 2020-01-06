manageMaslulApp.controller('ManageUsersController', ['$scope', 'UsersService', 'GroupsService', 'TracksTypesService',
    function($scope, UsersService, GroupsService, TracksTypesService) {
        
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

            // Get the track types options
            TracksTypesService.getAll().then(function(response){
                $scope.tracksTypes = response.data;
            }, function(result){
                alertify.error("שגיאה בטעינת סוגי המסלולים");
            });
        };
        
        refreshData();
        
        // Update user
        $scope.updateUser = function(user){
            UsersService.updateBasicDetails(user._id, 
                                            user.firstName,
                                            user.lastName,
                                            user.role).then(function(response){
                alertify.success("פרטי המשתמש עודכנו בהצלחה");
                refreshData();
            }, function(rsult){
                alertify.error("שגיאה בעדכון נתוני המשתמש");
            });
        }
        
        // Add new user
        $scope.createNew = function(newUser){
            UsersService.createNewUser(newUser._id, 
                                       newUser.firstName,
                                       newUser.lastName,
                                       newUser.role).then(function(response){
                alertify.success("המשתמש נוסף בהצלחה");
                refreshData();
            }, function(rsult){
                alertify.error("שגיאה ביצירת משתמש חדש. יתכן שהמשתמש כבר קיים.");
            });
        }
    }
]);