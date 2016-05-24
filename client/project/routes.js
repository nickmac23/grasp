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
      .state('lecture', {
        url: '/lecture',
        template: "<lecture-time></lecture-time>"
      })
      .state('dashboard', {
        url: '/dashboard',
        template: "<h1>Dash Board</h1>"
      })
      .state('student', {
        url: '/student',
        template: "<h1>student</h1>"
      })
  }
})();
