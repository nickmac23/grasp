(function() {
  'use strict';

  angular.module('panic')
  .directive('pieChart', directive)

  function directive () {
    return {
      scope: {},
      template: '<button ng-click="sock()">sock</button><div google-chart chart="pieChart"></div>',
      controller: controller,
    }
    function controller ($scope, $rootScope) {
      var socket = io.connect('http://localhost:3000/');
      var pieChart = {};
      $scope.sock = function () {
        socket.emit('chart', 1)
      }
      socket.on('pie', function (data) {
        if (data === null) {
          console.log('nope');
        } else {
        $scope.vote[0]= { 'c': [ { 'v': 'dafuq' }, {'v' : data.d} ] }
        $scope.vote[1] = { 'c': [ { 'v': 'novote'}, {'v' : data.n} ] }
        $scope.vote[2] = { 'c': [ { 'v':  'gotit'}, {'v' : data.g } ] }
        $rootScope.$emit('area', data)
        $scope.$apply()
      }
      })
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
          "vAxis": {
            "title": "Sales unit",
            "gridlines": {
              "count": 10
            }
          },
          "hAxis": {
            "title": "Date"
          }
        }

        $scope.pieChart = pieChart;
    }
  }


}());
