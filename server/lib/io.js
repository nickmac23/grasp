var io = require('socket.io')();
var knex = require('../db/config');

var i = 0;
var data = null;
var array = [];

function lectureData (lectureId){
  return 1
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
    // lectureData(lectureId).then( function (res) {
      // console.log(res);
      socket.emit(lectureId, lectureId)
    // })
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
