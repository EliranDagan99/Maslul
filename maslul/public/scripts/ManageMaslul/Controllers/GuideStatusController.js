manageMaslulApp.controller('GuideStatusController', ['$scope', '$rootScope', '$uibModal', 'UsersService', 'TasksTypesService',
    function ($scope, $rootScope, $uibModal, UsersService, TasksTypesService) {

        // Init vars
        $scope.viewState = "stageStatusNoType";
        $scope.types = ["הדרכתי", "פיקודי", "מקצועי"];
        $scope.addDueDate;
        $scope.selectedUserDate;
        let availbaleStages;

        // Get the basic users data
        UsersService.getAllBasicData().then(function (response) {

            $scope.users = response.data;

            // Add display name for search
            angular.forEach($scope.users, function (user, key) {
                user.displayName = user.firstName + " " + user.lastName + " (" + user._id + ")";
            });

            $rootScope.$broadcast("dataReady");

        }, function (result) {
            alertify.error("שגיאה בטעינת רשימת המשתמשים");
            $rootScope.$broadcast("notAuthorized");
        });


        // Get the tasks types
        TasksTypesService.getAll().then(function (response) {
            $scope.tasksTypes = response.data;
        }, function (result) {
            alertify.error("שגיאה בטעינת סוגי המשימות");
        });


        var refreshUserData = function (selectedUser) {
            if (selectedUser) {
                UsersService.get(selectedUser.originalObject._id).then(function (response) {
                    // Get the user data
                    $scope.selectedUserData = response.data;
                    $scope.activeTab = $scope.selectedUserData.stages.length;

                    // Add the task type more details to the done tasks
                    angular.forEach($scope.selectedUserData.doneTasks, function (doneTask, key) {
                        var taskType = _.find($scope.tasksTypes, function (type) {
                            return (type._id.includes(doneTask.tasktypeid))
                        });

                        doneTask.name = taskType.name;
                        doneTask.description = taskType.description;
                        doneTask.type = taskType.type;
                    });

                    // Build the stages status
                    angular.forEach($scope.selectedUserData.stages, function (stage, keyStage) {
                        angular.forEach(stage.tasks, function (stageTask, keyTask) {
                            // Add the basic data
                            var taskType = _.find($scope.tasksTypes, function (type) {
                                return (type._id.includes(stageTask.tasktypeid));
                            });

                            stageTask.name = taskType.name;
                            stageTask.description = taskType.description;
                            stageTask.type = taskType.type;
                            stageTask.points = taskType.points;

                            stageTask.finalDate = (stageTask.dueDate ? new Date(stageTask.dueDate).toLocaleDateString() : "לא הוגדר דד ליין עדיין")

                            stageTask.maxDays = (stageTask.assignedDay ? calcDaysBetween(new Date(stageTask.dueDate).getTime(), new Date(stageTask.assignedDay).getTime()) : 0);

                            stageTask.daysPassed = (stageTask.dueDate && stageTask.assignedDay ? calcDaysBetween(new Date().getTime(), new Date(stageTask.assignedDay).getTime()) : 0);

                            // Add the done tasks to type in stage
                            var doneTasks = _.filter($scope.selectedUserData.doneTasks, function (doneTask) {
                                return ((doneTask.tasktypeid.includes(stageTask.tasktypeid)) && (doneTask.stage == keyStage));
                            });

                            stageTask.doneAmount = doneTasks.length;
                            stageTask.doneTasks = doneTasks;
                        });
                    });


                    // Initlize grade variable
                    Grades = {
                        taskName: [],
                        profession: [],
                        guiding: [],
                        preperation: [],
                        comanding: []
                    }

                    filterGrades();

                }, function (result) {
                    alertify.error("שגיאה בטעינת פרטי המשתמש");
                });
            }
        };



        // When choose a user - get his data
        $scope.$watch('selectedUser', function (selectedUser) {
            refreshUserData(selectedUser);
        });

        // Open the edit task modal
        $scope.openEditTaskModal = function (task, readonly) {
            var modalInstance = $uibModal.open({
                templateUrl: '/assets/templates/ManageMaslul/WatchTaskModal.html',
                controller: 'WatchTaskModalController',
                resolve: {
                    task: function () {
                        return (task);
                    },
                    readonly: function () {
                        return (readonly);
                    },
                    tasktype: function () {
                        return (null);
                    },
                    userid: function () {
                        return ($scope.selectedUserData._id);
                    },
                    stage: function () {
                        return (null);
                    }
                }
            });

            modalInstance.result.then(function (newTask) {

                delete newTask.name;
                delete newTask.description;
                delete newTask.type;
                delete newTask.points;

                UsersService.updateDoneTask($scope.selectedUserData._id, newTask).then(function (response) {
                    alertify.success("המשימה עודכנה בהצלחה");
                    refreshUserData($scope.selectedUser);
                }, function (result) {
                    alertify.error("שגיאה בעדכון המשימה");
                });

            }, function (item) {

            });
        };



        // Open the new task modal
        $scope.openNewTaskModal = function (tasktypeid, stage) {

            TasksTypesService.get(tasktypeid).then(function (response) {
                var taskType = response.data;
                var modalInstance = $uibModal.open({
                    templateUrl: '/assets/templates/ManageMaslul/WatchTaskModal.html',
                    controller: 'WatchTaskModalController',
                    resolve: {
                        task: function () {
                            return (null);
                        },
                        readonly: function () {
                            return (null);
                        },
                        tasktype: function () {
                            return (taskType);
                        },
                        userid: function () {
                            return ($scope.selectedUserData._id);
                        },
                        stage: function () {
                            return (stage);
                        }
                    }
                });

                modalInstance.result.then(function (newTask) {
                    delete newTask.name;
                    delete newTask.description;
                    delete newTask.type;

                    UsersService.insertDoneTask($scope.selectedUserData._id, newTask).then(function (response) {
                        alertify.success("המשימה נוספה בהצלחה");
                        refreshUserData($scope.selectedUser);
                    }, function (result) {
                        alertify.error("שגיאה בהוספת המשימה");
                    });

                }, function (item) {

                });

            }, function (result) {

            });
        };

        // Check if the user ends all the tasks of the last stage
        $scope.isReadyForNextStage = function () {

            var bIsReady = true;

            var lastStage = $scope.selectedUserData.stages[$scope.selectedUserData.stages.length - 1];

            angular.forEach(lastStage.tasks, function (stageTask, keyTask) {

                if (stageTask.required) {
                    if (stageTask.doneTasks.length < stageTask.minimumAmount) {
                        bIsReady = false;
                    } else {
                        angular.forEach(stageTask.doneTasks, function (doneTask, keyTask) {
                            if (!doneTask.approval) {
                                bIsReady = false;
                            }
                        });
                    }
                }
            });

            if (bIsReady) {
                $scope.openSetNextStageModal();
            } else {
                alertify.confirm(
                    'אזהרה',
                    'המדריך עדיין לא סיים את כל משימותיו המחייבות בשלב הקודם או שקיימות משימות מחייבות שעדיין לא אושרו. קידום לשלב הבא מבלי שסיים את כל משימותיו הוא חריג! האם אתה בטוח שברצונך לקדם אותו לשלב הבא?',
                    function () {
                        $scope.openSetNextStageModal();
                    },
                    function () {});
            }
        }

        // Open the set next stage modal
        $scope.openSetNextStageModal = function () {
            var modalInstance = $uibModal.open({
                templateUrl: '/assets/templates/ManageMaslul/SetNextStageModal.html',
                controller: 'SetNextStageModalController',
                resolve: {
                    currStage: function () {
                        var currStage = _.last($scope.selectedUserData.stages);

                        if (currStage) {
                            return (currStage.name);
                        }

                        return (null);
                    },
                    trackid: function () {
                        return ($scope.selectedUserData.track);
                    }
                }
            });

            modalInstance.result.then(function (nextStage) {
                // Set the choosen next stage
                if (nextStage) {
                    UsersService.insertNextStage($scope.selectedUserData._id,
                        $scope.selectedUserData.track,
                        nextStage).then(function (resposne) {
                        // Add to the user profile message
                        UsersService.addNewMessage($scope.selectedUserData._id,
                            "כל הכבוד! הצפ''ה קידם אותך לשלב הבא במסלול! עברת לשלב " + nextStage).then(function (response) {
                            alertify.success("המדריך הוכנס בהצלחה לשלב " + nextStage);
                            refreshUserData($scope.selectedUser);
                        }, function (result) {
                            alertify.error("שגיאה בהכנסת המדריך לשלב הבא");
                        });
                    }, function (result) {
                        alertify.error("שגיאה בהכנסת המדריך לשלב הבא");
                    });
                }
            }, function (item) {

            });
        };

        // Delete done task
        $scope.deleteTask = function (doneTask) {
            alertify.confirm('מחיקת משימה',
                'האם אתה בטוח שברצונך למחוק את המשימה?',
                function () {

                    UsersService.deleteDoneTask($scope.selectedUserData._id, doneTask._id).then(function (response) {
                        refreshUserData($scope.selectedUser);
                        alertify.success("המשימה נמחקה בהצלחה");
                    }, function () {
                        alertify.error("שגיאה במחיקת המשימה");
                    });

                },
                function () {});
        }



        // Open the add task type modal
        $scope.openChooseTaskTypeModal = function () {
            var modalInstance = $uibModal.open({
                templateUrl: '/assets/templates/ManageMaslul/ChooseTaskTypeModal.html',
                controller: 'ChooseTaskTypeModalController'
            });

            modalInstance.result.then(function (newTaskType) {
                if (newTaskType) {
                    $scope.openNewTaskModal(newTaskType._id);
                }
            }, function (item) {

            });
        };



        $scope.progressBarType = function (value, max) {
            if (value >= max) {
                return ('success');
            }

            if (value <= max / 2) {
                return ('warning');
            }

            return ('info');
        }

        // Statistics

        $scope.showStatistics = false;
        $scope.ButtonMsg = "ציר התפתחות"
        $scope.ShowStatistics = function () {

            if ($scope.showStatistics) {
                $scope.showStatistics = false;
                $scope.ButtonMsg = "ציר התפתחות"
                hideHightCharts();

            } else {
                $scope.showStatistics = true;
                $scope.ButtonMsg = "תפטר את המדריך"
                showHighCharts()
            }
        }

        let GuideStatistics = [];
        let guidChart = null;

        let Grades = {
            testName: [],
            profession: [],
            guiding: [],
            preperation: [],
            comanding: []
        }

        const hideHightCharts = function () {
            $('#chart-container').hide();
        }

        const showHighCharts = function () {
            $('#chart-container').show();
        }

        hideHightCharts();


        function filterGrades() {
            UsersService.getDoneTasks($scope.selectedUser.originalObject._id).then((response) => {
                fillGradeData($scope.selectedUserData.doneTasks, response.data[0].doneTasks);
            })
        }

        function fillGradeData(allTasks, doneTasks) {
            doneTasks.forEach((doneTask) => {
                let taskInfo = allTasks.filter((task) => task._id.includes(doneTask._id))[0];

                if (taskInfo.name.includes("משוב") && doneTask.ratingsFields.length === 4) {
                    Grades.taskName.push(taskInfo.name + " - " + new Date(doneTask.date).toLocaleDateString());
                    Grades.profession.push(doneTask.ratingsFields.filter(rate => rate.name === "מקצועיות")[0].value);
                    Grades.guiding.push(doneTask.ratingsFields.filter(rate => rate.name === "הדרכתיות")[0].value);
                    Grades.preperation.push(doneTask.ratingsFields.filter(rate => rate.name === "הכנות לקראת השיעור")[0].value);
                    Grades.comanding.push(doneTask.ratingsFields.filter(rate => rate.name === "פיקודיות")[0].value);
                }
            });
            initilizeChart(Grades);
        }

        function initilizeChart(Grades) {
            var chart = new Highcharts.Chart({
                chart: {
                    renderTo: 'chart-container',
                    type: 'column'
                },
                title: {
                    text: 'משובים לאורך זמן',
                    useHTML: Highcharts.hasBidiBug
                },
                xAxis: {
                    categories: Grades.taskName,
                },
                yAxis: {
                    min: 0,
                    max: 7,
                    title: {
                        text: 'כמה המדריך קיבל',
                        useHTML: Highcharts.hasBidiBug
                    },
                },
                legend: {
                    shadow: true,
                    useHTML: true
                },
                tooltip: {
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                series: [{
                    name: 'הכנות לקראת השיעור',
                    data: Grades.preperation
                }, {
                    name: 'מקצועיות',
                    data: Grades.profession
                }, {
                    name: 'הדרכתיות',
                    data: Grades.guiding
                }, {
                    name: 'פיקודיות',
                    data: Grades.comanding
                }]
            });
        }

        const calcDaysBetween = function (firstDate, secondDate) {
            return Math.round(Math.abs((firstDate - secondDate) / (24 * 60 * 60 * 1000)) * 24);
        }

        $scope.addDueDate = function (dueDate, selectedTask) {

            const wantedTasks = {
                tasktypeid: selectedTask.tasktypeid,
                required: selectedTask.required,
                minimumAmount: selectedTask.minimumAmount,
                dueDate: new Date(dueDate),
                assignedDay: new Date()
            };

            UsersService.addDueDate($scope.selectedUserData._id, wantedTasks, $scope.activeTab - 1).then(function (response) {
                alertify.success("המשימה עודכנה בהצלחה");
                refreshUserData($scope.selectedUser);
            }, function (result) {
                alertify.error("שגיאה בעדכון המשימה");
            });;
        }

    }
]);