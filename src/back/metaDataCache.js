var cache = require('lru-cache')(300);

exports.get = function (key) {
  var value = cache.get(key);
  if (!value) {
    throw new Error(`${key} is not in metadata cache.`);
  }

  return value;
};

exports.set = function (key, value) {
  cache.set(key, value);
};

exports.clear = function () {
  cache.reset();
};
