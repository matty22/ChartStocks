module.exports = function (io) {
  io.on('connection', function(socket) { 
    socket.on('search result', function(search){
      io.emit('search result', search);
    });
  }); 
}