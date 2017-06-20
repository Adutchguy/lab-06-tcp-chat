'use strict';

const net = require('net');
const server = module.exports = net.createServer();
const ClientPool = require('./mod/client-const.js');

let clientPool = module.exports = [];

server.on('connection', (socket) => {
  let randomInt = Math.ceil((Math.random() * 100));

  let client = new ClientPool(socket,null, randomInt);

  client.nick = `Guest_${client.clientNum}`;
  clientPool = [...clientPool, client];

  clientPool.forEach((item, i, clientPool) => {
    if (item.nick === client.nick) {
      item.socket.write(`\nWelcome ${clientPool[i].nick}, to Miller Chat.\n`);
      return;
    } else if (item.socket.nick !== client.nick) {
      item.socket.write(`\n${client.nick} has connected.\n`);
    }
  });
  console.log(`${client.nick} connected!`);


  let handleDisconnect = () => {
    console.log(`${client.nick} left the chat`);
    clientPool = clientPool.filter(item => item.socket !== client);
  };

  socket.on('error', handleDisconnect);
  socket.on('close', handleDisconnect);

  socket.on('data', (buffer) => {
    let data = buffer.toString();

    if (data.startsWith('/nick')) {
      client.nick = data.split('nick ')[1] || client.nick;
      client.nick = client.nick.trim();
      socket.write(`You are now known as ${client.nick}\n`);
      return;
    }

    if (data.startsWith('/dm')) {
      let message = data.split('/dm ')[1].trim() || '';
      let dmClient = message.split(' ')[0] || '';
      let messageText = message.split(`${dmClient} `)[1] || '';
      socket.write(`${client.nick}: @${dmClient}(${messageText})`);
      clientPool.forEach((item, i, clientPool) => {
        if(dmClient === clientPool[i].nick) {
          item.socket.write(`${client.nick}: @${dmClient}(${messageText})\n`);
          return;
        }
      });
    }

    let dataPrefix = data.split(' ')[0];
    if(dataPrefix !== '/dm' && dataPrefix !== '/troll' && dataPrefix !== '/nick' && dataPrefix !== '/quit') {
      clientPool.forEach((item) => {
        item.socket.write(`${client.nick}: ${data}`);
        return;
      });
    }

    let endSocketMsg = 'You have left Miller chat.\n';
    if(data.startsWith('/quit')) {
      clientPool.forEach((item, i, clientPool) => {
        if(client.nick === clientPool[i].nick) {
          item.socket.end(endSocketMsg);
        }
      });
    }

    if(data.startsWith('/troll')) {
      let message = data.split('/troll ')[1].trim() || '';
      let numOfTroll = message.split(' ')[0] || '';
      let messageText = message.split(`${numOfTroll} `)[1] || '';
      socket.write(`${client.nick}: ${messageText}`);
      clientPool.forEach((item, i, clientPool) => {
        let j = 0;
        while(j < numOfTroll) () => {
          if(client.socket !== clientPool[i].socket) {
            client.socket.write(`${client.nick}: (${messageText})\n`);
            i++;
          }
        };
      });
      return;
    }
  });
});

server.listen(3000, () => {
  console.log(`Opened server on`, server.address(() => {
    return this[2];
  }));
});
