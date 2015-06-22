var methods = {};

// Debug
require('src/common/debug');

// Icons
require('./icons');

/////////////////////////
// Work metadata cache //
/////////////////////////
{
  let cache = require('./metaDataCache');
  methods.getWorkCache = cache.get;
  methods.setWorkCache = cache.set;
  methods.clearWorkCache = cache.clear;
}

/////////////////////////
// Page metadata cache //
/////////////////////////
{
  let cache = require('./pageMetaCache');
  methods.getPageCache = cache.get;
  methods.setPageCache = cache.set;
}

/////////////////////
// History storage //
/////////////////////
{
  let storage = require('./historyStorage');
  methods.historyCount = storage.count;
  methods.historyExists = storage.exists;
  methods.historyAdd = storage.set;
  methods.historyBackup = storage.serialize;
  methods.historyRestore = storage.replace;
}

////////////////////
// Config storage //
////////////////////
{
  let storage = require('./configStorage');
  methods.configGet = storage.get;
  methods.configSet = storage.set;
}

/////////////////
// Downloading //
/////////////////
methods.startDownload = require('./download').start;

methods.getUsedStroage = function () {
  return ctx.storage.getInUse();
};

require('./tabsMap.js');
methods.getCurrentSession = function () {
  return ctx.tabs.getCurrent().then(require('./tabsMap.js').getSession);
};


// Start server
ctx.dnode.createServer(methods);
