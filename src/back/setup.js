/////////////////
// Setup Icons //
/////////////////
ctx.messaging.on('tabSupported', (sid, tid) => {
  ctx.button.setIcon('icons/active.png', tid);
});

ctx.messaging.on('tabClosed', (sid, tid) => {
  ctx.button.setIcon('icons/default.png', tid);
});

//////////////////////////
// Setup metadata cache //
//////////////////////////
require('./metaDataCache');
require('./pageMetaCache');

///////////////////////////
// Setup history storage //
///////////////////////////
require('./historyStorage');

///////////////////////////
// Setup config storage //
///////////////////////////
require('./configStorage');

/////////////////////////
// Essential popup API //
/////////////////////////
ctx.messaging.addHandler('get_current_session', () => {
  return ctx.tabs.getCurrent().then(ctx.messaging.getSessionId.bind(ctx.messaging));
});

ctx.messaging.addHandler('start_download', req=>{
  var path = require('path');
  req.pages.forEach(p=>{
    var ext = path.extname(p.url);
    var fname = p.filename + ext;
    ctx.download.start(p.url, fname, [
      {
        name: 'X-PxTool-Referer',
        value: req.ref
      }
    ]);
  });
});

////////////////////////////////
// Essential Options Page API //
////////////////////////////////
ctx.messaging.addHandler('storage_get_space', () => {
  return ctx.storage.getInUse();
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


////////////////////
// Network Helper //
////////////////////
(function() {
  var {browser} = require('bowser');
  if (browser.chrome || browser.opera) {
    chrome.webRequest.onBeforeSendHeaders.addListener(function (details) {
      var headers = details.requestHeaders.map(header=>{
        if (header.name !== 'X-PxTool-Referer') {
          return header;
        }
        header.name = 'Referer';
        return header;
      });
      return {requestHeaders: headers};
    }, {
      urls: ['<all_urls>'],
      tabId: -1
    }, ['blocking', 'requestHeaders']);
  }
}());
