(function() {
  'use strict';

    angular.module('panic')
      .directive('dashboard', dashboardDirective);

      function dashboardDirective (){
        return {
          restrict: "E",
          scope: {},
          templateUrl: "partials/dashboard.html",
          controller: dashboardController,
          controllerAs: "vm"
        }
      }

      dashboardController.$inject = [
        '$log',
        '$state',
        'dashboardService',
        'authService',
        '$window'
      ];

      function dashboardController($log, $state, dashboardService, authService, $window) {
        var vm = this;
        vm.info = {};
        vm.session = authService.session;
        vm.getInfo = getInfo;
        vm.addClass = addClass;
        vm.formClose = formClose;
        vm.addLecture = addLecture;
        vm.currentClass;
        vm.logout = logout;
        vm.setPreviousPage = setPreviousPage;
        vm.startLecture = startLecture;
        vm.addParticipant = addParticipant;
        vm.deleteParticipant = deleteParticipant;

        dashboardService.getClasses()
        .then(function (res){
          vm.teaching = res._teaching;
          vm.attending = res._attending;
          if(res._teaching.length > 0){
            for (var i = 0; i < res._teaching.length; i++) {
              if(+res._teaching[i].attributes.id === +$state.params.classId) {
                vm.currentClass = res._teaching[i];
                return getInfo(res._teaching[i]);
              }
            }
          }
          if(res._teaching.length > 0){
            for (var i = 0; i < res._attending.length; i++) {
              if(+res._attending[i].attributes.id === +$state.params.classId) {
                vm.currentClass = res._attending[i];
                return getInfo(res._attending[i]);
              }
            }
          }
        })

        function getInfo (currentClass){
          vm.currentClass = currentClass;
          return dashboardService.getClassInfo(currentClass.links.summary)
          .then(function(res) {
            vm.links = res.links;
            vm.info = res.attributes;
            return
          })
        }

        function addClass (myForm){
          var newClass = angular.copy(vm.class)
          myForm.$setPristine();
          myForm.$setUntouched();
          vm.class = {};
          return dashboardService.addClass(newClass)
          .then(function(res){
            return res
          });
        }

        function setPreviousPage(id){
          dashboardService.setPreviousPage(id);
          return
        }

        function addLecture (form) {
          var newLecture = angular.copy(vm.lecture);
          form.$setPristine();
          form.$setUntouched();
          vm.lecture = {};
          return dashboardService.addLecture(newLecture, vm.links.lectures.post)
          .then(function(res){
            vm.info.lectures.push(res);
            return
          });
        }

        function formClose (form) {
          form.$setPristine();
          form.$setUntouched();
          vm.class = {};
          vm.lecture = {};
          vm.student = {};
          return
        }

        function logout () {
          $window.localStorage.clear();
          $state.go('landing');
          return
        }

        function startLecture(lecture){
          dashboardService.startLecture(lecture.links.start);
          dashboardService.setCurrentLecture(lecture);
          $state.go('teacher', {id: lecture.attributes.lecture_id});
        }

        function addParticipant(form){
          var newParticipant = angular.copy(vm.student);
          dashboardService.addParticipant(vm.links.participants.post, newParticipant).then(function(res){
            vm.info.participants.push(res.data);
            vm.student = {};
            form.$setPristine();
            form.$setUntouched();
          });
        }

        function deleteParticipant (participant){
            dashboardService.deleteParticipant(participant.links.delete)
            .then(function (res){
              for (var i = 0; i < vm.info.participants.length; i++) {
                if(vm.info.participants[i].attributes.user_id == res.data[0].user_id){
                   vm.info.participants.splice(i, 1);
                }
              }
              return vm.info
            })

        }

      }
}());
