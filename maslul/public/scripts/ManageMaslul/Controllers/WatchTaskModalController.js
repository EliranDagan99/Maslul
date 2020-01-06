manageMaslulApp.controller('WatchTaskModalController', [ '$uibModalInstance', 'task', 'tasktype', 'userid', 'stage', 'readonly', '$scope', 'UsersService','TracksTypesService',
    function ($uibModalInstance, task, tasktype, userid, stage, readonly, $scope, UsersService,TracksTypesService) {

        $scope.userid = userid;
        $scope.stage = stage;
        
        UsersService.getStagesNames(userid).then(function(response){
            $scope.stagesNames = response.data;
            
            if (task) {
                $scope.readonly = readonly;
                $scope.currTask = angular.copy(task);
                $scope.currTask.date.$date = new Date($scope.currTask.date.$date);
            } else {
                $scope.readonly = false;
                $scope.userid = userid;
                
                if (stage == null) {
                    stage = $scope.stagesNames.length - 1;
                }
                
                $scope.currTask = {
                    tasktypeid: tasktype._id,
                    name: tasktype.name,
                    description: tasktype.description,
                    type: tasktype.type,
                    approval: false,
                    attachedFilesRequired: tasktype.attachedFilesRequired,
                    stage: stage,
                    date: {$date: new Date()},
                    attachedFiles: [],
                    ratingsFields: tasktype.ratingsFields,
                    openFields: tasktype.openFields
                };
            }
            
        }, function(result){
            alertify.error("שגיאה בטעינת שמות השלבים");
        });

        $scope.save = function () {
            if (($scope.currTask.attachedFilesRequired) &&
                ($scope.currTask.attachedFiles.length == 0)) {
                alertify.error("חובה לצרף קבצים למשימה זו");
            }
            else if (!$scope.taskForm.$valid) {
                alertify.error("יש לוודא שמילאת את כל השדות בצורה תקינה");
            }
            else {
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

