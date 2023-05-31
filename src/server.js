const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const crypto = require('crypto');

app.use(express.static('public'));

const players = [];

io.on('connection', (socket) => {
  console.log('user ' + socket.id + ' connected');
  players.push(socket);

  if (players.length % 2 === 0) {
    players[0].join('room' + players.length / 2);
    players[1].join('room' + players.length / 2);
    io.in('room' + players.length / 2).emit('start', true);
  }

  socket.on('disconnect', () => {
    console.log('user ' + socket.id + ' disconnected');
  });

  socket.on('updatePaddle', (data) => {
    if (data.player === 'left') {
      leftPaddleY = data.y;
    } else if (data.player === 'right') {
      rightPaddleY = data.y;
    }

    socket.broadcast.emit('updatePaddle', data);
  });
  
});

const port = process.env.PORT || 3000;
http.listen(port, () => {
  console.log(`listening on *:${port}`);
});
