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

  console.log('routes');

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
        url: '/teacher/:id',
        template: "<lecture-teacher></lecture-teacher>",
        // loggedInOnly: true
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

<<<<<<< HEAD

  // getMe.$inject = ['authService'];
  // function getMe(authService) {
  //   console.log('in get me fn');
  //   return authService.me();
  // }
=======
  getMe.$inject = ['authService'];
  function getMe(authService) {
    return authService.me();
  }
>>>>>>> 77c18c50580a6592069a05476ade2bac32faceca

})();
