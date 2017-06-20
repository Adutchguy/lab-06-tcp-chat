'use strict';

const wack = module.exports = {};
const socket = require('../index.js');
let clientPool = require('../index.js');

socket.on('data', (buffer) => {
  let data = buffer.toString();
  if (data.startsWith('/nick')) {
    socket.nick = data.split('nick ')[1] || socket.nick;
    socket.nick = socket.nick.trim();
    socket.write(`You are now known as ${socket.nick}`);
    return;
  } else if (data.startsWith('/dm')) {
    let message = data.split('/dm ')[1] || '';
    let dmClient = message.split(' ')[0];
    clientPool.forEach((item, i, clientPool) => {
      if(dmClient === clientPool[i].nick) {
        clientPool[i].write(`${socket.nick}: ${message}`);
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
