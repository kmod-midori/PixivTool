var cache = new Map();

ctx.messaging.addHandler('set_metadata', (meta, sid)=>{
  log.d(`Set meta ${sid} => ${meta}`);
  cache.set(sid, meta);
});

ctx.messaging.addHandler('get_metadata', sid=>{
  return cache.get(sid);
});

ctx.messaging.on('tabClosed', sid=>{
  log.d(`Del meta ${sid}`);
  cache.delete(sid);
});
