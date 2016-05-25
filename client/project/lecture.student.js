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
        '$state'
      ];

      function lectureController($log, $state) {
        var socket = io.connect('http://localhost:3000/');
        var vm = this;
        this.vote = vote;
        var lectureId = $state.params.id

        function vote (status) {
          console.log('vote!');
          socket.emit('chart', {lectureId: lectureId, user_id: 1, status: status} )
        }

      }

}());
