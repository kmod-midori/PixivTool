if (DEBUG) {
  require('./debug');
}

/**
 * Debug log
 * @return {void}
 */
exports.d = function() {
  if (DEBUG) {
    console.log.apply(console, arguments);
  }
};

/**
 * Production log
 * @return {void}
 */
exports.i = function () {
  console.log.apply(console, arguments);
};
