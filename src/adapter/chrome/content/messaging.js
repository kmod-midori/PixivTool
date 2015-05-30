// Create a random ID for this session.
var sessionId = String.fromCharCode(Date.now() % 25 + 97) +
    Math.random().toString(36).slice(2); // From uBlock

var port = chrome.runtime.connect({name: sessionId}),
channels = [],
// For receiving responses.
resp = new require('events').EventEmitter();

class Channel {
  constructor(name, callback){
    this.name = name;
    this.listener = typeof callback === 'function' ? callback : null;
  }

  send(message,callback){
    message = {
      channel:this.name,
      msg:message
    };

    if (callback) {
      // Generate an unique ID so we can receive response later.
      message.id = _.uniqueId()
      resp.once(message.id,callback)
    }

    port.postMessage(message);
  }
}

/**
 * Get a messaging channel.
 * @param  {String}   name     Channel name. If not existed, it'll be created.
 * @param  {Function} callback
 * @return {Channel}
 */
module.exports = function (name, callback){
  if ( !name ) {
    return;
  }

  if (channels.indexOf(name) == -1) {
    channels[name] = new Channel(name, callback);
  }

  return channels[name];
}
