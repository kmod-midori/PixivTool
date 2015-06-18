/////////////////
// Setup Icons //
/////////////////
ctx.messaging.on('tabSupported', (sid, tid)=>{
  ctx.button.setIcon('icons/active.png', tid);
});

ctx.messaging.on('tabClosed', (sid, tid)=>{
  ctx.button.setIcon('icons/default.png', tid);
});

//////////////////////////
// Setup metadata cache //
//////////////////////////
require('./metaDataCache');
require('./pageMetaCache');

/////////////////////////
// Essential popup API //
/////////////////////////
ctx.messaging.addHandler('get_current_session', ()=>{
  return ctx.tabs.getCurrent().then(ctx.messaging.getSessionId.bind(ctx.messaging));
});

///////////////////
// Import/Export //
///////////////////
ctx.messaging.addHandler('storage_serialize', () => {
  var db = require('./storage');
  return db.loaded.then(function () {
    return db.serialize();
  });
});

ctx.messaging.addHandler('storage_replace', text => {
  return new Promise(resolve=>{
    ctx.storage.lokiAdapter.saveDatabase('loki.db', text, function () {
      window.dbReplaced = true;
      resolve();
      document.location.reload();
    });
  });
});


