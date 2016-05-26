var io = require('socket.io')();
var knex = require('../db/config');

var i = 0;
var data = null;
var array = [];

// every time a socket connection is made, this function is called
io.on('connection', function (socket) {

  socket.on('set', function (lectureId) {
    // lectureData(lectureId).then( function (res) {
      // console.log(res);
      socket.emit(lectureId, lectureId)
    // })
    })

  socket.on('chart', function(data){
    console.log(data.lectureId);
    socket.emit(2, data)
  })

    socket.on('disconnect', function(){
      console.log('disconnected');
    });
})

module.exports = io;
