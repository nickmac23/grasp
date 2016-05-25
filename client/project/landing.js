(function() {
  'use strict';

    angular.module('panic')
      .directive('landingDirective', landingDirective);

      function landingDirective (){
        console.log('in landing');
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

        function classCodeSubmit () {
          console.log('class code', $scope.frm);
          $scope.frm = {}
          $state.go('student');
        }
      }

}());
