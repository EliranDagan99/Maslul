gameMaslulApp.controller('ProfileController', ['$scope', '$uibModal', 'TasksTypesService', 'UsersService',
    function($scope, $uibModal, TasksTypesService, UsersService) {
        
        $scope.updateView('profile');
        
        // Init vars
        $scope.state = "recommended";
        $scope.types = ["הדרכתי", "פיקודי", "מקצועי"];
        
        $scope.$on("dataReady", function(){
            $scope.activeTab = $scope.user.stages.length;
        });
 
        if ($scope.dataReady)
        {
            $scope.activeTab = $scope.user.stages.length;    
        }                                   
        
        // Open the edit task modal
        $scope.openEditTaskModal = function (task, readonly) {

            task.date = {date: new Date(task.date)};

            var modalInstance = $uibModal.open({
                templateUrl: '/assets/templates/GameMaslul/WatchTaskModal.html',
                controller: 'WatchTaskModalController',
                resolve: {
                    task: function () {
                        return (task);
                    },
                    readonly: function() {
                        return (readonly);
                    },
                    tasktype: function() {
                        return (null);
                    }, 
                    userid: function() {
                        return ($scope.user._id);
                    },
                    stage: function() {
                        return (null);
                    }
                }
            });
                
            modalInstance.result.then(function (newTask) {

                UsersService.updateDoneTask($scope.user._id, newTask).then(function(response){
                    alertify.success("המשימה עודכנה בהצלחה");
                    $scope.refreshData();
                }, function(result){
                    alertify.error("שגיאה בעדכון המשימה");
                });
                
            }, function (item) {
                
            }); 
        };

        // Open the new task modal
        $scope.openNewTaskModal = function (tasktypeid, stage) {
            
            TasksTypesService.get(tasktypeid).then(function(response){
                var taskType = response.data;
                var modalInstance = $uibModal.open({
                    templateUrl: '/assets/templates/GameMaslul/WatchTaskModal.html',
                    controller: 'WatchTaskModalController',
                    resolve: {
                        task: function () {
                            return (null);
                        },
                        readonly: function() {
                            return (null);
                        },
                        tasktype: function() {
                            return (taskType);
                        }, 
                        userid: function() {
                            return ($scope.user._id);
                        },
                        stage: function() {
                            return (stage);
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
        
        // Delete done task
        $scope.deleteTask = function (doneTask){
            alertify.confirm('מחיקת משימה', 
                             'האם אתה בטוח שברצונך למחוק את המשימה?', 
                             function(){ 

                                UsersService.deleteDoneTask($scope.user._id, doneTask._id,doneTask.points).then(function(response){
                                    $scope.refreshData();
                                    alertify.success("המשימה נמחקה בהצלחה");
                                 }, function(){
                                    alertify.error("שגיאה במחיקת המשימה");
                                });
                
                             }, function(){
                             });
        }
        
        $scope.progressBarType = function(value, max) {
            if (value >= max) {
                return ('success');
            }
            
            if (value <= max / 2) {
                return ('warning');
            }
            
            return ('info');
        }
    }
]);