log.d('Loading sites...');

/**
 * Context of the sites
 * @see {@link http://webpack.github.io/docs/context.html}
 * @type {WebpackContext}
 */
var context = require.context(".", true, /[^\.]\/index\.js$/);

log.d(`Found ${context.keys().length} site(s).`)

var sites = {};

context.keys().forEach(function (mo) {
  sites[mo] = context(mo);
})

module.exports = sites;
