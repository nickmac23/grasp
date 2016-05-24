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

    function controller ($scope, $rootScope) {
      // var socket = io.connect('http://localhost:3000/');
      var i = 0;

      $scope.className = 'class'

      $rootScope.$on('area', function (event, data) {
        var total = data.d + data.n + data.g;
        var d = data.d/total * 100;
        var n = data.n/total * 100;
        var g = data.g/total * 100;
        areaChart.data.rows.push({c: [{v: data.time + 'min' }, {v: d}, {v: n}, {v: g}] })
      })

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
