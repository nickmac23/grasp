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
      return AUTH_ENDPOINTS.then(function(AUTH_ENDPOINTS){
        if(AUTH_ENDPOINTS.status === 400){
          return AUTH_ENDPOINTS.data
        } else {
          return $http.get(AUTH_ENDPOINTS).then(function (res){
            return res
          }).catch(function (err){
            return err;
          })
        }
      })
    }


  }
}());
