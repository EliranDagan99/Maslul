manageMaslulApp.controller('ChooseTaskTypeModalController', [ '$uibModalInstance', '$scope', 'TasksTypesService',
    function ($uibModalInstance, $scope, TasksTypesService) {
        
        // Get the tasks types options
        TasksTypesService.getAll().then(function(response){
            $scope.tasksTypes = response.data;
        }, function(result){
            alertify.error("שגיאה בטעינת סוגי המשימות");
        });
        
        // Save the changes
        $scope.save = function () {
            $uibModalInstance.close($scope.currTaskType);
        };

        // Remove the changes
        $scope.cancel = function () {
            $uibModalInstance.dismiss(null);
        };
    }
]);