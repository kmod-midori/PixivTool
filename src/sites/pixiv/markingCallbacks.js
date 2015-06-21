import {
  MatchedElement
} from '../classes/SiteUtils';

exports.init = function (context) {
  var target = document.getElementById('illust-recommend');

  if (target) {
    new MutationObserver(_.throttle(function () {
      context.emit('historyUpdated');
    }, 1500)).observe(target, {
      childList: true,
      subtree: true
    });
  }

  return Promise.resolve();
};

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

exports.getElements = function () {
  var $ = require('jquery');
  var elems = $('.image-item,.rank-detail,.before,.after').map(function () {
    var elem = $(this);
    var id = parseID(elem.find('a').eq(0).attr('href'));
    if (!id) {
      return;
    }

    return new MatchedElement(id, elem);
  }).get();

  if (document.location.pathname === '/member_illust.php') {
    elems.push(new MatchedElement(parseID(document.location), $('.work-info .title')));
  }

  return elems;
};
