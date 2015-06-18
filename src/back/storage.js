var Loki = require('lokijs');
var db;

// Extend Prototype
var _get = Loki.prototype.getCollection;
Loki.prototype.getCollection = function(name, options){
  var col = _get.call(this, name);
  if (!col) {
    col = this.addCollection(name, options);
  }
  return col;
};

db = new Loki(null, {
  adapter: ctx.storage.lokiAdapter,
  autosave: true,
  autosaveInterval: 1000
});

db.loaded = new Promise(resolve=>{
  db.loadDatabase({}, resolve);
  // save when unload
  window.addEventListener('unload', db.close.bind(db));
});

module.exports = db;
