var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:19006",
    methods: ["GET", "POST"]
  }
});

app.get('/', function (req, res) {
  res.send('Hello');
});
var players = []

io.on('connection', (socket) => {
  if (players.length === 4) {
    io.to(socket.id).emit('spectator-mode');
  }

  console.log(socket.id+' user connected');
  socket.on("new-table", (data) => {
    socket.broadcast.emit('new-table', data);
    console.log(socket.id + " " + data.currentPlayer + "\n")
    io.emit('current-player-id', { 'id': players[data.currentPlayer % 4] });
  })
  socket.on("handshake", (msg) => {
    let name = msg.name
    if (players.includes(name)) {
      name += "-" +generateBullscheisse().substring(0,5)
      io.to(socket.id).emit('forbidden-name');
    }
    if (name === undefined) {
      name = generateBullscheisse()
      io.to(socket.id).emit('forbidden-name');
    }
    if (players.length === 4) {
      io.to(socket.id).emit('spectator-mode');
    } else {
      players[players.length] = name

      console.log(name + " requared a handshake")
      io.to(socket.id).emit('this-player-id', { 'id': name });

      console.log("players:")
      for (let i = 0; i < (players.length >= 4 ? 4 : players.length); i++) {
        console.log("   " + players[i])
      }
      if (players.length === 4) {
        io.emit('current-player-id', { 'id': players[0] });
      }
    }

  })
  socket.on('disconnect', () => {
    console.log(socket.id + ' user disconnected');
    players = []
    socket.broadcast.emit("game-ended")
  });
});



var os = require('os');
var networkInterfaces = os.networkInterfaces();

http.listen(3000, function () {
  console.log('listening on '+networkInterfaces.Ethernet[1].address+':3000');
});


// https://youtu.be/3hx9d45i1Gs
function generateBullscheisse() {
  let d = new Date().getTime()
  let d2 = (performance && performance.now && (performance.now() * 1000)) || 0;
  return 'xxxxxxxx-xxxx-4xxx'.replace(/[xy]/g, c => {
    let r = Math.random() * 16;
    if (d > 0) {
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
  });
}