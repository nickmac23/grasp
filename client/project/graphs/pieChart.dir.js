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


      $scope.$watch(function(){
        return ChartFactory.graphData
      },
      function (newValue) {
        if (newValue) graph(newValue);
      }, true);

      function graph (tally) {
        console.log('time****', tally);
        var time = Object.keys(tally).length
          var d = tally[time][1]
          var u = tally[time][2]
          var g = tally[time][3]
          $scope.vote[0]= { 'c': [ { 'v': 'I dont get it' }, {'v' : d} ] }
          $scope.vote[1] = { 'c': [ { 'v': 'undecided'}, {'v' : u} ] }
          $scope.vote[2] = { 'c': [ { 'v':  'I get it'}, {'v' : g } ] }
      }

      ChartFactory.getGraphData().then( function(data) { console.log('##########', data);})

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
