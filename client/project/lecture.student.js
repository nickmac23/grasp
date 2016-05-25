(function() {
  'use strict';
    angular.module('panic')
      .directive('lectureStudent', lectureDirective);

      function lectureDirective (){
        return {
          restrict: "E",
          scope: {},
          templateUrl: "partials/lecture.student.html",
          controller: lectureController,
          controllerAs: "vm"
        }
      }

      lectureController.$inject = [
        '$log',
        '$state',
        'authService'
      ];

      function lectureController($log, $state, authService) {
        var vm = this;
        vm.session = authService.session;
        
      }

}());
