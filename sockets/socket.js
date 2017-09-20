module.exports = function (io) {
  io.on('connection', function(socket) { 
    socket.on('search result', function(search){
      // console.log("content in socket is: " + search);
      io.emit('search result', search);
    });
  }); 
}