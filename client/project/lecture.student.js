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
        var socket = io.connect('http://localhost:3000/');
        var vm = this;
        var lecture_id = $state.params.id
        var lastStatus = 2;
        vm.session = authService.session;
        this.vote = vote;
        socket.emit('set', {lecture_id: +lecture_id, user_id: 1, status_id: 2})

        function vote (status_id) {
          socket.emit('chart', {lecture_id: lecture_id, user_id: 1, status_id: status_id, lastStatus: lastStatus} )
          lastStatus= status_id
        }

      }

}());
