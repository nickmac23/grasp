(function() {
  'use strict';

  angular.module('panic')
  .factory('ChartFactory', factory)

  factory.$inject = ['$http', '$rootScope', '$location']

  function factory ($http, $rootScope, $location) {
    console.log('factory4');
    // $rootScope.$on( "$stateChangeStart", function(event, next, current) {
    //     console.log($location);
    //     console.log('here');
    // })

    var service = {

    }
    return service
  }

}());
