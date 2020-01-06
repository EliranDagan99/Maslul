var manageMaslulApp = angular.module('manageMaslulApp', ['ui.bootstrap', 'ngAnimate', 'ngSanitize', 'ngTouch', 'ngRoute', 'ngTable', 'angucomplete', 'ui.select'])
    .config(['$routeProvider', '$locationProvider',
        function($routeProvider, $locationProvider) {
            
            // Init the route provider
            $routeProvider
            .when('/', {
              templateUrl: '/assets/templates/ManageMaslul/GuideStatus.html',
              controller: 'GuideStatusController'
            })
            .when('/AddToGroup', {
              templateUrl: '/assets/templates/ManageMaslul/AddToGroup.html',
              controller: 'AddToGroupController'
            })
            .when('/AddToTrack', {
              templateUrl: '/assets/templates/ManageMaslul/AddToTrack.html',
              controller: 'AddToTrackController'
            })
            .when('/GroupStatus', {
              templateUrl: '/assets/templates/ManageMaslul/GroupStatus.html',
              controller: 'GroupStatusController'
            })
            .when('/GuideStatus', {
              templateUrl: '/assets/templates/ManageMaslul/GuideStatus.html',
              controller: 'GuideStatusController'
            })
            .when('/ManageGroups', {
              templateUrl: '/assets/templates/ManageMaslul/ManageGroups.html',
              controller: 'ManageGroupsController'
            })
            .when('/ManageUsers', {
              templateUrl: '/assets/templates/ManageMaslul/ManageUsers.html',
              controller: 'ManageUsersController'
            })
            .when('/PostMessage', {
              templateUrl: '/assets/templates/ManageMaslul/PostMessage.html',
              controller: 'PostMessageController'
            })
            .when('/TasksTypes', {
              templateUrl: '/assets/templates/ManageMaslul/TasksTypes.html',
              controller: 'TasksTypesController'
            })
            .when('/TracksTypes', {
              templateUrl: '/assets/templates/ManageMaslul/TracksTypes.html',
              controller: 'TracksTypesController'
            })
            .when('/WaitingApprovalTasks', {
              templateUrl: '/assets/templates/ManageMaslul/WaitingApprovalTasks.html',
              controller: 'WaitingApprovalTasksController'
            })
            .otherwise({redirectTo: '/'}); 
            
            // Set the location provider in html mode
            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });
            
            // Set the alertify config
            alertify.defaults.maximizable = false;
            alertify.defaults.resizable = false;
            alertify.defaults.glossary.title = 'הודעה';
            alertify.defaults.glossary.ok = 'אישור';
            alertify.defaults.glossary.cancel = 'ביטול';
            alertify.defaults.transition = "slide";
            alertify.defaults.theme.ok = "btn btn-primary";
            alertify.defaults.theme.cancel = "btn btn-danger";
            alertify.defaults.theme.input = "form-control";
        }
    ]);