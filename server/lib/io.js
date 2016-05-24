
var io = require('socket.io')();

var i = 0;
var data = null;
// every time a socket connection is made, this function is called
io.on('connection', function (socket) {
  console.log('connection');
  socket.emit('pie', data)
  socket.on('chart', function (d) {
    data = {};
    data.d = Math.floor(Math.random() * (30 - 0 + 1) + 0)
    data.n = Math.floor(Math.random() * (30 - 0 + 1) + 0)
    data.g = Math.floor(Math.random() * (30 - 0 + 1) + 0)
    data.time = i
    io.sockets.emit('pie', data)
    i += 10
  })


    socket.on('disconnect', function(){
      console.log('disconnected');
    });
})

module.exports = io;
