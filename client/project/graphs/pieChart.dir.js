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
      var socket = io.connect('http://localhost:3000/');
      var pieChart = {};
      var lectureId = $state.params.id;
      ChartFactory.graphData();
      socket.emit('set', lectureId)
      socket.on(2, function (data) {
        console.log(data);
      })

      ChartFactory.graphData().then( function(data) {
        if (!(data === null)) {
          var roster = data[data.length-1].roster
          var students = roster.length;
          var g = 0 ;
          var u = 0 ;
          var d = 0 ;
          for (var i = 0; i < roster.length; i++) {
            switch (roster[i].status_id) {
              case 1:
                g++
                break;
              case 2:
                u++
                break;
              case 3:
                d++;
                break;
            }
          }
            $scope.vote[0]= { 'c': [ { 'v': 'I dont get it' }, {'v' : d} ] }
            $scope.vote[1] = { 'c': [ { 'v': 'undecided'}, {'v' : u} ] }
            $scope.vote[2] = { 'c': [ { 'v':  'I get it'}, {'v' : g } ] }
          $rootScope.$emit(lectureId, data)
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
