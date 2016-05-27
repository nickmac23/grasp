(function() {
  'use strict';

  angular.module('panic')
  .factory('ChartFactory', factory)

  // factory.$inject = [ '$rootScope', '$location']

  function factory ($rootScope, $location, $state, $http, API_URL) {
    $rootScope.$on( "$stateChangeSuccess", function(event, next, current) {
      console.log('chart.factory', $route.current.params);
    })
    var socket = io.connect('http://Nick-MacBook-Air.local:3000');

    console.log(socket);
    socket.on($state.params.id, function (data) {
      console.log(service.dataCache);
      service.dataCache.students[data.user_id].push(data)
      service.graphData = createTally(service.dataCache);
      $rootScope.$broadcast(data.lecture_id, {'hi':"hi"})
      console.log('socket');
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

  function createTally (data) {
    var students = Object.keys(data).length
    var students = data.students
    var timeStart = new Date(data.lecture_start);
    var timeEnd = data.lecture_end
    var lastDif = timeEnd === null ? new Date(Date.now()) : '...';
    var timeArray =[]
    var timeData = {};
    var tally = {};
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
      if(tally[dif]){
        tally[dif][timeData[dif]]++;
      }else{
        tally[dif] = {1:0, 2:0, 3:0}
        tally[dif][timeData[dif]]++;
      }
    }
    if (lastDif === '...') {
      tally["..."] = tally[Object.keys(tally).length];
       tally["end of lecture"] = tally["..."]
    } else {
      tally['now'] = tally[Object.keys(tally).length]
    }

    return tally
  }


}());
