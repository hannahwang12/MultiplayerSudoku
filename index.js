var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

app.use(express.static('client'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/client/index.html');
});

// app.get('/style.css', function(req, res) {
//   res.sendFile(__dirname + "/" + "style.css");
// });

// app.get('/script.js', function(req, res) {
//   res.sendFile(__dirname + "/" + "script.js");
// });

var playerCount = 0;
var currentGame;

io.on('connection', function (socket) {
  console.log('new player');
  playerCount++;
  console.log(playerCount);
  io.sockets.emit('new player', playerCount);
//  socket.emit('game', { game: 'world' });
  socket.on('new game', function (data) {
  //  io.sockets.emit('existing game', data);
    currentGame = data;
  });
  // socket.on('existing game', function (game) {
  //   io.emit('existing game', game);
  // })
  socket.emit('existing game', currentGame);
  // socket.on('my other event', function (data) {
  //   console.log(data);
  // });
  socket.on('focus', function(id) {
    io.sockets.emit('focus', id);
  });
  socket.on('blur', function(id) {
    io.sockets.emit('blur', id);
  });
  socket.on('input', function(input) {
    console.log(input.id);
    console.log(input.value);
    var i = input.id.charAt(5);
    var j = input.id.charAt(6);
    currentGame.guesses[i][j] = input.value;
    console.log(currentGame.guesses);
    io.sockets.emit('input', input);
  });
  socket.on('disconnect', function () {
    playerCount--;
    console.log(playerCount);
    io.emit('player disconnected', playerCount);
  });
});

server.listen(port, function() {
  console.log('listening on ' + port);
});