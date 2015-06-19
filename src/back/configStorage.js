var db = ctx.storage.db('config');

ctx.messaging.addHandler('config_get', ns=>{
  return db.get(ns).catch(err=>{
    if (err.notFound) {
      return {};
    }
    throw err;
  });
});

ctx.messaging.addHandler('config_set', req=>{
  return db.put(req.ns, req.data).then(function () {
    ctx.messaging.broadcast('configUpdated:' + req.ns, req.data);
  });
});
