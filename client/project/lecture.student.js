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
        'dashboardService',
        '$interval',
        'lectureStudentService'
      ];

      function lectureController($log, $state, authService, dashboardService, $interval, lectureStudentService) {
        var url = (window.location.origin === "http://localhost:5000") ? 'http://localhost:3000' : 'https://panic-button-g20.herokuapp.com'
        var socket = io.connect(url);
        var vm = this;
        var lecture_id = $state.params.id;
        var interval = null;
        vm.session = authService.session;
        vm.canClick = lectureStudentService.canVote();
        vm.currentUnderstanding = lectureStudentService.getCurrentUnderstanding();
        vm.vote = vote;

        vm.previousPage = dashboardService.getPreviousPage();

        console.log(vm.canClick);
        if(vm.canClick === false && lectureStudentService.getTimer() > 0){
          console.log('startingTimer');
          startTimer();
        }else{
          vm.canClick = true;
        }

        function vote (status_id) {
          console.log('voting');
          if(!interval){
            switch (status_id) {
              case 1:
                vm.currentUnderstanding = lectureStudentService.setCurrentUnderstanding("don't understand :-(");
                break;
              case 3:
                vm.currentUnderstanding = lectureStudentService.setCurrentUnderstanding(" get it! :-)");
                break;
              default:
            }
            vm.canClick = lectureStudentService.voted();
            socket.emit('chart', {lecture_id: +lecture_id, user_id: authService.session.currentUser.id, status_id: status_id} );

            startTimer();
          }
        }

        function startTimer(){
          console.log('startTimer');
          vm.timer = lectureStudentService.getTimer();
          interval = $interval(function(){
            console.log('interval');
            vm.timer = lectureStudentService.getTimer();
            if(lectureStudentService.getTimer() <= 0){
              $interval.cancel(interval);
              interval = null;
              vm.timer = lectureStudentService.resetTimer();
              vm.canClick = lectureStudentService.canVote();
            }
          }, 1000)
        }

      }

}());
