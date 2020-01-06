manageMaslulApp.controller('TracksTypesController', ['$scope', '$timeout', '$uibModal', 'TracksTypesService', 'TasksTypesService',
    function($scope, $timeout, $uibModal, TracksTypesService, TasksTypesService) {
        
        // Init vars
        $scope.types = ["הדרכתי", "פיקודי", "מקצועי"];
        
        // Get the tasks types
        TasksTypesService.getAll().then(function(response){
            $scope.tasksTypes = response.data;
        }, function(result){
            alertify.error("שגיאה בטעינת סוגי המשימות");
        });
        
        // Refresh the page data
        var refreshData = function() {
            
            // Get the tasks types options
            TracksTypesService.getAll().then(function(response){
                $scope.tracksTypes = response.data;
            }, function(result){
                alertify.error("שגיאה בטעינת סוגי המסלולים");
            });
        };
        
        refreshData();
        
        
        // Get track type more details
        $scope.$watch('selectedTrackType', function(selectedTrackType){
            if (selectedTrackType){
                TracksTypesService.get(selectedTrackType._id).then(function(response){
                    $scope.selectedTrackTypeData = response.data;
					if($scope.selectedTrackTypeData.stages == null) {
						$scope.selectedTrackTypeData.stages = [];
					}
                    
                    // Build the stages status
                    angular.forEach($scope.selectedTrackTypeData.stages, function(stage, keyStage){
                        angular.forEach(stage.tasks, function (stageTask, keyTask){
                            // Add the basic data
                            var taskType = _.find($scope.tasksTypes, function(type){ 
                                return (type._id.includes(stageTask.tasktypeid));
                            });

                            stageTask.name = taskType.name;
                            stageTask.description = taskType.description;
                            stageTask.type = taskType.type;
                       });
                    });
                    
                }, function(result){
                    alertify.error("שגיאה בטעינת סוג משימה נבחר");
                });
            }
        });
        
        // Add new track type
        $scope.newTrackType = function() {
            alertify.prompt('הוספת סוג מסלול חדש', 
                            'הזן את שם סוג המסלול',
                            '',
                            function(evt, trackTypeName) { 
                                TracksTypesService.create(trackTypeName).then(function(response){
                                    refreshData();  
                                    alertify.success('סוג המסלול נוסף בהצלחה');
                                }, function(result){
                                    alertify.error('שגיאה בהוספת סוג מסלול חדש');
                                }); 
                            }, function(){
                            });
        }
        
        // Add new stage
        $scope.newStage = function() {
            alertify.prompt('הוספת שלב חדש', 
                            'הזן את שם השלב',
                            '',
                            function(evt, stageName) { 
                                $scope.selectedTrackTypeData.stages.push({name: stageName, tasks: []});
                                $timeout(function(){
                                    $scope.activeTabIndex = $scope.selectedTrackTypeData.stages.length - 1;
                                });
                            }, function(){
                            });
        }
        
        // Delete stage
        $scope.deleteStage = function(index) {
            alertify.confirm('מחיקת שלב', 
                             'האם אתה בטוח שברצונך למחוק את השלב?',
                             function() { 
                                $scope.selectedTrackTypeData.stages.splice(index, 1);
                                $timeout(function(){
                                    $scope.activeTabIndex = 0;
                                });
                             }, function(){
                             });
        } 
        
        // Move stage before
        $scope.moveStageBefore = function(index) {
            if (index > 0) {
                $scope.selectedTrackTypeData.stages.move(index, index - 1);
            }
        } 
        
        // Move stage after
        $scope.moveStageAfter = function(index) {
            if (index < $scope.selectedTrackTypeData.stages.length - 1) {
                $scope.selectedTrackTypeData.stages.move(index, index + 1);
            }
        } 
        
        // Update track type changes
        $scope.updateTrackType = function(trackType) {
            var copyTrackType = angular.copy(trackType);
            
            alertify.confirm('שמור שינויים', 
                             'האם אתה בטוח שברצונך לשמור את השינויים?',
                             function() { 
                                // Remove the additional fields before update
                                angular.forEach(copyTrackType.stages, function(stage, keyStage){
                                    angular.forEach(stage.tasks, function (stageTask, keyTask){
                                        delete stageTask.name;
                                        delete stageTask.description;
                                        delete stageTask.type;
                                   });
                                });              

                                // Update
                                TracksTypesService.update(copyTrackType).then(function(response){
                                        alertify.success("סוג המסלול עודכן בהצלחה");
                                        refreshData();
                                    }, function(result){
                                        alertify.error("שגיאה בעדכון סוג המסלול");
                                    });
                             }, function(){
                             });
        } 
        
        // Open the add task type modal
        $scope.openAddTaskTypeModal = function (tasksTypesArray) {
            var modalInstance = $uibModal.open({
                templateUrl: '/assets/templates/ManageMaslul/ChooseTaskTypeModal.html',
                controller: 'ChooseTaskTypeModalController'
            });
                
            modalInstance.result.then(function (newTaskType) {
                if (newTaskType) {
                    // Add the new task to the track type
                    tasksTypesArray.push({
                        tasktypeid: newTaskType._id,
                        required: false,
                        minimumAmount: 1,
                        name: newTaskType.name,
                        description: newTaskType.description,
                        type: newTaskType.type
                    });
                }
            }, function (item) {
                
            }); 
        };
        
        // Delete task type
        $scope.deleteTaskType = function(tasksTypesArray, index) {
            tasksTypesArray.splice(index, 1);
        }
        
        // Move task type up
        $scope.upTaskType = function(tasksTypesArray, index) {
            if (index > 0) {
                tasksTypesArray.move(index, index - 1);
            }
        } 
        
        // Move task type down
        $scope.downTaskType = function(tasksTypesArray, index) {
            if (index < tasksTypesArray.length - 1) {
                tasksTypesArray.move(index, index + 1);
            }
        } 
    }
]);