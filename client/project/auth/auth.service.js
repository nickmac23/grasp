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

    var authFactory = {
      session: {currentUser: null},
      login: login,
      signup: signup,
      me: me
    }

    return authFactory

    function login (user) {
      return $http.post(AUTH_ENDPOINTS.login, user).then(function (res){
        $window.localStorage.setItem('token', res.data.token)
        return res.data
      })
    }

    function signup (user) {
      return $http.post(AUTH_ENDPOINTS.signup, user).then(function (res){
        $window.localStorage.setItem('token', res.data.token)
        return res.data
      })
    }

    function me(){
      console.log('in service me', AUTH_ENDPOINTS.me);
      return $http.get(AUTH_ENDPOINTS.me).then(function(res){
        console.log('me', res);
        authFactory.session.currentUser = Object.keys(res.data).length > 0 ? res.data : null;
        console.log('AuthFactory me()' + authFactory.session);
        return authFactory.session;
      }).catch(function (err){
        console.log(err);
        return Promise.reject(err);
      })
    }
  }
}());
