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
      var i = 0;
      var lectureId = ChartFactory.lectureId
      $scope.className = 'class'

      $rootScope.$on(lectureId, function (event, data) {
          // var students = Object.keys(data).length
        var students = data.students
        var timeStart = new Date(data.lecture_start).getTime();
        var timeArray =[]
        var timeData = {};

        for (var user in students ) {
          for (var i = 0; i < students[user].length; i++) {
            var dif = (Math.floor((+timeStart - +new Date(students[user][i].created_at).getTime())/6))
            timeData[dif] = students[user][i].status_id
          }
          timeArray.push(timeData)
        }
        console.log(timeArray);
        // for (var time in timeData) {
        //   areaChart.data.rows.push({c: [{v: time }, {v: d}, {v: u}, {v: g}] })
        //
        // }
        areaChart.data.rows.push({c: [{v: time }, {v: timeData[time].d}, {v: timeData[time].u}, {v: timeData[time].g}] })
      })

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
