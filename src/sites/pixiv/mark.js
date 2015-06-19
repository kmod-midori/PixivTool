module.exports = function (context) {
  var $ = require('jquery');
  var enabled = false;

  function parseID(url) {
    var match;
    if (!url) {
      return;
    }
    match = /illust_id=(\d+)/.exec(url);
    if (!match) {
      return;
    }
    return match[1];
  }

  function updateClass(id, elem) {
    context.isDownloaded(id).then(function (exist) {
      if (exist) {
        elem.addClass('pxtool-dl-mark');
      }
    });
  }

  function updateMark() {
    if (!enabled) {
      return;
    }

    $('.image-item,.rank-detail,.before,.after').each(function () {
      var elem = $(this);
      var id = parseID(elem.find('a').eq(0).attr('href'));
      if (!id) {
        return;
      }
      updateClass(id, elem);
    });

    $('.work-info .title').each(function () {
      var id = parseID(document.location.search);
      updateClass(id, $(this));
    });
  }

  function updateConfig(conf) {
    enabled = conf.markingEnabled;
    context.injectCSS(enabled, conf.color);
  }

  function startObserve(target) {
    var observer = new MutationObserver(_.throttle(function () {
      updateMark();
    }, 1500));
    observer.observe(target, {
      childList: true,
      subtree: true
    });
  }

  context.getConfig().then(updateConfig).then(updateMark);
  context.on('configUpdated', updateConfig);
  context.on('historyUpdated', updateMark);
};
