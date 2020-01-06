gameMaslulApp.controller('WatchTaskModalController', [ '$uibModalInstance', 'task', 'tasktype', 'userid', 'stage', 'readonly', '$scope',
    function ($uibModalInstance, task, tasktype, userid, stage, readonly, $scope) {
        
        $scope.userid = userid;
        $scope.stage = stage;

        if (task) {
            $scope.readonly = readonly;
            $scope.currTask = angular.copy(task);
            $scope.currTask.date.$date = new Date($scope.currTask.date.$date);
            
            if (readonly){
                $scope.title = 'צפייה במשימה';
            }
            else{
                $scope.title = 'עריכת משימה';
            }
        } else {
            $scope.readonly = false;
            $scope.title = 'משימה חדשה';
            $scope.userid = userid;
            $scope.currTask = {
                tasktypeid: tasktype._id,
                name: tasktype.name,
                description: tasktype.description,
                type: tasktype.type,
                imageName: tasktype.imageName,
                points: tasktype.points,
                approval: false,
                attachedFilesRequired: tasktype.attachedFilesRequired,
                stage: stage,
                date: new Date(),
                attachedFiles: [],
                ratingsFields: tasktype.ratingsFields,
                openFields: tasktype.openFields
            };
        }
            
        $scope.save = function () {
            if (($scope.currTask.attachedFilesRequired) &&
                ($scope.currTask.attachedFiles.length == 0)) {
                alertify.error("חובה לצרף קבצים למשימה זו");
            }
            else if (!$scope.taskForm.$valid) {
                alertify.error("יש לוודא שמילאת את כל השדות בצורה תקינה");
            }
            else {
                delete $scope.currTask.name;
                delete $scope.currTask.description;
                delete $scope.currTask.type;
                delete $scope.currTask.imageName;
                $uibModalInstance.close($scope.currTask);
            }
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss(null);
        };
        
        $scope.getFileResponse = function(response) {
            var fileName = response.data;
            $scope.currTask.attachedFiles.push(fileName);
        }; 
        
        $scope.deleteFile = function(index) {
            alertify.confirm('מחיקת קובץ', 
                             'האם אתה בטוח שברצונך למחוק את הקובץ?', 
                             function(){ 
                                $scope.$apply(function(){
                                    $scope.currTask.attachedFiles.splice(index, 1);
                                });
                             }, function(){
                             });
        }
    }
]);

