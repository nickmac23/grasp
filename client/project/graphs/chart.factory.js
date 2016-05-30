(function() {
  'use strict';

  angular.module('panic')
  .factory('ChartFactory', factory)

  // factory.$inject = [ '$rootScope', '$location']

  function factory ($rootScope, $location, $state, $http, API_URL) {
    $rootScope.$on( "$stateChangeSuccess", function(event, next, current) {
    })

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
  }

  function createTally (data) {
    // console.log(data);
    var students = Object.keys(data).length
    var students = data.students
    var timeStart = new Date(data.lecture_start);
    var timeEnd = data.lecture_end
    var lastDif = timeEnd === null ? new Date(Date.now()) : '...';
    var timeArray =[]
    var timeData = {};
    var tally = {};
    var highestDif = 0;
    for (var user in students ) {
      for (var i = 0; i < students[user].length; i++) {
        var dif = (Math.floor((new Date(students[user][i].created_at) - timeStart)/10000)) +1
        highestDif = highestDif < dif ? dif : highestDif;
      }
    }


    for (var user in students ) {
      var oldDif = 1;
      for (var i = 0; i < students[user].length; i++) {
        var dif = (Math.floor((new Date(students[user][i].created_at) - timeStart)/10000)) +1
        timeData[dif] = students[user][i].status_id
        if(dif - oldDif > 0){
          for(var j = oldDif; j < dif; j++){
            if(tally[j]){
              tally[j][timeData[oldDif]]++;
            }else{
              tally[j] = {1:0, 2:0, 3:0}
              tally[j][timeData[oldDif]]++;
            }
          }
          oldDif = dif;
        }
      }

      // if(tally[dif]){
      //   tally[dif][timeData[dif]]++;
      // }else{
      //   tally[dif] = {1:0, 2:0, 3:0}
      //   tally[dif][timeData[dif]]++;
      // }


      for (var k = dif; k <= highestDif; k++) {
        if(tally[k]){
          tally[k][timeData[oldDif]]++;
        }else{
          tally[k] = {1:0, 2:0, 3:0}
          tally[k][timeData[oldDif]]++;
        }
      }

    }
    // if (lastDif === '...') {
    //   tally["..."] = tally[Object.keys(tally).length];
    //    tally["end of lecture"] = tally["..."]
    // } else {
    //   tally['now'] = tally[Object.keys(tally).length]
    // }
    // console.log('ta', tally);

    return tally
  }


}());
