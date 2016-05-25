(function() {
  'use strict';

    angular.module('panic')
      .directive('landingDirective', landingDirective);

      function landingDirective (){
        return {
          restrict: "E",
          scope: {},
          templateUrl: "partials/landing.html",
          controller: landingController,
          controllerAs: "vm"
        }
      }

      landingController.$inject = [
        '$scope',
        '$log',
        '$state',
        'authService'
      ];

      function landingController($scope, $log, $state, authService) {
        var vm = this;
        vm.classCodeSubmit = classCodeSubmit;
        vm.loginSubmit = loginSubmit;
        vm.signupSubmit = signupSubmit;

        function classCodeSubmit () {
          console.log('class code', vm.classCode);
          vm.frm = {}
          $state.go('student');
        }

        function loginSubmit () {
          var user = angular.copy(vm.login)
          authService.login(user).then(function (res){
            $state.go('dashboard');
          })
        }

        function signupSubmit (){
          var user = angular.copy(vm.signup);
          authService.signup(user).then(function (res){
            $state.go('dashboard');
          })
        }

      }

}());
