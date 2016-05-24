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
    // $locationProvider.html5Mode(true);
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
      .state('dashboard', {
        url: '/dashboard',
        template: "<h1>Dash Board</h1>"
      })
  }
})();
