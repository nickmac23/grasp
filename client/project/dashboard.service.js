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
      getClass: getClass,
      getClassInfo: getClassInfo
    }

    return dashboardFactory

    function getClass(){
      return AUTH_ENDPOINTS.then(function(res){
        return res.data
        }).catch(function (err){
          return err;
        })
      }

    function getClassInfo (url) {
      return $http.get(url).then(function (res) {
        return res
      })
    }

  }
}());
