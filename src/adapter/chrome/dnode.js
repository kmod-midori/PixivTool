var proto = require('dnode-protocol');
var {EventEmitter} = require('events');
var _client = null;
var _emitter = new EventEmitter();

function initMethods(methods, sid, tid){
  var actualMethods = {};

  R.toPairs(methods).forEach(function (pair) {
    actualMethods[pair[0]] = function () {
      var args = Array.prototype.slice.call(arguments), callback = function () {};

      if (typeof args[args.length - 1] == 'function') {
        callback = args.pop();
      }
      args.push(sid);
      args.push(tid);

      Promise.try(pair[1], args).nodeify(callback);
    };
  });

  return actualMethods;
}

exports.createServer = function (methods) {
  var emitter = new EventEmitter();
  var clients = new Map();

  chrome.runtime.onConnect.addListener(function (port) {
    var sid = port.name;
    var tid = port.sender.tab && port.sender.tab.id;
    var server = proto(initMethods(methods, sid, tid));

    server.on('request', port.postMessage.bind(port));
    server.on('remote', function (remote) {
      clients.set(sid, remote);
      emitter.emit('connected', sid, tid);
    });
    port.onMessage.addListener(server.handle.bind(server));
    port.onDisconnect.addListener(function () {
      clients.delete(sid);
      emitter.emit('closed', sid, tid);
    });

    server.start();
  });

  emitter.broadcast = function (...args) {
    clients.forEach(function (client) {
      client.emit.apply(client, args);
    });
  };
  _emitter.emit('serverReady', emitter);
  return emitter;
};

exports.getServer = new Promise(function (resolve) {
  _emitter.on('serverReady', resolve);
});

function createClient(){
  var emitter = new EventEmitter();
  var sid = String.fromCharCode(Date.now() % 25 + 97) + Math.random().toString(36).slice(2);
  var port = chrome.runtime.connect({name: sid});

  var client = proto({
    emit: emitter.emit.bind(emitter)
  });

  client.on('request', port.postMessage.bind(port));
  port.onMessage.addListener(client.handle.bind(client));

  client.start();

  emitter.ready = new Promise(function (resolve) {
    client.on('remote', function (remote) {
      Promise.promisifyAll(remote);
      resolve(remote);
    });
  });

  return emitter;
}

exports.getClient = function () {
  if (!_client) {
    _client = createClient();
  }
  return _client;
};
