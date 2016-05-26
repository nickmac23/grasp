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
      // addLecture: addLecture
    }

    return dashboardFactory

    function getClasses(){
      return AUTH_ENDPOINTS.then(function(res){
        return res.data
        }).catch(function (err){
          return err;
        })
      }

    function getClassInfo (url) {
      return $http.get(url).then(function (res) {
        return res.data
      })
    }

    function addClass(newClass) {
      console.log('newClass',newClass);
      return POST_CLASSES_ENDPOINTS.then(function (res){
        return $http.post(res, newClass)
        .then(function(res){
          console.log('return from server add class', res);
          return res
        })
      })
    }
    // function addLecture (newLecture) {
    //   return
    // }

  }
}());
