manageMaslulApp.controller('SetNextStageModalController', [ '$uibModalInstance', '$scope', 'TracksTypesService', 'currStage', 'trackid',
    function ($uibModalInstance, $scope, TracksTypesService, currStage, trackid) {
        
        $scope.currStage = currStage;
        
        // Get the stages names options
        TracksTypesService.getStagesNames(trackid).then(function(response){
            $scope.stages = response.data;
            
            var nextStageIndex = _.indexOf($scope.stages, currStage) + 1;
            
            if (nextStageIndex != -1) {
                $scope.defaultNextStage = $scope.stages[nextStageIndex];
                $scope.nextStage = $scope.defaultNextStage;
            }

        }, function(result){
            alertify.error("שגיאה בטעינת השלבים במסלול");
        });
        
        // Save the changes
        $scope.save = function () {
            $uibModalInstance.close($scope.nextStage);
        };

        // Remove the changes
        $scope.cancel = function () {
            $uibModalInstance.dismiss(null);
        };
    }
]);