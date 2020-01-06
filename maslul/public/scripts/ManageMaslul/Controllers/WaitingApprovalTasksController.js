manageMaslulApp.controller('WaitingApprovalTasksController', ['$scope', '$uibModal', 'UsersService', 'TasksTypesService', 'WaitingApprovalTasksService',
    function($scope, $uibModal, UsersService, TasksTypesService, WaitingApprovalTasksService) {
        
        // Refresh the page data
        var refreshData = function() {
            
            // Get the waiting approval tasks list
            WaitingApprovalTasksService.getAll().then(function(response){
                $scope.waitingApprovalTasks = response.data;
                
                angular.forEach($scope.waitingApprovalTasks, function(waitingApprovalTask, key) {
                    
                    // Find the user
                    var user = _.find($scope.users, function(user){ 
                        return (user._id == waitingApprovalTask.userid)
                    });
                    
                    // Find the task type
                    var taskType = _.find($scope.tasksTypes, function(taskType){ 
                        return (taskType._id.includes(waitingApprovalTask.tasktypeid))
                    });
                    
                    waitingApprovalTask.userName = user.firstName + " " + user.lastName;
                    waitingApprovalTask.taskTypeName = taskType.name;
                    waitingApprovalTask.date = new Date(waitingApprovalTask.date);
                });
                
            }, function(result){
                alertify.error("שגיאה בטעינת סוגי המשימות");
            });
        };
        
        
        // Get the basic users data
        UsersService.getAllBasicData().then(function(response){
            $scope.users = response.data;
            
            // Get the tasks types
            TasksTypesService.getAll().then(function(response){
                $scope.tasksTypes = response.data;
                
                // Get the waiting approval tasks
                refreshData();
                
            }, function(result){
                alertify.error("שגיאה בטעינת סוגי המשימות");
            });
        }, function(result){
            alertify.error("שגיאה בטעינת רשימת המשתמשים");
        });
        
        
        // Open the edit task modal
        $scope.openEditTaskModal = function (waitingApprovalTask, readonly) {
            
            UsersService.get(waitingApprovalTask.userid).then(function(response){
                var user = response.data;
                
                // Find the done task
                var donetask = _.find(user.doneTasks, function(currdonetask){ 
                    return (currdonetask._id.includes(waitingApprovalTask.donetaskid))
                });
                
                // Find the task type (for name and type)
                var taskType = _.find($scope.tasksTypes, function(taskType){ 
                    return (taskType._id.includes(waitingApprovalTask.tasktypeid))
                });
                
                donetask.name = taskType.name; 
                donetask.description = taskType.description;
                donetask.type = taskType.type; 
                
                var modalInstance = $uibModal.open({
                    templateUrl: '/assets/templates/ManageMaslul/WatchTaskModal.html',
                    controller: 'WatchTaskModalController',
                    resolve: {
                        task: function () {
                            return (donetask);
                        },
                        readonly: function() {
                            return (readonly);
                        },
                        tasktype: function() {
                            return (null);
                        }, 
                        userid: function() {
                            return (waitingApprovalTask.userid);
                        },
                        stage: function() {
                            return (null);
                        }
                    }
                });

                modalInstance.result.then(function (newTask) {
                    
                    delete newTask.name;
                    delete newTask.description;
                    delete newTask.type;
                    
                    UsersService.updateDoneTask(waitingApprovalTask.userid, newTask).then(function(response){
                        alertify.success("המשימה עודכנה בהצלחה");
                    }, function(result){
                        alertify.error("שגיאה בעדכון המשימה");
                    });
                    
                }, function (item) {

                }); 
                
            }, function(result){
                alertify.error("שגיאה בטעינת פרטי המשתמש");
            });
        };
        
        // Accept task
        $scope.acceptTask = function(task, index) {
            // Delete task from waiting approval tasks
            WaitingApprovalTasksService.remove(task._id).then(function(response){
                // Remove the task from current screen
                $scope.waitingApprovalTasks.splice(index, 1);

                // Approve the done task
                WaitingApprovalTasksService.approveDoneTask(task.userid, task.tasktypeid).then(function(response){
                    // Add the user profile the accept message
                    UsersService.addNewMessage(task.userid, "המשימה: ''" + task.taskTypeName + "'' אושרה ע''י הצפ''ה ").then(function(response){
                        // Print a success message
                        alertify.success("המשימה אושרה בהצלחה!");
                    }, function(result){
                        alertify.error("חלה שגיאה בתהליך אישור המשימה");
                    });
                }, function(result){
                        alertify.error("חלה שגיאה בתהליך אישור המשימה");
                });
            }, function(result){
                alertify.error("חלה שגיאה בתהליך אישור המשימה");
            });
        };
        
        // Reject task
        $scope.rejectTask = function(task, index) {
            // Ask for reject reason
            alertify.prompt('דחיית משימה', 
                'שים לב! דחייה תגרור את מחיקת המשימה <br><br> הזן את הסיבה לדחיית המשימה:',
                '',
                function(evt, rejectReasone) { 
                    // Delete task from waiting approval tasks
                    WaitingApprovalTasksService.remove(task._id).then(function(response){
                        // Remove the task from current screen
                        $scope.waitingApprovalTasks.splice(index, 1);
                        
                            // Add the user profile the reject message
                            UsersService.addNewMessage(task.userid, 
                                                       "המשימה: ''" + 
                                                       task.taskTypeName +
                                                       "'' נדחתה ע''י הצפ''ה מהסיבה הבאה: " +
                                                       rejectReasone).then(function(response){

                                // Print a success message
                                alertify.success("המשימה נדחתה בהצלחה!");
                            }, function(result){
                                alertify.error("חלה שגיאה בתהליך דחית המשימה");
                            });
                            
                    }, function(result){
                        alertify.error("חלה שגיאה בתהליך דחית המשימה");
                    });
                 }, function(){
                });
        };
    }
]);