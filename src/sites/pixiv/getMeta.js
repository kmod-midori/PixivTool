var $ = require('jquery');

var getMetaAPI = (id)=>{
  var endpoint = `https://public-api.secure.pixiv.net/v1/works/${id}.json?image_sizes=large`;
  return $.ajax(endpoint, {
    headers: {
      Authorization: 'Bearer 8mMXXWT9iuwdJvsVIvQsFYDwuZpRCMePeyagSh30ZdU'
    }
  }).then(resp=>{
    return resp.response[0];
  });
};

var getMetaUgoira = (id)=>{
  return new Promise((resolve, reject)=>{
    window.addEventListener('message', msg=>{
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
  }).then(work=>{
    return getMetaAPI(id).then(resp=>{
      resp.image_urls = { // eslint-disable-line camelcase
        large: work.url,
        delay: work.delay
      };
      return resp;
    });
  });
};

var run = (id, conf)=>{
  ctx.messaging.send('meta_cache_get', `pixiv${id}`).then(work=>{
    log.d('Cache hit');
    return work;
  }).catch(()=>{
    var meta = null;
    log.d('Cache miss');
    if ($('._ugoku-illust-player-container').length !== 0) {
      meta = getMetaUgoira(id);
    } else {
      meta = getMetaAPI(id);
    }
    return meta.then(require('./workParser'));
  }).then(parsed=>{
    var pageMeta = {
      work: parsed.meta,
      id: `pixiv${id}`,
      pages: parsed.pages,
      referer: document.location.toString(),
      copyright: null
    };
    var FileNamer = require('src/common/FilenameGenerator');
    var namer = new FileNamer(
      R.assoc('template', conf.template, require('./filenameConfig'))
    );

    ctx.messaging.send('meta_cache_set', {
      key: `pixiv${id}`,
      value: parsed
    }, false);

    pageMeta.pages = pageMeta.pages.map((p, i)=>{
      var meta = R.clone(parsed.meta);

      meta.id = id;
      meta.pageCount = pageMeta.pages.length;

      meta.page = i + 1;

      p.filename = namer.render(meta);
      return p;
    });
    ctx.messaging.send('set_metadata', pageMeta, false);

    log.d('META', pageMeta);
  });
};

module.exports = (id)=>{
  require('./config')(false, run.bind(this, id));
};
