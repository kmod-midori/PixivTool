import {
  hostEquals, pathContains
}
from '../MatcherUtils';

import {
  Page,
  PageMeta,
  MatchedElement
} from '../classes/SiteUtils';

module.exports = {
  name: 'site_cosp_name',
  namespace: 'cosp',
  config: [{
    name: 'template',
    msgid: 'settings_filename_tmpl',
    type: 'template',
    default: '{{coser.name}} - {{character}} ({{id}}@{{coser.id}})'
  }],
  template: {
    keys: [
      {
        path: '{{coser.name}}',
        msgid: 'settings_illust_id'
      },
      {
        path: '{{coser.id}}',
        msgid: 'settings_illust_title'
      },
      {
        path: '{{title}}',
        msgid: 'site_pixiv_illust_tags'
      }
    ],
    example: {
      id: '1234567',
      coser: {
        id: '12345',
        name: 'Coser'
      },
      character: '博麗霊夢',
      title: '東方Project'
    }
  },
  marking: true,
  defaultMarkColor: '#FFA07A',
  enableCondition: [
    hostEquals('cosp.jp')
  ],
  downloadableCondition: [
    pathContains('view_photo.aspx')
  ],
  downloadCallbacks: {
    getID(){
      return /id=(\d+)/.exec(document.location.search)[1];
    },
    getRawMetadata(id){
      var $ = require('jquery');
      var meta = {
        id
      };

      const TYPES = {
        1: 'coser',
        2: 'title',
        3: 'character',
        4: 'place',
        5: 'event',
        6: 'variation',
        7: 'camera',
        8: 'lens',
        9: 'photographer',
        10: 'situation'
      };

      $('a').filter(function () {
        var elem = $(this);
        return /photo_search\.aspx/.exec(elem.attr('href'));
      }).each(function () {
        var elem = $(this);
        var type = TYPES[parseInt(/\?n(\d+)=/.exec(elem.attr('href'))[1])];
        var content = elem.html();

        if (type === 'photographer') { // Fix pg
          content = elem.prev('a').html();
        }

        if (type === 'coser') {
          content = {
            name: elem.html(),
            id: /\?n1=(\d+)/.exec(elem.attr('href'))[1]
          };
        }

        meta[type] = content;

      });
      return meta;
    },
    metaTransform: R.identity,
    parsePages(context, meta){
      var $ = require('jquery');
      return context.getConfig().then(function (config) {
        return new PageMeta(meta, meta.id, [
          new Page($('#imgView').attr('src'), context.getFilename(config.template, meta))
        ]);
      });
    }
  },
  markingCallbacks: {
    init(context) {
      var observer;
      if (['/photo_search.aspx', '/mylist_photo.aspx', '/view_photo.aspx'].indexOf(document.location.pathname) === -1) {
        return Promise.reject();
      }

      observer = new MutationObserver(_.throttle(function () {
        context.emit('historyUpdated');
      }, 1500));
      observer.observe(document, {
        childList: true,
        subtree: true
      });

      return Promise.resolve();
    },
    getElements(){
      var $ = require('jquery');
      var elems = [];
      if (document.location.pathname === '/view_photo.aspx') {
        return [
          new MatchedElement(/id=(\d+)/.exec(document.location.search)[1], $('body'))
        ];
      } else if (document.location.pathname === '/mylist_photo.aspx') {
        return $('a').map(function () {
          var elem = $(this);
          var id = /view_photo\.aspx\?id=(\d+)/.exec(elem.attr('href'));
          if (!id) {
            return;
          } else {
            id = id[1];
          }

          return new MatchedElement(id, elem.closest('table'));
        }).get();
      }

      return $('.cosphoto').map(function () {
        var elem = $(this);
        var links = elem.find('a'), id;
        if (links.length === 0) { // Empty
          return;
        }

        id = links.filter(function () {
          return /view_photo\.aspx/.exec($(this).attr('href'));
        }).eq(0).attr('href').match(/id=(\d+)/)[1];
        return new MatchedElement(id, elem);
      }).get();
    }
  }
};
