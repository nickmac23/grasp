
(function() {
  'use strict'

  var dependencies = [
    'ui.router',
    'googlechart',
    'ngAnimate',
    'ngMessages',
    'angularMoment',
    'duScroll'
  ]

  angular.module('panic', dependencies)
  .constant({'API_URL': resolveApiUrl() + '/api/v1'})
  .run(routeEvent)

  resolveApiUrl.$inject = ['$http']

  function resolveApiUrl($http){
    if(window.location.origin === "http://localhost:5000") return 'http://localhost:3000';
    return 'https://grasp-app.herokuapp.com'
  }

  routeEvent.$inject = ['$rootScope', '$state', '$window', 'authService'];

  function routeEvent($rootScope, $state, $window, authService){
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
      if(!$window.localStorage.getItem('token') && toState.loggedInOnly){
        event.preventDefault();
        $state.go('landing');
      }
      if($window.localStorage.getItem('token') && toState.loggedOutOnly){
        event.preventDefault();
        $state.go('dashboard');
      }
      //TODO: create a http call to check if the person going to this page is the instructor
      // if($window.localStorage.getItem('token') && toState.instructorOnly){
        // authService.verifyInstructor($window.localStorage.getItem('email'), $window.localStorage.getItem('token')).then(function(result){
        //   if (result === true) {
        //     $state.go('teaching');
        //   } else {
        //     event.preventDefault();
        //     $state.go('dashboard');
        //   }
        // })
        //  console.log('interceptor- instructorOnly///////////////');
        // event.preventDefault();
      //   $state.go('dashboard');
      // }
      // if(!$window.localStorage.getItem('token') && toState.instructorOnly){
      //   event.preventDefault();
      //   $state.go('landing');
      // }
    })
  }
})();
