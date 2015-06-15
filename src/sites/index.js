var context, sites = {};

log.d('Loading sites...');

require('val!./load');

/**
 * Context of the sites
 * @see {@link http://webpack.github.io/docs/context.html}
 * @type {WebpackContext}
 */
context = require.context('.', true, /[^\.]\/index\.js$/);

log.d(`Found ${context.keys().length} site(s).`);

context.keys().forEach(function (mo) {
  sites[mo] = context(mo); // Require every module and create a map.
});

module.exports = sites;
