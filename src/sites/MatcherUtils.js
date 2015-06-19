var S = require('string');

exports.hostEquals = function (host) {
  return R.whereEq({
    host
  });
};

exports.pathContains = function (paths) {
  if (!Array.isArray(paths)) {
    paths = [paths];
  }
  return function ({pathname}) {
    pathname = new S(pathname);
    return R.any(pathname.contains.bind(pathname), paths);
  };
};
