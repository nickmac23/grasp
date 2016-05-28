(function() {
  'use strict';

    angular.module('panic')
      .directive('landingDirective', landingDirective);

      function landingDirective (){
        return {
          restrict: "E",
          scope: {},
          templateUrl: "partials/landing.html",
          controller: landingController,
          controllerAs: "vm"
        }
      }

      landingController.$inject = [
        '$scope',
        '$log',
        '$state',
        'authService',
        '$document'
      ];


      function landingController($scope, $log, $state, authService, $document) {
        var vm = this;
        vm.classCodeSubmit = classCodeSubmit;
        vm.loginSubmit = loginSubmit;
        vm.signupSubmit = signupSubmit;
        vm.scrollDown = scrollDown;


        //Actually scrolls DOWN - renaming to scrollDown() breaks the animation.
        function scrollDown() {
          $document.scrollTopAnimated(730, 1500);
        }

        function classCodeSubmit () {
          console.log('class code', vm.classCode);
          vm.frm = {}
          $state.go('student');
        }

        function loginSubmit () {
          var user = angular.copy(vm.login)
          authService.login(user).then(function (res){
            $state.go('dashboard');
          })
        }

        function signupSubmit (){
          var user = angular.copy(vm.signup);
          authService.signup(user).then(function (res){
            $state.go('dashboard');
          })
        }


        // window.scrollTo({ 0, 0, behavior });

        // var scrollDown = document.querySelector('#scroll-button');
        // var Destination = document.querySelector('#signup');
        //
        // // This function can easily be an onClick handler in React components
        // var handleClick = function(event) {
        //   event.preventDefault();
        //
        //   smoothScroll(Destination);
        // };
        //
        // scrollDown.addEventListener('click', handleClick);

      }

}());
