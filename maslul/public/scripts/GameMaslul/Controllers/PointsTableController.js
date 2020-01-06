gameMaslulApp.controller('PointsTableController', ['$scope', 'UsersService',
    function($scope, UsersService) {
        
        $scope.updateView('pointsTable');
        
        // Init vars
        $scope.filterGroup = $scope.user.group;
        
        // Get the users points 
        UsersService.getAllPoints().then(function(response){
            $scope.allPointsTable = response.data;
        }, function(result){
            alertify.error("שגיאה בטעינת טבלת המובילים");
        });
        
    }
]);