(function() {
  'use strict';

    angular.module('panic')
      .directive('lectureTime', lectureDirective);

      function lectureDirective (){
        return {
          restrict: "E",
          scope: {},
          templateUrl: "partials/lecture.time.html",
          controller: lectureController,
          controllerAs: "vm"
        }
      }

      lectureController.$inject = [
        '$log',
        '$state'
      ];

      function lectureController($log, $state) {
        var vm = this;

      }

}());
