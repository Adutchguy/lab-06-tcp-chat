'use strict';

module.exports = function ClientPool(socket, nick, clientNum) {
  this.socket = socket;
  this.nick = nick;
  this.clientNum = clientNum;
};
