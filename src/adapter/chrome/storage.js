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

exports.lokiAdapter = {
  loadDatabase: function (dbname, callback) {
    callback = callback || log.d;
    chrome.storage.local.get(dbname, dat=>{
      var dbStr;
      if (chrome.runtime.lastError) {
        return callback(chrome.runtime.lastError);
      }
      dbStr = dat[dbname] || null;
      callback(dbStr);
    });
  },
  saveDatabase: function (dbname, serialized, callback) {
    var obj = {};
    callback = callback || function(){};
    obj[dbname] = serialized;
    if (window.dbReplaced) {
      return callback();
    }
    chrome.storage.local.set(obj, callback);
  }
};
