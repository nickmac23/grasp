var io = require('socket.io')();
var knex = require('../db/config');

var i = 0;
var data = null;



io.on('connection', function (socket) {

  socket.on('set', function (data) {
    console.log(data);
    knex('understandings').insert(data)
    .then( function (res) {
      io.sockets.emit(data.lecture_id, {class: data.user_id})
    })
  })
  socket.on('chart', function(data){

    knex('understandings').insert({user_id: data.user_id, lecture_id: data.lecture_id, status_id: data.status_id})
    .then( function (res) {
      io.sockets.emit(data.lecture_id, data)
    })
  })

    socket.on('disconnect', function(){
      console.log('disconnected');
    });
})

module.exports = io;
