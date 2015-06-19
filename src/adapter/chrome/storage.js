var chromeStorage = require('localstorage-chrome');
var levelup = require('levelup');

exports.getInUse = function () {
  return new Promise((resolve, reject)=>{
    chrome.storage.local.getBytesInUse(null, bytes=>{
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      resolve(bytes);
    });
  });
};

exports.db = function (name) {
  return require('level-promise')(levelup(name, {
    db: chromeStorage,
    valueEncoding: 'json'
  }));
};
