var db = ctx.storage.db('history');
var moment = require('moment-timezone');

ctx.messaging.addHandler('history_get_count', ()=>{
  return db.db.container._keys.length;
});

ctx.messaging.addHandler('history_id_exist', (id)=>{
  return db.get(id).then(R.T).catch(R.F);
});

ctx.messaging.addHandler('history_add', doc=>{
  var id = doc.id;
  delete doc.id;
  doc.lastSave = Number(moment());
  return db.put(id, doc).then(function () {
    ctx.messaging.broadcast('historyUpdated');
  });
});

///////////////////
// Import/Export //
///////////////////
ctx.messaging.addHandler('history_serialize', function () {
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
});

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

ctx.messaging.addHandler('history_replace', function(str){
  var ops = JSON.parse(str);
  return deleteAll().then(db.batch.bind(db, ops));
});
