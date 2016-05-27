(function() {
  'use strict';

  angular.module('panic')
  .directive('pieChart', directive)

  function directive () {
    return {
      scope: {},
      template: '<div google-chart chart="pieChart" id="pieChart"></div>',
      controller: controller,
    }
    function controller ($scope, $rootScope, $state, ChartFactory) {
      var socket = io.connect('http://Nick-MacBook-Air.local:3000');
      var pieChart = {};
      var lecture_id = $state.params.id;
      var students = [];
      var g = 0;
      var d = 0;
      var u = 0;


      socket.on(lecture_id, function (data) {
        console.log(data);
        if (data.class) {
          var check = true
          for (let i = 0; i < students.length; i++) {
            if (students[i] === data.class) {
                check = false
            }
          }
          if (check) {
            u++
            students.push(data.class)
            check = true
          }

        } else {
          switch (data.lastStatus) {
            case 1:
                 d--
              break
            case 2:
                 u--
              break
            case 3:
                 g--
              break
          }
          switch (data.status_id) {
            case 1:
                 d++
              break
            case 3:
                 g++
              break
          }
          $rootScope.$emit(lecture_id, data)
          $scope.vote[0]= { 'c': [ { 'v': 'I dont get it' }, {'v' : d} ] }
          $scope.vote[1] = { 'c': [ { 'v': 'undecided'}, {'v' : u} ] }
          $scope.vote[2] = { 'c': [ { 'v':  'I get it'}, {'v' : g } ] }
          $scope.$apply()
        }
        $rootScope.$emit(lecture_id, { students: students, d: d, u: u , g: g})
      })

      ChartFactory.getGraphData().then( function(data) {
        var dat = data.students
        if (!(dat === null)) {
          for (var user in dat ) {
            switch (dat[user][dat[user].length - 1].status_id) {
              case 1:
                d++
                break;
              case 2:
                u++
                break;
              case 3:
                g++;
                break;
            }
          }
            $scope.vote[0]= { 'c': [ { 'v': 'I dont get it' }, {'v' : d} ] }
            $scope.vote[1] = { 'c': [ { 'v': 'undecided'}, {'v' : u} ] }
            $scope.vote[2] = { 'c': [ { 'v':  'I get it'}, {'v' : g } ] }
          $rootScope.$emit(lecture_id, data)
        }
      })

      $scope.$on('$destroy', function (event) {
        socket.removeAllListeners();
      });

      pieChart.type = 'PieChart';
      pieChart.displayed = false;
      pieChart.data = {}
      $scope.vote = [];
      $scope.vote[0]= { 'c': [ { 'v': 'dafuq' }, {'v' : 0} ] }
      $scope.vote[1] = { 'c': [ { 'v': 'novote'}, {'v' : 100} ] }
      $scope.vote[2] = { 'c': [ { 'v':  'gotit'}, {'v' : 0 } ] }
      pieChart.data.rows = $scope.vote

      pieChart.data.cols = [
        { "id": "month", "label": "Month", "type": "string" },
        { "id": "laptop-id", "label": "Laptop", "type": "number" },
        { "id": "desktop-id", "label": "Desktop", "type": "number" },
        { "id": "server-id", "label": "Server", "type": "number" },
        { "id": "cost-id", "label": "Shipping", "type": "number" }
      ];

        pieChart.formatters = {}
        pieChart.options = {
          "isStacked": "true",
          "fill": 20,
          "displayExactValues": true,
          },



        $scope.pieChart = pieChart;
    }
  }


}());
