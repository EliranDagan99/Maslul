manageMaslulApp.controller('ManageGroupsController', ['$scope', 'UsersService', 'GroupsService', 
    function($scope, UsersService, GroupsService) {
        
        // Refresh the page data
        var refreshData = function() {
            // Get the groups options
            GroupsService.getAll().then(function(response){
                $scope.groups = response.data;
            }, function(result){
                alertify.error("שגיאה בטעינת הקבוצות");
            });
        };
        
        refreshData();
        
        // Create new group
        $scope.createNew = function(){
            alertify.prompt('הוספת קבוצה חדשה', 
                            'הזן את שם הקבוצה',
                            '',
                            function(evt, groupName) { 
                                GroupsService.create(groupName).then(function(response){
                                    refreshData();  
                                    alertify.success('הקבוצה נוספה בהצלחה');
                                }, function(result){
                                    alertify.error('שגיאה בהוספת הקבוצה. יתכן שהקבוצה כבר קיימת.');
                                }); 
                            }, function(){
                            });
        };
        
        $scope.delete = function(groupName){
            alertify.confirm('מחיקת קבוצה', 
                             'האם אתה בטוח שברצונך למחוק את הקבוצה?', 
                             function(){ 
                                GroupsService.remove(groupName).then(function(response){
                                    refreshData();  
                                    alertify.success('הקבוצה נמחקה בהצלחה')
                                }, function(result){
                                    alertify.error('שגיאה במחיקת הקבוצה. יתכן שלקבוצה מקושרים משתמשים, יש להעבירם לקבוצה אחרת לפני המחיקה.') 
                                }); 
                             }, function(){
                             });
        };
    }
]);