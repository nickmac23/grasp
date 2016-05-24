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
        '$log',
        '$state'
      ];

      function landingController($log, $state) {
        var vm = this;
        vm.classCodeSubmit = classCodeSubmit;

        function classCodeSubmit (form) {
          //do stuff with the class code
          console.log('class code', vm.classCode);
          $state.go('lecture');
        }
      }

}());
