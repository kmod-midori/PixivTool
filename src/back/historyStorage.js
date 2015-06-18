var db = require('./storage');
var moment = require('moment-timezone');

db.loaded.then(function () {
  // Only register handler after db is loaded.
  var col = db.getCollection('history', {
    indices: ['id']
  });
  ctx.messaging.addHandler('history_get_count', ()=>{
    return col.find().length;
  });

  ctx.messaging.addHandler('history_id_exist', (id)=>{
    return col.find({id}).length !== 0;
  });

  ctx.messaging.addHandler('history_add', doc=>{
    (col.find({id: doc.id}) || []).forEach(col.remove.bind(col));
    doc.lastSave = Number(moment());
    col.insert(doc);
    ctx.messaging.broadcast('historyUpdated');
    return;
  });
});
