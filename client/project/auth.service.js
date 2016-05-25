(function() {
  'use strict';

  angular.module('panic')
  .factory('authService', authFactory);

 authFactory.$inject = [
    '$log',
     '$http',
     '$state',
     '$window',
     'API_URL'
  ];

  function authFactory ($log, $http, $state, $window, API_URL) {
    var AUTH_ENDPOINTS;
    $http.get(API_URL).then(function (res){
      return $http.get(res.data.auth)
    }).then(function (res){
      AUTH_ENDPOINTS = res.data;
    })

    return {
      login: login,
      signup: signup,
    }

    function login (user) {
      return $http.post(AUTH_ENDPOINTS.login, user).then(function (res){
        return res.data
      })
    }

    function signup (user) {
      return $http.post(AUTH_ENDPOINTS.signup, user).then(function (res){
        return res.data
      })
    }


  }

}());
