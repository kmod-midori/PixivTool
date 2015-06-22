var db = ctx.storage.db('history');
var moment = require('moment-timezone');

exports.count = function () {
  return db.db.container._keys.length;
};

exports.exists = function (id) {
  return db.get(id).then(R.T).catch(R.F);
};

exports.set = function (id, doc) {
  doc.lastSave = Number(moment());
  return db.put(id, doc);
};

ctx.dnode.getServer.then(function (server) {
  db.on('put', _.throttle(function () {
    server.broadcast('historyUpdated');
  }, 1500));
});

///////////////////
// Import/Export //
///////////////////
exports.serialize = function () {
  return new Promise((resolve, reject)=>{
    var ret = [];
    db.createReadStream()
    .on('data', function (data) {
      ret.push({
        type: 'put',
        key: data.key,
        value: data.value
      });
    })
    .on('error', reject)
    .on('end', function () {
      resolve(JSON.stringify(ret));
    });
  });
};

function deleteAll(){
  return new Promise((res, rej)=>{
    var batch = [];
    db.createKeyStream()
    .on('data', function (key) {
      batch.push({
        type: 'del',
        key
      });
    })
    .on('error', rej)
    .on('end', function () {
      db.batch(batch).then(res, rej);
    });
  });
}

exports.replace = function (str) {
  var ops = JSON.parse(str);
  return deleteAll().then(db.batch.bind(db, ops));
};
