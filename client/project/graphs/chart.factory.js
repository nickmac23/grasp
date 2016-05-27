(function() {
  'use strict';

  angular.module('panic')
  .factory('ChartFactory', factory)

  // factory.$inject = [ '$rootScope', '$location']

  function factory ($rootScope, $location, $state, $http, API_URL) {
    $rootScope.$on( "$stateChangeSuccess", function(event, next, current) {
      ///Nick- do you mean $state.params ... ?
      // console.log('chart.factory', $route.current.params);
    })
    var socket = io.connect('http://Nick-MacBook-Air.local:3000');

    console.log(socket);
    socket.on($state.params.id, function (data) {
      service.dataCache.students[data.user_id].push(data)
      service.graphData = createTally(service.dataCache);
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
  }

  // function createTally (data) {
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
  //     var oldDif = 1;
  //     for (var i = 0; i < students[user].length; i++) {
  //       var dif = (Math.floor((new Date(students[user][i].created_at) - timeStart)/10000)) +1
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
  //     highestDif = highestDif <= dif ? dif : highestDif;
  //
  //     for (var k = dif; k < highestDif; k++) {
  //       if(tally[k]){
  //         tally[k][timeData[oldDif]]++;
  //       }else{
  //         tally[k] = tally[k-1];
  //       }
  //     }
  //
  //   }
    // if (lastDif === '...') {
    //   tally["..."] = tally[Object.keys(tally).length];
    //    tally["end of lecture"] = tally["..."]
    // } else {
    //   tally['now'] = tally[Object.keys(tally).length]
    // }
  //   console.log('ta', tally);
  //
  //   return tally
  // }

  function createTally(data) {
    var students = Object.keys(data).length
    console.log(data);
    var students = data.students
    data.lecture_end = null;
    var timeStart = new Date(data.lecture_start);
    var timeEnd = data.lecture_end ? new Date(data.lecture_end) : new Date(Date.now());
    // var timeEnd = new Date(data.lecture_end) || new Date(Date.now());
    var POINTS_ON_GRAPH = 100;
    var tally = {}

    var timeChangeInMilliseconds = (timeEnd.getTime() - timeStart.getTime());

    console.log( "TimeChangeInMilliseconds: ", timeChangeInMilliseconds);

    // Determine graph interval
    var interval = timeChangeInMilliseconds / POINTS_ON_GRAPH;

    // Build tally buckets
    for (var i = 1; i <= POINTS_ON_GRAPH; i++) {
      tally[i] = {1:0, 2:0, 3:0};
    }

    console.log("Initial tally", tally);

    for (var studentId in students) {
      var student = students[studentId];

      for (var bucketId in tally) {
        var bucket = tally[bucketId];
        var bucketTime = new Date(timeStart.getTime() + (+bucketId * interval));

        var previousStatus = student[0];

        for(var i = 0; i < student.length; i++){
          var status = student[i];

          var created_at = new Date(status.created_at);
          console.log('bucketTime: ', bucketTime);
          console.log('created_at: ', created_at);
          console.log('bucketTime - created_at', (bucketTime - created_at).toString());

          if (created_at.getTime() < bucketTime.getTime()){
            console.log('Setting Prev Status: ', status);
            previousStatus = status;
            continue;
          }else{
            // console.log(previousStatus);
            bucket[previousStatus.status_id]++;
            previousStatus = null;
            break;
          }
          console.log("created_at < bucketTime: ", created_at < bucketTime);
        }

        if (previousStatus) {
          bucket[previousStatus.status_id]++;
        }

        console.log('Bucket', bucket);
      }
    }

    console.log("***** Final Tally ", tally);

    return tally;

  }


  function convertToMinutes(milliseconds){
    console.log(milliseconds);
    return (((milliseconds) / 1000) / 60);
  }
}());
