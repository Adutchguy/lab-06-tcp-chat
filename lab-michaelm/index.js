'use strict';

const net = require('net');
const server = module.exports = net.createServer();
const wack = require('./modules/wack.js');

let clientPool = [];

const ClientPool = function(socket, nick) {

};

server.on('connection', (socket) => {
  socket.write(`Welcome socket, to Miller Chat.\n`);
  console.log(`${socket.nick} connected!`);

  clientPool = [...clientPool, socket];

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
    } else if (data.startsWith('/dm')) {
      let message = data.split('/dm ')[1].trim() || '';
      let dmClient = message.split(' ')[0] || '';
      let messageText = message.split(`${dmClient} `)[1] || '';
      socket.write(`${socket.nick}: @${dmClient}(${messageText})`);
      clientPool.forEach((item, i, clientPool) => {
        if(dmClient === clientPool[i].nick) {
          clientPool[i].write(`${socket.nick}: @${dmClient}(${messageText})`);
          return;
        }
      });
    } else {
      clientPool.forEach((item) => {
        item.write(`${socket.nick}: ${data}`);
        return;
      });
    }
  });
});



server.listen(3000, () => {
  console.log(`Opened server on`, server.address(() => {
    return this[2];
  }));
});
