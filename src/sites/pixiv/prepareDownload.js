module.exports = function(context, config) {
  var $ = require('jquery');
  var id = /illust_id=(\d+)/.exec(document.location.search)[1];

  function getWorkAPI() {
    var endpoint = `https://public-api.secure.pixiv.net/v1/works/${id}.json?image_sizes=large`;
    return Promise.try(function() {
      return $.ajax(endpoint, {
        headers: {
          Authorization: 'Bearer 8mMXXWT9iuwdJvsVIvQsFYDwuZpRCMePeyagSh30ZdU'
        }
      }).then(resp => {
        return resp.response[0];
      });
    });
  }

  function getWorkUgoira() {
    return new Promise((resolve, reject) => {
      window.addEventListener('message', msg => {
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
      $.globalEval(`
        "use strict";
        window.postMessage({__context: pixiv.context}, '*');
        `);
    }).then(work => {
      return getWorkAPI(id).then(resp => {
        resp.image_urls = { // eslint-disable-line camelcase
          large: work.url,
          delay: work.delay
        };
        return resp;
      });
    });
  }

  function getWork() {
    return context.getCached(id).catch(function() {
      var work;
      log.d('Cache Miss');
      if ($('._ugoku-illust-player-container').length !== 0) {
        work = getWorkUgoira();
      } else {
        work = getWorkAPI();
      }
      return work.tap(w => {
        context.setCache(id, w);
      });
    });
  }

  getWork().then(require('./workParser')).then(parsed => {
    var pages = parsed.pages.map((page, i) => {
      var p = R.clone(parsed.meta);

      p.id = id;
      p.pageCount = parsed.pages.length;
      p.page = i + 1;

      page.filename = context.getFilename(config.template, p);
      return page;
    });

    var pageMeta = {
      work: parsed.meta,
      id: `pixiv${id}`,
      pages: pages,
      referer: document.location.toString(),
      copyright: null
    };

    context.postMeta(pageMeta);
  });
};
