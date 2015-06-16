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
