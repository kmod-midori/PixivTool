import {
  createObject,
  correctTime,
  Page,
  PageMeta
}
from '../classes/SiteUtils';

exports.getID = function() {
  return /illust_id=(\d+)/.exec(document.location.search)[1];
};

exports.getRawMetadata = function(id, context) {
  var $ = require('jquery');

  var getWorkAPI = Promise.method(function() {
    var endpoint = `https://public-api.secure.pixiv.net/v1/works/${id}.json?image_sizes=large`;

    return $.ajax(endpoint, {
      headers: {
        Authorization: 'Bearer 8mMXXWT9iuwdJvsVIvQsFYDwuZpRCMePeyagSh30ZdU'
      }
    }).then(resp => {
      return resp.response[0];
    });
  });

  /**
   * Full zip URL can't be received from API, so we inject some scirpt to get it
   * @return {Promise}
   */
  var getWorkUgoira = function() {
    return new Promise(function(resolve) {
      window.addEventListener('message', function(msg) {
        var pixivContext;

        if (!msg.data.__context) {
          return;
        }

        pixivContext = msg.data.__context;
        resolve({
          url: pixivContext.ugokuIllustFullscreenData.src,
          delay: pixivContext.ugokuIllustFullscreenData.frames[0].delay
        });
      });

      $.globalEval([
        '"use strict";',
        'window.postMessage({__context: pixiv.context}, "*");'
      ].join('\n'));
    }).then(function(work) {
      return getWorkAPI().then(resp => {
        resp.image_urls = { // eslint-disable-line camelcase
          large: work.url,
          delay: work.delay
        };
        return resp;
      });
    });
  };

  if ($('._ugoku-illust-player-container').length !== 0) {
    return getWorkUgoira();
  } else {
    return getWorkAPI();
  }
};

exports.metaTransform = createObject({
  title: 'title',
  id: 'id',
  caption: 'caption',
  tags: 'tags',
  tools: 'tools',

  user: createObject({
    id: 'user.id',
    account: 'user.account',
    name: 'user.name'
  }),

  /* eslint-disable camelcase */
  created_time: correctTime(['created_time'], 'Asia/Tokyo'),
  reuploaded_time: correctTime(['reuploaded_time'], 'Asia/Tokyo'),
  /* eslint-enable camelcase */

  height: 'height',
  width: 'width'
});

exports.parsePages = function (context, parsed, raw) {
  var createPage = function (page, meta, template) {
    var extData;
    if (page.image_urls.delay) {
      extData = page.image_urls.delay;
    }
    return new Page(page.image_urls.large, context.getFilename(template, meta), extData);
  };

  return context.getConfig().then(function (config) {
    var pages = [];
    // TODO: Clean up here.
    if (raw.metadata) {
      pages = raw.metadata.pages.map(function (page, index) {
        var _meta = R.clone(parsed);

        _meta.pageCount = raw.metadata.pages.length;
        _meta.page = index + 1;

        return createPage(page, _meta, config.template);
      });
    } else {
      pages = (function() {
        var _meta = R.clone(parsed);

        _meta.pageCount = 1;
        _meta.page = 1;
        return [createPage(raw, _meta, config.template)];
      }());
    }

    return new PageMeta(parsed, parsed.id, pages);
  });
};
