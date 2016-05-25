(function() {
  'use strict';

  angular.module('panic')
  .factory('ChartFactory', factory)

  factory.$inject = ['$http', '$rootScope',  '$location']

  function factory ($http, $rootScope, $location) {
    // $rootScope.$on( "$stateChangeSuccess", function(event, next, current) {
    //   console.log($route.current.params);
    // })

    var service = {
      lectureId: 'dogs'
    }
    return service

  }


}());
