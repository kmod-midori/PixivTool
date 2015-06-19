import {
  hostEquals, pathContains
}
from '../MatcherUtils';

module.exports = {
  name: 'site_pixiv_name',
  namespace: 'pixiv',
  config: [{
    name: 'markingEnabled',
    msgid: 'common_mark_downloaded',
    type: 'checkbox',
    default: true
  }, {
    name: 'color',
    msgid: 'common_mark_color',
    type: 'color',
    default: '#FFA07A'
  }, {
    name: 'template',
    msgid: 'settings_filename_tmpl',
    type: 'template',
    default: '{{user.name}} - {{title}} ({{id}}@{{user.id}})[{{tags_9}}]?[ {{page}}P]?'
  }],
  template: require('./template'),
  enableCondition: [
    hostEquals('www.pixiv.net'),
    R.complement(pathContains([
      'upload.php',
      'event.php',
      'event_detail.php',
      'profile_event.php',
      'event_add.php',
      'info.php',
      'help.php',
      'privacy.php',
      'guideline.php',
      'brand_terms.php',
      'premium.php',
      'msgbox.php',
      'msg_view.php',
      'search_user.php',
      'novel',
      'setting'
    ]))
  ],
  downloadableCondition: [
    pathContains('member_illust.php'),
    R.where({
      search: R.allPass([
        R.test(/mode=medium/),
        R.test(/illust_id=\d+/)
      ])
    })
  ],
  prepareDownload: function (context) {
    var prep = require('./prepareDownload').bind(this, context);
    context.getConfig().then(prep);
    context.on('configUpdated', prep);
  },
  run: require('./mark')
};
