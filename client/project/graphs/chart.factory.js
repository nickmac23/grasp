p(function() {
  'use strict';


  angular.module('panic')
  .factory('ChartFactory', factory)

  // factory.$inject = [ '$rootScope', '$location']

  function factory ($rootScope, $location, $state, $http, $interval, API_URL) {
    $rootScope.$on( "$stateChangeSuccess", function(event, next, current) {
    })


    // Update graph data every minute if nobody has clicked.
    var updateInterval = null;
    var url = (window.location.origin === "http://localhost:5000") ? 'http://localhost:3000' : 'https://panic-button-g20.herokuapp.com'
    var socket = io.connect(url);

    socket.on($state.params.id, function (data) {
      if (!service.dataCache.students[data.user_id]) service.dataCache.students[data.user_id] = []
        service.dataCache.students[data.user_id].push(data)
        service.graphData = createTally(service.dataCache);
        $rootScope.$apply()
    })

    var service = {
      lecture_start: null,
      lecture_id: $state.params.id,
      dataCache: null,
      graphData: null,
      getGraphData: getGraphData,
    }


    return service

    function getGraphData () {

      if(service.graphData) return service.graphData;

      return $http.get(API_URL + '/lectures/'+service.lecture_id+'/understandings')
      .then( function (res) {
        service.lecture_start = res.data.lecture_start;
        service.dataCache = res.data
        service.graphData = createTally(res.data)
        return service.graphData
      })
    }

    $scope.$on('$destroy', function (event) {
      socket.removeAllListeners();
    });

    function createTally(data) {
      if(Object.keys(data.students).length === 0) return {1:{1:0, 2:0, 3:0}}

      var functionStart = Date.now();
      console.log(data);
      var students = data.students
      var timeStart = new Date(data.lecture_start);
      var timeEnd = data.lecture_end ? new Date(data.lecture_end) : new Date(Date.now());
      var timeChangeInMilliseconds = (timeEnd.getTime() - timeStart.getTime());


      // Determine graph interval
      var graphInterval = determineGraphInterval(timeChangeInMilliseconds);
      var interval = graphInterval.milliseconds;
      var units = graphInterval.units;
      setUpdateInterval(interval);

      var POINTS_ON_GRAPH = Math.ceil(timeChangeInMilliseconds / interval);
      var tally = {}


      // Build tally buckets
      for (var i = 1; i <= POINTS_ON_GRAPH; i++) {
        tally[i] = {1:0, 2:0, 3:0};
      }

      for (var studentId in students) {
        var student = students[studentId];
        for (var bucketId in tally) {
          var bucket = tally[bucketId];
          var bucketTime = new Date(timeStart.getTime() + (+bucketId * interval));
          var currentStatusIndex = 0;
          var previousStatus = student[currentStatusIndex] || {status_id: 2};

          for(var i = currentStatusIndex; i < student.length; i++){
            var status = student[i];

            var created_at = new Date(status.created_at);

            if (created_at.getTime() < bucketTime.getTime()){
              previousStatus = status;
              currentStatusIndex = i;
              continue;
            }else{
              bucket[previousStatus.status_id]++;
              previousStatus = null;
              break;
            }
          }

          if (previousStatus) {
            bucket[previousStatus.status_id]++;
          }
        }
      }

      console.log("***** Final Tally ", tally);
      console.log( "Graphing took: ", Date.now() - functionStart, " milliseconds.");
      console.log( POINTS_ON_GRAPH, " points graphed.");
      console.log("Returning: ", {tally: tally, units: units});
      return { data: tally, units: units };
    }

    function setUpdateInterval(interval){
      if(updateInterval) $interval.cancel(updateInterval);

      updateInterval = $interval(function(){
        service.graphData = createTally(service.dataCache);
      }, interval);
    }
  }


  // function createTally (data) {
  //   var functionStart = Date.now();
  //   console.log(data);
  //   var students = Object.keys(data).length
  //   var students = data.students
  //   var timeStart = new Date(data.lecture_start);
  //   var timeEnd = data.lecture_end
  //   var lastDif = timeEnd === null ? new Date(Date.now()) : '...';
  //   var timeArray =[]
  //   var timeData = {};
  //   var tally = {};
  //   var highestDif = 0;
  //   for (var user in students ) {
  //     for (var i = 0; i < students[user].length; i++) {
  //       var dif = (Math.floor((new Date(students[user][i].created_at) - timeStart)/5)) +1
  //       highestDif = highestDif < dif ? dif : highestDif;
  //     }
  //   }
  //
  //
  //   for (var user in students ) {
  //     var oldDif = 1;
  //     for (var i = 0; i < students[user].length; i++) {
  //       var dif = (Math.floor((new Date(students[user][i].created_at) - timeStart)/5)) +1
  //       timeData[dif] = students[user][i].status_id
  //       if(dif - oldDif > 0){
  //         for(var j = oldDif; j < dif; j++){
  //           if(tally[j]){
  //             tally[j][timeData[oldDif]]++;
  //           }else{
  //             tally[j] = {1:0, 2:0, 3:0}
  //             tally[j][timeData[oldDif]]++;
  //           }
  //         }
  //         oldDif = dif;
  //       }
  //     }
  //
  //     // if(tally[dif]){
  //     //   tally[dif][timeData[dif]]++;
  //     // }else{
  //     //   tally[dif] = {1:0, 2:0, 3:0}
  //     //   tally[dif][timeData[dif]]++;
  //     // }
  //
  //
  //     for (var k = dif; k <= highestDif; k++) {
  //       if(tally[k]){
  //         tally[k][timeData[oldDif]]++;
  //       }else{
  //         tally[k] = {1:0, 2:0, 3:0}
  //         tally[k][timeData[oldDif]]++;
  //       }
  //     }
  //
  //   }
  //   // if (lastDif === '...') {
  //   //   tally["..."] = tally[Object.keys(tally).length];
  //   //    tally["end of lecture"] = tally["..."]
  //   // } else {
  //   //   tally['now'] = tally[Object.keys(tally).length]
  //   // }
  //   console.log('ta', tally);
  //   console.log( "Graphing took: ", Date.now() - functionStart, " milliseconds");
  //   return tally
  // }

  function determineGraphInterval(lengthOfLecture){
    var maxIntervals = 30;

    var thirtySeconds = 30000;
    var oneMinute = thirtySeconds * 2;
    var fiveMinutes = oneMinute * 5;
    var tenMinutes = oneMinute * 10;
    var fifteenMinutes = oneMinute * 15;
    var twentyMinutes = oneMinute * 20;
    var twentyFiveMinutes = oneMinute * 25;
    var thirtyMinutes = oneMinute * 30;
    var fourtyFiveMinutes = oneMinute * 45;
    var sixtyMinutes = oneMinute * 60;

    if(lengthOfLecture / thirtySeconds <= maxIntervals) return { milliseconds: thirtySeconds, units: "30 Seconds" };
    if(lengthOfLecture / oneMinute <= maxIntervals) return { milliseconds: oneMinute, units: "1 Minute" };
    if(lengthOfLecture / fiveMinutes <= maxIntervals) return { milliseconds: fiveMinutes, units: "5 Minutes" };
    if(lengthOfLecture / tenMinutes <= maxIntervals) return { milliseconds: tenMinutes, units: "10 Minutes" };
    if(lengthOfLecture / fifteenMinutes <= maxIntervals) return { milliseconds: fifteenMinutes, units: "15 Minutes" };
    if(lengthOfLecture / twentyMinutes <= maxIntervals) return { milliseconds: twentyMinutes, units: "20 Minutes" };
    if(lengthOfLecture / twentyFiveMinutes <= maxIntervals) return { milliseconds: twentyFiveMinutes, units: "25 Minutes" };
    if(lengthOfLecture / thirtyMinutes <= maxIntervals) return { milliseconds: thirtyMinutes, units: "30 Minutes" };
    if(lengthOfLecture / fourtyFiveMinutes <= maxIntervals) return { milliseconds: fourtyFiveMinutes, units: "45 Minutes" };
    return { milliseconds: sixtyMinutes, units: "60 Minutes" };
  }


  function convertToMinutes(milliseconds){
    return (((milliseconds) / 1000) / 60);
  }
}());
