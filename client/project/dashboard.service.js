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
    var AUTH_ENDPOINTS = $http.get(API_URL).then(function (res){
      return $http.get(res.data.participations)
    })


    var dashboardFactory = {
      getClass: getClass
    }

    return dashboardFactory

    function getClass(){
      return $http.get(AUTH_ENDPOINTS).then(function (res){
        console.log('back', res);
        return res;
      })
    }


  }
}());
