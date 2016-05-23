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
        template: "<h1>Landing</h1>"
      })
  }
})();
