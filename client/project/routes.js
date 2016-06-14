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
        url: '/lectures/:lectureId/students',
        template: "<lecture-student></lecture-student>",
        resolve: {
          user: getMe
        }
      })
      .state('teacher', {
        url: '/lectures/:lectureId/instructor',
        template: "<lecture-teacher></lecture-teacher>",
        loggedInOnly: true,
      })
      .state('app', {
        abstract: true,
        template: "<dashboard></dashboard>"
      })
      .state('dashboard', {
        url: '/dashboard',
        parent: 'app',
        templateUrl: "partials/dashboard.main.html",
        loggedInOnly: true,
        resolve: {
          user: getMe
        }
      })
      .state('teaching', {
        url: '/dashboard/teaching',
        templateUrl: "partials/dashboard.teaching.html",
        loggedInOnly: true,
        parent: 'app',
        resolve: {
          user: getMe
        }
      })
      .state('attending', {
        url: '/dashboard/attending',
        templateUrl: "partials/dashboard.attending.html",
        loggedInOnly: true,
        parent: 'app',
        resolve: {
          user: getMe
        }
      })
      .state('teachingLectures', {
        url: '/:classId',
        templateUrl: "partials/dashboard.teaching.info.html",
        loggedInOnly: true,
        parent: 'teaching',
        resolve: {
          user: getMe
        }
      })
      .state('attendingLectures', {
        url: '/:classId',
        templateUrl: "partials/dashboard.attending.info.html",
        loggedInOnly: true,
        parent: 'attending',
        resolve: {
          user: getMe
        }
      })
  }

  getMe.$inject = ['authService'];
  function getMe(authService) {
    return authService.me();
  }

})();
