var cache = require('lru-cache')(300);

ctx.messaging.addHandler('meta_cache_get', key=>{
  var value = cache.get(key);
  if (!value) {
    throw new Error(`${key} is not in metadata cache.`);
  }

  return value;
});

ctx.messaging.addHandler('meta_cache_set', req=>{
  return cache.set(req.key, req.value);
});

ctx.messaging.addHandler('meta_cache_clear', ()=>{
  return cache.reset();
});
