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
    var AUTH_ENDPOINTS = $http.get(API_URL).then(function (res){
      return $http.get(res.data.auth)
    })

    var authFactory = {
      session: {currentUser: null},
      login: login,
      signup: signup,
      me: me
    }

    return authFactory

    function login (user) {
      return AUTH_ENDPOINTS.then(function(AUTH_ENDPOINTS){
        AUTH_ENDPOINTS = AUTH_ENDPOINTS.data;
        return $http.post(AUTH_ENDPOINTS.login, user).then(function (res){
          $window.localStorage.setItem('token', res.data.token)
          return res.data
        })
      })
    }

    function signup (user) {
      return AUTH_ENDPOINTS.then(function(AUTH_ENDPOINTS){
        AUTH_ENDPOINTS = AUTH_ENDPOINTS.data;
        return $http.post(AUTH_ENDPOINTS.signup, user).then(function (res){
          $window.localStorage.setItem('token', res.data.token)
          return res.data
        })
      })
    }

    function me(){
      return AUTH_ENDPOINTS.then(function(AUTH_ENDPOINTS){
        AUTH_ENDPOINTS = AUTH_ENDPOINTS.data;
        return $http.get(AUTH_ENDPOINTS.me).then(function(res){
          // console.log('in me endoint',res);
          authFactory.session.currentUser = Object.keys(res.data).length > 0 ? res.data : null;
          // console.log('in me in factory', authFactory.session.currentUser );
          return Promise.resolve(authFactory.session);
        }).catch(function (err){
          return Promise.reject(err);
        });
      });
    }
  }
}());
