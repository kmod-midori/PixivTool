var $ = require('jquery');

var cache = [];

var color = '#FFA07A';

var enabled = false;

var target = document.querySelector('#illust-recommend'), observer;

function checkID(id){
  if (cache.indexOf(id) !== -1) {
    return Promise.resolve(true);
  }
  return ctx.messaging.send('history_id_exist', `pixiv${id}`).then(exist=>{
    if (exist) {
      cache.push(id);
    }
    return exist;
  });
}

function parseID(url){
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

function addClass(elem){
  elem.addClass('pxtool-dl-mark');
}

function mark(){
  $('.image-item,.rank-detail,.before,.after').each(function () {
    var elem = $(this);
    var id = parseID(elem.find('a').eq(0).attr('href'));
    if (!id) {
      return;
    }
    checkID(id).then(exists=>{
      if (exists) {
        addClass(elem);
      }
    });
  });

  $('.work-info .title').each(function () {
    var id = parseID(document.location.search);
    checkID(id).then(exists=>{
      if (exists) {
        addClass($(this));
      }
    });
  });
}

function injectCSS(){
  var cssText = '';
  var el = $('#pxtool-css');
  if (enabled) {
    log.d(color);
    cssText = `
    .pxtool-dl-mark {
      background-color: ${color};
    }
    `;
  }

  if (el.length === 0) {
    el = $('<style id="pxtool-css" type="text/css"></style>').appendTo('head');
  }
  el.html(cssText);
}

if (target) {
  observer = new MutationObserver(_.throttle(function () {
    if (enabled) {
      mark();
    }
  }, 1500));
  observer.observe(target, {
    childList: true,
    subtree: true
  });
}

ctx.messaging.on('historyUpdated', mark);

require('./config')(true, function (config) {
  color = config.color;
  enabled = config.markingEnabled;
  mark();
  injectCSS();
});
