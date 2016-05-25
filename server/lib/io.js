var io = require('socket.io')();
var knex = require('../db/config');

var i = 0;
var data = null;
var array = [];

function lectureData (lectureId){
  var check = false;
  array = [];
  return knex('understandings').where({lecture_id: lectureId})
  .innerJoin('understanding_statuses', 'understandings.status_id', 'understanding_statuses.id')
  .then(function(res) {
    var str = '' + res[0].created_at
    str = str.split(' ')
    console.log(str[4]);
    array.push({time: str[4],
                roster: [{user_id: res[0].user_id,
                          status_id: res[0].status_id
                        }]
              })
    for (var i = 1; i < res.length; i++) {
      check = false
      str = '' + res[i].created_at
      str = str.split(' ')
      for (var j = 0; j < array.length; j++) {
        console.log(array[j].time == str[4]);
        if (array[j].time == str[4]) {
          array[j].roster.push({user_id: res[i].user_id,
                    status_id: res[i].status_id
                  })
          check = true
        }
      }
      if (!check) {
        array.push({time: res[i].created_at,
                    roster: [{user_id: res[i].user_id,
                              status_id: res[i].status_id
                            }]
                  })
      }
    }
    return array
  })
}
function lectureUpdate (data){
  knex('understandings').where({lecture_id: data.lectureId})
  .innerJoin('understanding_statuses', 'understandings.status_id', 'understanding_statuses.id')
  .then(function(understandings) {
  })
}
// every time a socket connection is made, this function is called
io.on('connection', function (socket) {

  socket.on('set', function (lectureId) {
    lectureData(lectureId).then( function (res) {
      // console.log(res);
      socket.emit(lectureId, res)
    })
  })

  socket.on('chart', function(data){
    // lectureUpdate(data).then( function (res) {
    //   io.sockets.emit(data.lectureId, data)
    // })
  })

    socket.on('disconnect', function(){
      console.log('disconnected');
    });
})

module.exports = io;
