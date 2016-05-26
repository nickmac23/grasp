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
        'authService'
      ];

      function dashboardController($log, $state, dashboardService, authService) {
        var vm = this;
        vm.info = {};
        vm.session = authService.session;
        vm.getInfo = getInfo;
        vm.addClass = addClass;
        vm.formClose = formClose;
        vm.addLecture = addLecture;
        vm.currentClass;

        dashboardService.getClass()
        .then(function (res){
          vm.teaching = [];
          vm.attending = [];
          for (var i = 0; i < res.length; i++) {
            if(res[i].attributes.instructor){
              vm.teaching.push(res[i]);
            } else {
              vm.attending.push(res[i]);
            }
          }
          return res
        }).then(function (res){
          for (var i = 0; i < res.length; i++) {
            if(+res[i].attributes.id === +$state.params.classId) {
              vm.currentClass = res[i];
              return getInfo(res[i])
            }
          }
        })

        function getInfo (currentClass){
          vm.currentClass = currentClass;
          return dashboardService.getClassInfo(currentClass.links.summary)
          .then(function(res) {
            console.log('New res', res);  
            vm.info.lectures = res.lectures;
            vm.info.participants = res.participants;
            return
          })
        }

        function addClass (myForm){
          var newClass = angular.copy(vm.class)
          myForm.$setPristine();
          myForm.$setUntouched();
          vm.class = {};
          return dashboardService.addClass(newClass)
        }

        function addLecture (form) {
          var newLecture = angular.copy(vm.lecture);
          form.$setPristine();
          form.$setUntouched();
          vm.lecture = {};
          return dashboardService.addLecture(newLecture);
        }

        function formClose (form) {
          form.$setPristine();
          form.$setUntouched();
          vm.class = {};
          vm.lecture = {};
          return
        }


      }
}());
