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
              return getInfo(res[i].links.summary)
            }
          }
        })

        function getInfo (url){
          return dashboardService.getClassInfo(url)
          .then(function(res) {
            vm.info.lectures = res.lectures;
            vm.info.participants = res.participants;
            return
          })
        }

      }
}());
