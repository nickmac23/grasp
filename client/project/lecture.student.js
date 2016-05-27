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
        'authService',
        'dashboardService'
      ];

      function lectureController($log, $state, authService, dashboardService) {
        var socket = io.connect('http://localhost:3000/');
        var vm = this;
        var lecture_id = $state.params.id
        vm.session = authService.session;
        this.vote = vote;

        vm.previousPage = dashboardService.getPreviousPage();

        function vote (status_id) {
          socket.emit('chart', {lecture_id: +lecture_id, user_id: authService.session.currentUser.id , status_id: status_id} )
        }

      }

}());
