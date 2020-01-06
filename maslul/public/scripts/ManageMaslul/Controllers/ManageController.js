manageMaslulApp.controller('ManageController', ['$scope',
    function($scope) {
   
        $scope.$on("notAuthorized", function(){
            $scope.notAuthorized = true;
        });
        
        $scope.$on("dataReady", function(){
            $scope.dataReady = true;
        });
        
        ////////////////////////////////////////////////////////
        // Menu
        ///////////////////////////////////////////////////////
        
        $scope.currViewName = 'צפייה במדריך';
        
        $scope.updateViewName = function(viewName){
            $scope.currViewName = viewName;
        }
        
        $scope.menu = [
            {
                title: 'סטטוס ההדרכה',
                pages: [
                    {
                        name: 'צפייה במדריך',
                        url: '/GuideStatus'
                    },
                    {
                        name: 'צפייה בקבוצה',
                        url: '/GroupStatus'
                    },
                    {
                        name: 'משימות לאישור',
                        url: '/WaitingApprovalTasks'
                    },
                    {
                        name: 'פרסום הודעה',
                        url: '/PostMessage'
                    }
                ]
            },
            {
                title: 'ניהול תשתית',
                pages: [
                    {
                        name: 'משתמשים',
                        url: '/ManageUsers'
                    },
                    {
                        name: 'קבוצות',
                        url: '/ManageGroups'
                    },
                    {
                        name: 'שיוך לקבוצה',
                        url: '/AddToGroup'
                    },
                    {
                        name: 'שיוך למסלול',
                        url: '/AddToTrack'
                    },
                    {
                        name: 'סוגי מסלולים',
                        url: '/TracksTypes'
                    },
                    {
                        name: 'סוגי משימות',
                        url: '/TasksTypes'
                    }
                ]
            }
        ];
        
    }
]);