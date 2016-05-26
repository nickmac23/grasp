(function() {
  'use strict';

  angular.module('panic')
  .factory('ChartFactory', factory)

  // factory.$inject = [ '$rootScope', '$location']

  function factory ($rootScope, $location, $state, $http, API_URL) {
    $rootScope.$on( "$stateChangeSuccess", function(event, next, current) {
      console.log('chart.factory', $route.current.params);
    })

    var service = {
      lectureId: $state.params.id,
      graphData: graphData,
    }
    return service

    function graphData () {
      return $http.get(API_URL + '/lectures/'+service.lectureId+'/understandings')
      .then( function (res) {
        return res.data
      })
    }
  }


}());
