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
        vm.previousPage = dashboardService.getPreviousPage();

        dashboardService.currentLecture($state.params.lectureId).then(function(res){
          vm.currentLecture = res;
          return
        });

        function endLecture () {
          dashboardService.endLecture($state.params.lectureId);
          $state.go('dashboard');
        }

      }

}());
