(function() {
  'use strict';

  angular.module('panic')
  .factory('ChartFactory', factory)

  // factory.$inject = [ '$rootScope', '$location']

  function factory ($rootScope, $location, $state) {

    $rootScope.$on( "$stateChangeSuccess", function(event, next, current) {
      console.log('chart.factory', $route.current.params);
    })

    var service = {
      lectureId: $state.params.id,
    }
    return service

  }


}());
