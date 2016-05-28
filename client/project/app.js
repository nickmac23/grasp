
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
     return 'https://panic-button-g20.herokuapp.com'
   }

   routeEvent.$inject = ['$rootScope', '$state', '$window'];

   function routeEvent($rootScope, $state, $window){
     $rootScope.$on('$stateChangeStart', function(event, state){
       if(!$window.localStorage.getItem('token') && state.loggedInOnly){
         event.preventDefault();
         $state.go('landing');
       }
       if($window.localStorage.getItem('token') && state.loggedOutOnly){
         event.preventDefault();
         $state.go('dashboard');
       }
     })
   }
})();
