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

    var _classes = {};
    _classes._teaching = [];
    _classes._attending = [];


    var dashboardFactory = {
      getClasses: getClasses,
      getClassInfo: getClassInfo,
      addClass: addClass,
      addLecture: addLecture,
    }

    return dashboardFactory

    function getClasses(){
      return AUTH_ENDPOINTS.then(function(res){
        _classes._teaching = [];
        _classes._attending = [];
        for (var i = 0; i < res.data.length; i++) {
          if(res.data[i].attributes.instructor){
            _classes._teaching.push(res.data[i]);
          } else {
            _classes._attending.push(res.data[i]);
          }
        }
        console.log(_classes);
        return _classes;
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
      return POST_CLASSES_ENDPOINTS.then(function (res){
        return $http.post(res, newClass)
        .then(function(res){
          console.log(res);
          console.log('in add class', res.data[0]);
          _classes._teaching.push(res.data[0])
          console.log(_classes);
          return _classes
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
