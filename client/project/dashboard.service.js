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
    var getParticipants = function () {
      return $http.get(API_URL).then(function (res){
        return $http.get(res.data.participations)
      })
    }

    var POST_CLASSES_ENDPOINTS = $http.get(API_URL).then(function (res){
      return res.data.classes.post
    })

    var _classes = {};
    _classes._teaching = [];
    _classes._attending = [];

    var _previousPage;


    var dashboardFactory = {
      getClasses: getClasses,
      getClassInfo: getClassInfo,
      addClass: addClass,
      addLecture: addLecture,
      setPreviousPage: setPreviousPage,
      getPreviousPage: getPreviousPage,
      startLecture: startLecture,
      endLecture: endLecture
    }

    return dashboardFactory

    function getClasses(){
      return getParticipants().then(function(res){
        _classes._teaching = [];
        _classes._attending = [];
        for (var i = 0; i < res.data.length; i++) {
          if(res.data[i].attributes.instructor){
            _classes._teaching.push(res.data[i]);
          } else {
            _classes._attending.push(res.data[i]);
          }
        }
        return _classes;
        }).catch(function (err){
          return err;
        })
    }

    function getClassInfo (url) {
      return $http.get(url).then(function (res) {
        console.log('lecture info',res);
        return res.data
      })
    }

    function addClass(newClass) {
      return POST_CLASSES_ENDPOINTS.then(function (res){
        return $http.post(res, newClass)
        .then(function(res){
          _classes._teaching.push(res.data)
          return _classes
        })
      })
    }

    function addLecture (newLecture, url) {
      return $http.post(url, newLecture)
      .then(function (res) {
        return res.data;
      })
    }

    function setPreviousPage (id){
      _previousPage = id;
      return
    }

    function getPreviousPage () {
      return _previousPage
    }

    function startLecture (lectureId) {
      return $http
    }

    function endLecture (lectureId, timeStamp) {
      return $http
    }

  }
}());
