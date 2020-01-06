var gameMaslulApp = angular.module('gameMaslulApp', ['ui.bootstrap', 'ngAnimate', 'ngSanitize', 'ngTouch', 'ngRoute'])
    .config(['$routeProvider', '$locationProvider',
        function($routeProvider, $locationProvider) {
            
            // Init the route provider
            $routeProvider
            .when('/', {
              templateUrl: '/assets/templates/GameMaslul/Profile.html',
              controller: 'ProfileController'
            })
            .when('/PointsTable', {
              templateUrl: '/assets/templates/GameMaslul/PointsTable.html',
              controller: 'PointsTableController'
            })
            .when('/Tasks', {
              templateUrl: '/assets/templates/GameMaslul/Tasks.html',
              controller: 'TasksController'
            })
            .when('/Profile', {
              templateUrl: '/assets/templates/GameMaslul/Profile.html',
              controller: 'ProfileController'
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