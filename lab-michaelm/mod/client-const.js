'use strict';

module.exports = function ClientPool(socket, nick, clientNum) {
  this.socket = socket;
  this.nick = nick || clientNum;
  this.clientNum = clientNum;
};
