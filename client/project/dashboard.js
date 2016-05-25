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
        vm.session = authService.session;

        dashboardService.getClass(vm.session.currentUser.id)
          .then(function (res){
            console.log('Back in dash directive', res);
          })
      }

}());
