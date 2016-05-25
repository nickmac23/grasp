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
    console.log('in service');
    var URL = $http.get(API_URL).then(function (res){
      console.log('URL IS',res.data);
    })

    return {
      login: login,
      signup: signup,
    }

    function login (data) {
      console.log('in service loging',data);
      return $http.post(API_URL)
    }

    function signup (data) {
      console.log('in service signup',data);
      return $http.post(API_URL)

    }


  }

}());
