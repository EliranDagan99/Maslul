manageMaslulApp.controller('TasksTypesController', ['$scope', 'TasksTypesService', 'TracksTypesService',
    function ($scope, TasksTypesService, TracksTypesService) {

        $scope.selectedTaskDelete;

        // Refresh the page data
        var refreshData = function () {

            // Init vars
            $scope.newTaskTypeData = {
                ratingsFields: [],
                openFields: [],
                approvalRequired: false,
                attachedFilesRequired: false,
                points: 0
            };

            // Get the tasks types options
            TasksTypesService.getAll().then(function (response) {
                $scope.tasksTypes = response.data;
                sliceTasks();
            }, function (result) {
                alertify.error("שגיאה בטעינת סוגי המשימות");
            });
        };

        refreshData();

        const refrashTask = function (selectedTaskType) {
            if (selectedTaskType) {
                TasksTypesService.get(selectedTaskType.originalObject._id).then(function (response) {
                    $scope.selectedTaskTypeData = response.data;
                }, function (result) {
                    alertify.error("שגיאה בטעינת סוג משימה נבחר");
                });

                TracksTypesService.getTracksTypesNamesOfTaskType(selectedTaskType.originalObject._id).then(function (response) {
                    $scope.tracksTypesNamesOfTaskType = response.data;
                }, function (result) {
                    alertify.error("שגיאה בטעינת מסלולים שמקושרים לסוג משימה");
                });
            }
        }


        // Get task type more details
        $scope.$watch('selectedTaskType', function (selectedTaskType) {
            refrashTask(selectedTaskType);
        }, true);

        $scope.deleteTask = function (selectedTaskDelete) {
            TasksTypesService.delete(selectedTaskDelete.originalObject._id).then(function (response) {
                alertify.success("המשימה נמחקה בהצלחה");
                refreshData();
            }, function (result) {
                alertify.error("שגיאה במחיקת המשימה");
            });;
        }

        // Update user
        $scope.updateTaskType = function (taskType) {
            TasksTypesService.update(taskType).then(function (response) {
                alertify.success("סוג משימה עודכן בהצלחה");
                refreshData();
            }, function (result) {
                alertify.error("שגיאה בעדכון סוג משימה");
            });
        }

        // Create task type
        $scope.createTaskType = function (taskType) {
            TasksTypesService.create(taskType).then(function (response) {
                alertify.success("סוג משימה נוצר בהצלחה");
                refreshData();
            }, function (result) {
                alertify.error("שגיאה ביצירת סוג משימה");
            });
        }

        function sliceTasks() {
            $scope.slicedTasks = [];
            for (let i = 0; i <= $scope.tasksTypes.length - 3; i += 3) {
                $scope.slicedTasks.push($scope.tasksTypes.slice(i, i + 3));
            }
        }

        $scope.selectTask = function (selectedTask) {
            $scope.selectedTaskType = selectedTask;
        }

        $scope.getImageResponseNew = function (response) {
            var imageName = response.data;
            $scope.newTaskTypeData.imageName = imageName;
        };

        $scope.getImageResponseSelected = function (response) {
            var imageName = response.data;
            $scope.selectedTaskTypeData.imageName = imageName;
        };
    }
]);