'use strict';

const net = require('net');
const server = net.createServer();
const wack = require('./modules/wack.js');

const ClientPool = function() {

};

server.on('connection', (socket) => {
  socket.write(`Welcome socket, to Miller Chat.\n`);
  console.log(`${socket.nick} connected!`);

  let handleDisconnect = () => {
    console.log(`${socket.nick} left the chat`);
    clientPool = clientPool.filter(item => item !== socket);
  };

  socket.on('error', handleDisconnect);
  socket.on('close', handleDisconnect);

  socket.on('data', (buffer) => {
    let data = buffer.toString();
    if (data.startsWith('/nick')) {
      socket.nick = data.split('nick ')[1] || socket.nick;
      socket.nick = socket.nick.trim();
      socket.write(`You are now known as ${socket.nick}`);
      return;
    }

    if(data.startsWith('/dm')[1] || '') {
      let content = data.split('/dm')[1] || ''
    }

    clientPool.forEach((item) => {
      item.write(`${socket.nick}: ${data}`);
    });
  });
});



server.listen(3000, () => {
  console.log(`Opened server on port 3000`);
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.log('Address in use, retrying...');
    setTimeout(() => {
      server.close();
      server.listen(3000);
    }, 1000);
  }
});
