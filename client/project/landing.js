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
        '$state'
      ];

      function landingController($scope, $log, $state) {
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
          console.log("login", vm.login);
          $state.go('student');

        }

        function signupSubmit (){
          console.log("signup", vm.signup);
          $state.go('student');

        }

      }

}());
