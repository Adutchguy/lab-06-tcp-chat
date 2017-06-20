'use strict';

const net = require('net');
const server = module.exports = net.createServer();

let clientPool = [];
let guestNum = 0;

server.on('connection', (socket) => {

  socket.nick = `Guest_${guestNum += 1}`;
  clientPool = [...clientPool, socket];

  clientPool.forEach((item, i, clientPool) => {
    if (item.nick === socket.nick) {
      item.write(`\nWelcome ${clientPool[i].nick}, to Miller Chat.`);
      return;
    } else if (item.nick !== socket.nick) {
      item.write(`\n${socket.nick} has connected.`);
    }
  });
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

    if (data.startsWith('/dm')) {
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
    }
    let dataPrefix = data.split(' ')[0];
    console.log(dataPrefix);
    if(dataPrefix !== '/dm' && dataPrefix !== '/troll' && dataPrefix !== '/nick' && dataPrefix !== '/quit') {
      clientPool.forEach((item) => {
        item.write(`${socket.nick}: ${data}`);
        return;
      });
    }
    let endSocketMsg = 'You have left Miller chat.';
    if(data.startsWith('/quit')) {
      clientPool.forEach(() => {
        if(socket.nick) {
          socket.end(endSocketMsg);
        }
      });
    }

    if(data.startsWith('/troll')) {
      let message = data.split('/troll ')[1].trim() || '';
      let numOfTroll = message.split(' ')[0] || '';
      let messageText = message.split(`${numOfTroll} `)[1] || '';
      socket.write(`${socket.nick}: ${messageText}`);
      for(let i = 0 ; i < numOfTroll ; i++)() => {
        if(socket.nick !== clientPool[i].nick) {
          socket.write(`${socket.nick}: (${messageText})`);
        }
      };
      return;
    }
  });
});

server.listen(3000, () => {
  console.log(`Opened server on`, server.address(() => {
    return this[2];
  }));
});
