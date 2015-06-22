var map = new Map();

exports.getSession = function (tid) {
  return map.get(tid);
};

ctx.dnode.getServer.then(function (server) {
  server.on('connected', function (sid, tid) {
    if (tid) {
      map.set(tid, sid);
      debug('Tab mapping')('Mapping %s => %s', tid, sid);
    }
  });
  server.on('closed', function (sid, tid) {
    if (tid) {
      map.delete(tid);
      debug('Tab mapping')('Delete map %s => %s', tid, sid);
    }
  });
});
