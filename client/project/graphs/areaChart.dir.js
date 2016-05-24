(function() {
  'use strict';

  angular.module('panic', ['googlechart'])
  .directive('areaChart', directive)

  function directive () {
    return {
      scope: {},
      template: '<div google-chart chart="areaChart"></div>',
      controller: controller,
    }

    function controller ($scope) {
      var i = 1;
      var D = 0;
      var N = 100;
      var G = 0;
      // $scope.voter = voter;
      $scope.className = 'class'

      // function voter () {
      //   D += 5
      //   G += 10
      //   N -= 15
      //   areaChart.options.title = $scope.className
      //   areaChart.data.rows.push({c: [{v: i + 'min' }, {v: D}, {v: N}, {v: G}] })
      //   $scope.vote[0]= { 'c': [ { 'v': 'dafuq' }, {'v' : D} ] }
      //   $scope.vote[1] = { 'c': [ { 'v': 'novote'}, {'v' : N} ] }
      //   $scope.vote[2] = { 'c': [ { 'v':  'gotit'}, {'v' : G } ] }
      //   i+=10
      // }

      var areaChart = {};
      areaChart.type = "AreaChart";
      areaChart.displayed = false;
      areaChart.data = {};
      areaChart.data.rows = []

      areaChart.data.rows.push({c: [{v: "0min"},{v: 0},{v: 100},{v: 0} ] })

      areaChart.data.cols = [
          {id: "month",label: "Month",type: "string"},
          {id: "DaFuq",label: "DaFuq",type: "number"},
          {id: "NoVote",label: "NoVote",type: "number"},
          {id: "GotIt",label: "GotIt",type: "number"},
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
