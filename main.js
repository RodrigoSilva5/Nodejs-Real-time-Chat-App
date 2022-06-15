const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const PORT = process.env.PORT || 3000
const { Server } = require("socket.io");
const io = new Server(server);


app.use(express.static("public"))
app.get('/', (req, res) => {
    // path to html
  res.sendFile(__dirname + '/public/index.html');
});

// socket.io start
let onlineList = []
io.on('connection', (socket) => {
  console.log('a user connected');
  const {nickname} = socket.handshake.query
  // onlinelist
  onlineList.push(nickname)
  io.emit('online-list', onlineList)
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
    console.log(`${nickname} disconnect`);
    
    onlineList.splice(onlineList.indexOf(nickname), 1);
    console.log(`${onlineList} lista de pessoas online`);
    io.emit('online-list', onlineList);
    io.emit("user-left", nickname);
})
});
// socket.io finish


// server listening
server.listen(PORT, () => {
  console.log(`server listening *${PORT}`);
});