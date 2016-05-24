(function() {
  'use strict'

  angular.module('panic')
  .config(setupRoutes)
  setupRoutes.$inject = [
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    '$httpProvider',
  ];

  function setupRoutes($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider)  {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise("/");

    $stateProvider
      .state('landing', {
        url: '/',
        template: "<landing-directive></landing-directive>"
      })
      .state('student', {
        url: '/lecture',
        template: "<lecture-student></lecture-student>"
      })
      .state('teacher', {
        url: '/teacher',
        template: "<lecture-teacher></lecture-teacher>"
      })
      .state('dashboard', {
        url: '/dashboard',
        template: "<dashboard></dashboard>"
      })
      .state('dashboard.classes', {
        url: '/classes',
        templateUrl: "partials/dashboard.classes.html"
      })
      .state('dashboard.lectures', {
        url: '/lectures',
        templateUrl: "partials/dashboard.lectures.html"
      })
  }
})();
