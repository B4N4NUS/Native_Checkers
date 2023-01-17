var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:19006",
    methods: ["GET", "POST"]
  }
});

app.get('/', function (req, res) {
  res.send('ABOBA');
});


var players = []
var playerNames = []
var queue = []
var queueNames = []
var names = []



// Если подключился пользователь
io.on('connection', (socket) => {
  // Если игроки уже забиты
  if (players.length === 4) {
    // io.to(socket.id).emit('spectator-mode');
    io.to(socket.id).emit('wait');
  }

  console.log("\n[Update] "+socket.id + ' user connected\n');

  // Скидываем всем подключенным пользователям информацию о поле
  socket.on("new-table", (data) => {
    socket.broadcast.emit('new-table', data);
    io.emit('current-player-id', { 'id': playerNames[data.currentPlayer % 4] });
    if (data.ended) {
      for (let i = 0; i < players.length; i++) {
        io.to(players[i]).emit("game-ended-piecefully")
      }
    }
    console.log("[Update] Sended players new table")
  })

  // Если пользователь попросил хендшейк
  socket.on("handshake", (msg) => {
    let name = msg.name
    // Если такое имя уже было
    if (names.includes(name)) {
      name += "-" + generateBullscheisse().substring(0, 5)
      io.to(socket.id).emit('forbidden-name');
    }
    if (name === undefined) {
      name = generateBullscheisse()
      io.to(socket.id).emit('forbidden-name');
    }
    names[names.length] = name

    // Если игроки забиты
    if (players.length === 4) {
      // io.to(socket.id).emit('spectator-mode');
      // Переводим пользователя в очередь
      io.to(socket.id).emit('wait');
      queue[queue.length] = socket.id
      queueNames[queueNames.length] = name

      // Возвращаем ему его имя
      console.log("[Update] "+socket.id + " " + name + " requared a handshake [QUEUE]")
      io.to(socket.id).emit('this-player-id', { 'id': name });
    } else {
      // Добавляем в игроков
      players[players.length] = socket.id
      playerNames[playerNames.length] = name

      // Возвращаем ему его имя
      console.log("[Update] "+socket.id + " " + name + " requared a handshake [PLAYER]")
      io.to(socket.id).emit('this-player-id', { 'id': name });

      // Если этот игрок был последним нужным, стартуем игру
      if (players.length === 4) {
        for (let i = 0; i < players.length; i++) {
          io.to(players[i]).emit("wake-up")
        }
        io.emit('current-player-id', { 'id': playerNames[0] });
      }
    }

    // Выводим всех нынешних игроков
    console.log("[Status] playerNames:")
    for (let i = 0; i < (players.length >= 4 ? 4 : players.length); i++) {
      console.log("[Status]    " + playerNames[i])
    }
    // Выводим всех игроков в очереди
    console.log("[Status] queueNames:")
    for (let i = 0; i < (queue.length >= 4 ? 4 : queue.length); i++) {
      console.log("[Status]    " + queueNames[i])
    }

  })

  // Если кто-то отключился
  socket.on('disconnect', () => {

    // Если отключился игрок
    if (players.includes(socket.id)) {
      console.log("[Update] "+socket.id + ' player disconnected');
      playerNames.splice(players.indexOf(socket.id), 1)
      players.splice(players.indexOf(socket.id), 1)

      for (let i = 0; i < players.length; i++) {
        io.to(players[i]).emit("game-ended")
        if (io.sockets.sockets.get(players[i])) {
          io.sockets.sockets.get(players[i]).disconnect()
        }
      }
      players = []
      playerNames = []
      console.log("[Reseting] Sended old players info about game status")
    }
    // Если отключился зритель
    if (queue.includes(socket.id)) {
      console.log("[Update] "+socket.id + ' queue disconnected');
      queueNames.splice(queue.indexOf(socket.id), 1)
      queue.splice(queue.indexOf(socket.id), 1)
    }
    // Если игроков больше нет
    if (players.length === 0) {
      console.log("[Reseting] Old players disconnected, sending queue to play");
      players = queue.slice(0, 4)
      queue = queue.splice(0, 4)

      playerNames = queueNames.slice(0, 4)
      queueNames = queueNames.splice(0, 4)

      if (players.length === 4) {
        for (let i = 0; i < players.length; i++) {
          io.to(players[i]).emit("wake-up")
        }
        io.emit('current-player-id', { 'id': playerNames[0] });
      }
      for (let i = 0; i < players.length; i++) {
        io.to(players[i]).emit("reset")
      }
      return
    }
  });
});


// Поднимаем сервак
var os = require('os');
var networkInterfaces = os.networkInterfaces();

http.listen(3000, function () {
  console.log('[INFO] Server is running on: [' + networkInterfaces.Ethernet[1].address + ':3000]');
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