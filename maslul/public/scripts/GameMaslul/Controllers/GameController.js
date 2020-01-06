gameMaslulApp.controller('GameController', ['$scope', '$rootScope', 'UsersService', 'TasksTypesService',
    function ($scope, $rootScope, UsersService, TasksTypesService) {

        // Define event - on data ready
        $scope.$on("dataReady", function () {
            $scope.dataReady = true;
        });

        $scope.bShowMessages = false;
        $scope.text = "טוען"
        $scope.loading = true;

        // Get the basic user data
        $scope.refreshData = function () {
            UsersService.getMe().then(function (response) {
                $scope.dataReady = false;
                $scope.user = response.data;

                if ($scope.user.group == undefined ||
                    $scope.user.stages == undefined) {
                    $scope.text = 'יש בעיה';
                    $scope.subText = 'דבר עם הצפ"ה, נסדר את זה. סביר שאתה צעיר ולא הוגדר לך מסלול'
                    $scope.loading = false;
                } else {
                    // Add the task type more details to the done tasks
                    angular.forEach($scope.user.doneTasks, function (doneTask, key) {
                        var taskType = _.find($scope.tasksTypes, function (type) {
                            return (type._id.includes(doneTask.tasktypeid))
                        });

                        doneTask.name = taskType.name;
                        doneTask.description = taskType.description;
                        doneTask.type = taskType.type;
                        doneTask.points = taskType.points;
                        doneTask.imageName = taskType.imageName;
                    });

                    // Build the stages status
                    angular.forEach($scope.user.stages, function (stage, keyStage) {
                        angular.forEach(stage.tasks, function (stageTask, keyTask) {
                            // Add the basic data
                            var taskType = _.find($scope.tasksTypes, function (type) {
                                return (type._id.includes(stageTask.tasktypeid));
                            });

                            stageTask.name = taskType.name;
                            stageTask.description = taskType.description;
                            stageTask.type = taskType.type;
                            stageTask.points = taskType.points;
                            stageTask.imageName = taskType.imageName;

                            // Add the done tasks to type in stage
                            var doneTasks = _.filter($scope.user.doneTasks, function (doneTask) {
                                return ((doneTask.tasktypeid.includes(stageTask.tasktypeid)) && (doneTask.stage == keyStage));
                            });

                            stageTask.doneAmount = doneTasks.length;
                            stageTask.sortRate = (stageTask.minimumAmount - stageTask.doneAmount) * stageTask.points;
                            stageTask.need = stageTask.minimumAmount - stageTask.doneAmount;

                            if (stageTask.doneAmount !== stageTask.minimumAmount) {

                                stageTask.showLeftTime = true;
                                stageTask.dateMessage = (stageTask.dueDate ? new Date(stageTask.dueDate).toLocaleDateString() : "אין דדליין");

                                stageTask.maxDays = (stageTask.assignedDay ? calcDaysBetween(new Date(stageTask.dueDate).getTime(), new Date(stageTask.assignedDay).getTime()) : 0);

                                stageTask.daysLeft = calcDaysBetween(new Date(stageTask.dueDate).getTime(), new Date().getTime());

                            } else {
                                stageTask.showLeftTime = false;
                                stageTask.dateMessage = "תותח! סיימת"
                            }


                            stageTask.doneTasks = doneTasks;
                        });
                    });

                    // Build the last stage details
                    $scope.lastStage = _.last($scope.user.stages);
                    $scope.lastStage.doneAmount = 0;
                    $scope.lastStage.requiredAmount = 0;

                    angular.forEach($scope.lastStage.tasks, function (stageTask, keyTask) {
                        if (stageTask.required) {
                            $scope.lastStage.doneAmount += Math.min(stageTask.doneAmount, stageTask.minimumAmount);
                            $scope.lastStage.requiredAmount += stageTask.minimumAmount;
                        }
                    });

                    // Get the group points
                    UsersService.getGroupPoints($scope.user.group).then(function (response) {
                        $scope.pointsTable = response.data;
                        $scope.rateInGroup = _.findIndex($scope.pointsTable, function (userPoints) {
                            return (userPoints._id == $scope.user._id);
                        }) + 1;
                    }, function (result) {
                        alertify.error("שגיאה בטעינת טבלת המובילים");
                    });

                    $rootScope.$broadcast("dataReady");
                }
            }, function (result) {
                alertify.error("שגיאה בטעינת המשתמש");
            });
        };

        // Get the tasks types
        TasksTypesService.getAll().then(function (response) {
            $scope.tasksTypes = response.data;
            $scope.refreshData();
        }, function (result) {
            $scope.text = 'יש בעיה';
            $scope.subText = 'דבר עם הצפ"ה, נסדר את זה. סביר שאתה צעיר ולא הוגדר לך מסלול'
            $scope.loading = false;
        });

        TasksTypesService.getAllBonusTasks().then(function (response) {
            $scope.bonusTasks = response.data;
            $scope.refreshData();
        }, function (result) {
            $scope.text = 'יש בעיה';
            $scope.subText = 'דבר עם הצפ"ה, נסדר את זה. סביר שאתה צעיר ולא הוגדר לך מסלול'
            $scope.loading = false;
        });

        $scope.deleteMessages = function () {
            UsersService.deleteMessages().then(function (response) {
                alertify.success("ההודעות נמחקו בהצלחה");
                $scope.refreshData();
            }, function (result) {
                alertify.error("שגיאה במחיקת ההודעות");
            });
        }

        const calcDaysBetween = function (firstDate, secondDate) {
            const miliseconds = (24 * 60 * 60 * 1000)
            return Math.floor((firstDate - secondDate) / miliseconds);
        }

        $scope.mainProgressBarType = function (value, max) {
            if (value >= max) {
                return ('success');
            }

            return ('info');
        }

        $scope.updateView = function (viewName) {
            $scope.currView = viewName;
        }

    }
]);