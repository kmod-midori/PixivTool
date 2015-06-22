var db = ctx.storage.db('config');

exports.get = function (ns) {
  return db.get(ns).catch(function (err) {
    if (err.notFound) {
      return {};
    }
    throw err;
  });
};

exports.set = function (ns, config) {
  return db.put(ns, config);
};

ctx.dnode.getServer.then(function (server) {
  db.on('put', function (key, value) {
    server.broadcast('configUpdated:' + key, value);
  });
});
