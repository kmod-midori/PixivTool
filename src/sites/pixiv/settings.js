exports.name = 'site_pixiv_name';
exports.fields = [{
  name: 'markingEnabled',
  msgid: 'common_mark_downloaded',
  type: 'checkbox'
}, {
  name: 'color',
  msgid: 'common_mark_color',
  type: 'color'
}, {
  name: 'template',
  msgid: 'settings_filename_tmpl',
  type: 'template',
  config: require('./filenameConfig')
}];
exports.defaults = require('./defaults');
exports.ns = 'pixiv';
