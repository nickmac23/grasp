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

      var lecture_id = ChartFactory.lecture_id
      $scope.className = 'class'

      $rootScope.$on(lecture_id, function (event, data) {
        console.log('here', data);
        // if (data.students) {
        //   var d = data.d/data.students * 100;
        //   var u = data.u/data.students * 100;
        //   var g = data.g/data.students * 100;
        //   areaChart.data.rows.push({c: [{v: new Date()}, {v: d}, {v: u}, {v: g}] })
        //   // $scope.$apply()
        // } else {
          var students = Object.keys(data).length
          var students = data.students
          var timeStart = new Date(data.lecture_start);
          var timeArray =[]
          var timeData = {};
          var tally = {};
          for (var user in students ) {
            var oldDif = 1;
            console.log("NEW USER*******");
            for (var i = 0; i < students[user].length; i++) {
              var dif = (Math.floor((new Date(students[user][i].created_at) - timeStart)/6000)) +1
              timeData[dif] = students[user][i].status_id

              if(dif - oldDif > 0){


                for(var j = oldDif; j < dif; j++){
                  if(tally[j]){
                    tally[j][timeData[oldDif]]++;
                  }else{
                    tally[j] = {1:0, 2:0, 3:0}
                    tally[j][timeData[oldDif]]++;
                  }
                  console.log('\n storing ', timeData[oldDif]);
                  console.log('newTally ' + oldDif + ' ',  tally[oldDif]);
                }



                oldDif = dif;
              }
              // console.log('status_id', students[user][i]);
              //console.log('tally diff', tally[dif][students[user][i].status_id]);
            }
            if(tally[dif]){
              tally[dif][timeData[dif]]++;
            }else{
              tally[dif] = {1:0, 2:0, 3:0}
              tally[dif][timeData[dif]]++;
            }
            // console.log('time', timeData);
            // timeArray.push(timeData)
          }

          console.log('tally', tally);

          for (var time in tally) {
            var d = tally[time][1]/Object.keys(students).length * 100
            var u = tally[time][2]/Object.keys(students).length * 100
            var g = tally[time][3]/Object.keys(students).length * 100
            areaChart.data.rows.push({c: [{v: time }, {v: d}, {v: u}, {v: g}] })

          }
        // }
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
