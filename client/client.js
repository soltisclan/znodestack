/* global io, window, $*/

var socket;

$(".connect").on("click", function(){
  socket  = io.connect('http://' + window.location.host, {path: '/io', reconnection:false, 'forceNew': true});

  socket.on('connect', function(){  
    $('.connect').prop('disabled', true);
    $('p').remove();
  });
 
  socket.on('disconnect', function(){
    $('.connect').prop('disabled', false);
  });
 
  //socket.emit('refresh', {refresh:true});
  
  socket.on('showinfo', function(msg){
      console.log('message received');
      for (var i=0;i<msg.length;i++){
        var d = new Date(msg[i].timestamp);
        $('body').append('<p>' + d.toLocaleDateString() + ' ' + d.toLocaleTimeString() + ' <b>' + msg[i].source + '</b>: <i>' + msg[i].message + '</i></p>');
      }
  }); 
});
  
     