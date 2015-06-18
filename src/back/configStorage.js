var db = require('./storage');

db.loaded.then(function () {
  var col = db.getCollection('config', {
    indices: ['ns']
  });

  ctx.messaging.addHandler('config_get', ns=>{
    var row = col.find({ns})[0] || {};
    return row.data;
  });
  ctx.messaging.addHandler('config_set', req=>{
    var doc = col.find({ns: req.ns})[0];
    if (doc) {
      // Merge
      doc.data = req.data;
      col.update(doc);
    } else {
      doc = {
        ns: req.ns,
        data: req.data
      };
      col.insert(doc);
    }
    ctx.messaging.broadcast('configUpdated:' + req.ns);
  });
});
