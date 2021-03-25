var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index-room.html');
});

var chat = io.of('/chat').on('connection', function(socket) {
    socket.on('login', function(data){
        console.log('User login', data);

        var name = socket.name = data.name;
        var room = socket.room = data.room;
        
        socket.join(room);

        console.log('client:'+name+'님이 ' + room+ ' (으)로 입장');
        chat.to(room).emit('logon', name);
    })

    socket.on('logout', function(data){
        console.log('User logout', data);

        var name = socket.name = data.name;
        var room = socket.room = data.room;
        
        console.log('client:'+name+'님이 ' + room + ' 을(를) 퇴장');
        chat.to(room).emit('logout', name);
        socket.leave(room);
    })

    socket.on('chat message', function(data){
        console.log('message from client : ', data);

        var name = socket.name = data.name;
        var room = socket.room = data.room;
                
        chat.to(room).emit('receive message', data);
    });

});

server.listen(3000, function() {
    console.log('Socket IO Server Listening On Port 3000');
});