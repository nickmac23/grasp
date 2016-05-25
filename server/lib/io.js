
var io = require('socket.io')();

var i = 0;
var data = null;
var lectureRoute;
// every time a socket connection is made, this function is called
io.on('connection', function (socket) {

  socket.on('set', function (lectureId) {
    lectureRoute = lectureId
    socket.emit(lectureRoute, data)
  })

  socket.on('chart', function(lectureId){
    lectureRoute = lectureId
    data = {}
    data.d = Math.floor(Math.random() * (30 - 0 + 1) + 0)
    data.n = Math.floor(Math.random() * (30 - 0 + 1) + 0)
    data.g = Math.floor(Math.random() * (30 - 0 + 1) + 0)
    data.time = i
    i += 10
    io.sockets.emit(lectureRoute, data)
  })

    socket.on('disconnect', function(){
      console.log('disconnected');
    });
})

module.exports = io;
