(function() {
  'use strict';

  angular.module('panic')
  .factory('dashboardService', dashboardFactory);

 dashboardFactory.$inject = [
    '$log',
     '$http',
     '$state',
     '$window',
     'API_URL'
  ];

  function dashboardFactory ($log, $http, $state, $window, API_URL) {
    var AUTH_ENDPOINTS;
    $http.get(API_URL).then(function (res){
      console.log('in dashboard factory', res.data);
      return $http.get(res.data.lectures)
    }).then(function (res){
      console.log('res', res);
      AUTH_ENDPOINTS = res.data;
    })

    var dashboardFactory = {

    }

    return dashboardFactory

  }
}());
