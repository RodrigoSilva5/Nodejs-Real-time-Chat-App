const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const PORT = process.env.PORT || 3000
const { Server } = require("socket.io");
const io = new Server(server);


app.get('/', (req, res) => {
    // path to html
  res.sendFile(__dirname + '/public/index.html');
});
// socket.io start
io.on('connection', (socket) => {
  console.log('a user connected');
  const {nickname} = socket.handshake.query
  io.emit('user-enter', nickname)
//   msg
socket.on('msg', (objeto) => {
    const {autor, msg} = objeto
    console.log(`mensagem de ${autor} recebida: ${msg}`)
    io.emit('chat-msg', objeto )
 })
// typing
socket.on('typing', () => {
    io.emit('user-typing', nickname)
    console.log('usuario digitando ', nickname)
})

//   disconnect
socket.on('disconnect', (a) => {
    console.log(`${nickname} disconnect`)
    io.emit("user-left", nickname)
})
});
// socket.io finish


// server listening
server.listen(PORT, () => {
  console.log(`server listening *${PORT}`);
});