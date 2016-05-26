var io = require('socket.io')();
var knex = require('../db/config');

var i = 0;
var data = null;
var classRosters = {}



io.on('connection', function (socket) {

  socket.on('set', function (data) {
    knex('understandings').insert(data)
    .then( function (res) {
      io.sockets.emit(data.lecture_id, {class: classRosters[data.lecture_id]})
    })
  })
  socket.on('chart', function(data){
    // knex('understandings').insert(data)
    // .then( function (res) {
    //
    // }
    io.sockets.emit(data.lecture_id, data)
  })

    socket.on('disconnect', function(){
      console.log('disconnected');
    });
})

module.exports = io;
