var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http, {path: '/io'});
var loki = require('lokijs');
var db = new loki('storage.json');
var messages;

db.loadDatabase({},function(){
		messages = db.getCollection('messages');
		if (messages){
			console.log('db loaded');
		} else {
			messages = db.addCollection('messages');
			console.log('db initialized');
		} 
});



var z = {
	
	connect: function(socket){
		console.log('user connected');
		var msgs = messages.data;//.map(function(a){return [a.source, a.message, a.timestamp];});
		z.sendinfo(msgs);
		socket.on('refresh', z.sendinfo);		
	},
	
	sendinfo: function(msg){
    		console.log('message: ' + msg);
			io.emit('showinfo',msg);		
	},
	
	persist: function(src, msg){
		messages.insert({timestamp:new Date(), message: msg, source: src});
		db.save();
	}
};

io.on('connection', z.connect);

app.use('/', express.static('client'));

app.get('/persist', function(req, res){
	z.persist(req.query.src, req.query.msg);
  	z.sendinfo([{message: req.query.msg, source: req.query.src, timestamp: new Date()}]);
  	res.sendStatus(200);
});

http.listen(process.env.PORT, function(){ console.log('Listening on ' + process.env.PORT); });

