manageMaslulApp.controller('PostMessageController', ['$scope', 'UsersService',
    function($scope, UsersService) {
        
        // Post message
        $scope.post = function(){
            UsersService.addNewMessageToEveryone($scope.newMessage).then(function(response){
                    alertify.success("ההודעה פורסמה בהצלחה!");
                    $scope.newMessage = "";
                }, function(result){
                    alertify.error("שגיאה בפרסום ההודעה");
                });
        };
    }
]);