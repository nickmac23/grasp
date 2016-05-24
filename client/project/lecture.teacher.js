(function() {
  'use strict';

    angular.module('panic')
      .directive('lectureTeacher', lectureTeacherDirective);

      function lectureTeacherDirective () {
        return {
          restrict: "E",
          scope: {},
          templateUrl: "partials/lecture.teacher.html",
          controller: lectureTeacherController,
          controllerAs: "vm"
        }
      }

      lectureTeacherController.$inject = [
        '$log',
        '$state'
      ];

      function lectureTeacherController($log, $state) {
        var vm = this;

      }

}());
