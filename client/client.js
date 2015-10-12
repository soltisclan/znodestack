/* global io, window, $*/

var socket;

$(".connect").on("click", function(){
  socket  = io.connect('http://' + window.location.host, {path: '/io'});
  socket.emit('refresh', {refresh:true});
  console.log('refresh requested');
  
  socket.on('showinfo', function(msg){
      console.log('message received');
      for (var i=0;i<msg.length;i++){
        $('body').append('<p>' + msg[i].timestamp + ' ' + msg[i].source + ':' + msg[i].message + '</p>');
      }
  }); 
});
  
     