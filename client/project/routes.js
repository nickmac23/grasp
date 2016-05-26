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
        url: '/lecture/:id',
        template: "<lecture-student></lecture-student>",
        resolve: {
          user: getMe
        }
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
      .state('classInfo', {
        url: '/:classId/info',
        templateUrl: "partials/dashboard.info.html",
        loggedInOnly: true,
        parent: 'dashboard',
        resolve: {
          user: getMe
        }
      })
      // .state('dashboard.teaching', {
      //   url: '/teaching',
      //   templateUrl: "partials/dashboard.teaching.html",
      //   loggedInOnly: true,
      //   parent: 'dashboard',
      //   resolve: {
      //     user: getMe
      //   }
      // })

      // .state('dashboard.attending', {
      //   url: '/attending',
      //   templateUrl: "partials/dashboard.attending.html",
      //   loggedInOnly: true,
      //   parent: 'dashboard',
      //   resolve: {
      //     user: getMe
      //   }
      // })

  }

  getMe.$inject = ['authService'];
  function getMe(authService) {
    return authService.me();
  }

})();
