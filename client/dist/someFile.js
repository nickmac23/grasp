angular.module('starter')
.directive('mainDirective', function(){
  return {
    restrict: 'E',
    scope: {},
    templateUrl: './js/someFile.html',
    controller: mainController,
    controllerAs: 'vm'
  }

  function mainController () {
    var vm = this;
    vm.test = "gulping";
  }

})
