gameMaslulApp.directive('fileUpload', ['$parse', '$http', function ($parse, $http) {
    return {
       restrict: 'A',
       scope: {
            getResponse: '&',
            action: '@',
            userid: '='
       },
       link: function(scope, element, attrs) {

          element.bind('change', function(){
             scope.$apply(function(){
               var fd = new FormData();
               fd.append('file', element[0].files[0]);
               fd.append('userid', scope.userid);

               $http({
                    method: 'POST',
                    url: scope.action,
                    data: fd,
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
               }).then(function(response){
                   scope.getResponse({response: response});
                   alertify.success("הקובץ הועלה בהצלחה");
               }, function(){
                   alertify.error("שגיאה. העלאת הקובץ נכשלה.");
               });
             });
          });
       }
    };
}]);