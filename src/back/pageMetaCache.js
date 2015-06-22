var cache = new Map();

exports.set = function (data, sid) {
  debug('Page Meta:set')(sid, data);
  cache.set(sid, data);
};

exports.get = function (sid) {
  return cache.get(sid);
};

ctx.dnode.getServer.then(function (server) {
  server.on('closed', function (sid) {
    debug('Page Meta:delete')(sid);
    cache.delete(sid);
  });
});
