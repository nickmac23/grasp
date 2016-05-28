var io = require('socket.io')();
var knex = require('../db/config');

var i = 0;
var data = null;



io.on('connection', function (socket) {

  socket.on('chart', function(data){
    console.log(data);
    knex('understandings').insert(data)
    .returning('*')
    .then( function (res) {
      io.sockets.emit(data.lecture_id, res[0])
    })
  })

    socket.on('disconnect', function(){
      console.log('disconnected');
    });
})

module.exports = io;
