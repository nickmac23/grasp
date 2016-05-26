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

    var POST_CLASSES_ENDPOINTS = $http.get(API_URL).then(function (res){
      return res.data.classes.post
    })

    var dashboardFactory = {
      getClasses: getClasses,
      getClassInfo: getClassInfo,
      addClass: addClass,
      addLecture: addLecture
    }

    return dashboardFactory

    function getClasses(){
      return AUTH_ENDPOINTS.then(function(res){
        return res.data
        }).catch(function (err){
          //need to create variable in service for updates
          return err;
        })
      }

    function getClassInfo (url) {
      return $http.get(url).then(function (res) {
        return res.data
      })
    }

    function addClass(newClass) {
      return POST_CLASSES_ENDPOINTS.then(function (res){
        return $http.post(res, newClass)
        .then(function(res){
          //need to add to a variable in service for updates
          return res
        })
      })
    }

    function addLecture (newLecture, url) {
      console.log(newLecture);
      console.log(url);
      return $http.post(url, newLecture)
      .then(function (res) {
        console.log('Back from server lecture',res);
        return
      })
    }

  }
}());
