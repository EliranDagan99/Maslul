gameMaslulApp.controller('TasksController', ['$scope', 'TasksTypesService', '$uibModal', 'UsersService',
    function($scope, TasksTypesService, $uibModal, UsersService) {
        
        $scope.updateView('tasks');
        
        // Open the new task modal
        $scope.openNewTaskModal = function (tasktypeid) {
            
            TasksTypesService.get(tasktypeid).then(function(response){
                var taskType = response.data;
                var modalInstance = $uibModal.open({
                    templateUrl: '/assets/templates/GameMaslul/WatchTaskModal.html',
                    controller: 'WatchTaskModalController',
                    resolve: {
                        task: function() {
                            return (null);
                        },
                        readonly: function() {
                            return (false);  
                        },
                        tasktype: function() {
                            return (taskType);
                        }, 
                        userid: function() {
                            return ($scope.user._id);
                        },
                        stage: function() {
                            return ($scope.user.stages.length - 1);
                        }
                    }
                });
                
                modalInstance.result.then(function (newTask) {

                    UsersService.insertDoneTask($scope.user._id, newTask).then(function(response){

                        if(response.data){
                            alertify.success("המשימה דורשת אישור צפה - תאושר בהקדם");
                        }else{
                            alertify.success("המשימה נוספה בהצלחה");
                        }

                        $scope.refreshData();
                    }, function(result){
                        alertify.error("שגיאה בהוספת המשימה");
                    });
                
                }, function (item) {

                }); 
                
            }, function(result){

            });
        };
    }
]);