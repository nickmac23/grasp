(function() {
  'use strict';

  angular.module('panic')
  .directive('areaChart', directive)

  function directive () {
    return {
      scope: {},
      template: '<div google-chart chart="areaChart"></div>',
      controller: controller,
    }

    function controller ($scope, $rootScope, ChartFactory) {

      $scope.$watch(function(){
        return ChartFactory.graphData;
      },
      function (newValue) {
        graph(newValue);
      }, true);

      function graph (tally) {
        areaChart.data.rows = []
        for (var time in tally) {
          var total = tally[time]['1'] + tally[time]['2'] + tally[time]['3']
          var d = tally[time][1]/total * 100
          var u = tally[time][2]/total * 100
          var g = tally[time][3]/total * 100
          areaChart.data.rows.push({c: [{v: time }, {v: d}, {v: u}, {v: g}] })
        }
      }

      var areaChart = {};
      areaChart.type = "AreaChart";
      areaChart.displayed = false;
      areaChart.data = {};
      areaChart.data.rows = []

      areaChart.data.rows.push({c: [{v: "Lecture start"},{v: 0},{v: 100},{v: 0} ] })

      areaChart.data.cols = [
          {id: "month",label: "Month",type: "string"},
          {id: "DaFuq",label: "I don't get it",type: "number"},
          {id: "NoVote",label: "Undecided",type: "number"},
          {id: "GotIt",label: "I got it",type: "number"},
        ];
      areaChart.options = {
        "title": $scope.className,
        "isStacked": "true",
        "fill": 20,
        "displayExactValues": true,
        "vAxis": {
          "title": "Percent class",
          "gridlines": {
            "count": 5
          }
        },
        "hAxis": {
          "title": "Time",
          "scaleType": 'log'

        }
      };
      $scope.areaChart = areaChart;
    }
  }




}());
