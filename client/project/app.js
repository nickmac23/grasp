(function() {
  'use strict'

  var dependencies = [
    'ui.router',
    'googlechart'
  ]

  angular.module('panic', dependencies)
  .constant({'API_URL': resolveApiUrl() + '/api/v1'})
   .run(routeEvent)

   resolveApiUrl.$inject = ['$http']

   function resolveApiUrl($http){
     if(window.location.origin === "http://localhost:5000") return 'http://localhost:3000';
     return 'https://panic-button-g20.herokuapp.com'
   }

   routeEvent.$inject = ['$rootScope', '$state'];

   function routeEvent($rootScope, $state){
     $rootScope.$on('$stateChangeStart', function(event, state){
       if(!localStorage.getItem('token') && state.loggedInOnly){
         console.log('preventingDefault');
         event.preventDefault();
        //  $state.go('/');
       }
       if(localStorage.getItem('token') && state.loggedOutOnly){
         event.preventDefault();
        //  $state.go('posts');
       }
     })
   }
})();
