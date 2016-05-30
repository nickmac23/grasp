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
        '$state',
        'dashboardService'
      ];

      function lectureTeacherController($log, $state, dashboardService) {
        var vm = this;
        vm.endLecture = endLecture;
        vm.currentLecture = dashboardService.getCurrentLecture();

        function endLecture () {
          // dashboardService.endLecture(vm.currentLecture.links.stop);
          dashboardService.endLecture($state.params.id);
          $state.go('dashboard');
        }

      }

}());
