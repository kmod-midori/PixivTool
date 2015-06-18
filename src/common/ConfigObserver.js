module.exports = function (namespace, defaults, listen, callback) {
  var merge = R.merge(defaults);
  var updated = function () {
    ctx.messaging.send('config_get', namespace).then(conf=>{
      conf = merge(conf || {});
      log.d('CONF', conf);
      callback(conf);
    });
  };
  if (listen) {
    ctx.messaging.on(`configUpdated:${namespace}`, updated);
  }
  updated();
};
