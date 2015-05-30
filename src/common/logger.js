exports.d = function() {
  if (DEBUG) {
    console.log.apply(console,arguments);
  }
}
