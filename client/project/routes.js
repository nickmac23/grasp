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

  function setupRoutes($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $httpProvider.interceptors.push("AuthInterceptorService");
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise("/");

    $stateProvider
      .state('landing', {
        url: '/',
        template: "<landing-directive></landing-directive>",
        loggedOutOnly: true
      })
      .state('student', {
        url: '/lecture',
        template: "<lecture-student></lecture-student>"
      })
      .state('teacher', {
        url: '/teacher',
        template: "<lecture-teacher></lecture-teacher>",
        loggedInOnly: true
      })
      .state('dashboard', {
        url: '/dashboard',
        template: "<dashboard></dashboard>",
        loggedInOnly: true,
        resolve: {
          user: getMe
        }
      })
      .state('dashboard.classes', {
        url: '/classes',
        templateUrl: "partials/dashboard.classes.html",
        loggedInOnly: true,
      })
      .state('dashboard.lectures', {
        url: '/lectures',
        templateUrl: "partials/dashboard.lectures.html",
        loggedInOnly: true
      })
  }

  getMe.$inject = ['authService'];
  function getMe(authService) {
    console.log('in get me fn');
    return authService.me();
  }

})();
