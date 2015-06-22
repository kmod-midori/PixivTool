exports.start = function(selected, sid) {
  var pageMeta = require('./pageMetaCache').get(sid),
    pages = [];
  var path = require('path');
  if (R.isNil(selected)) {
    selected = R.range(0, pageMeta.pages.length);
  }

  selected.forEach(function(i) {
    pages.push(pageMeta.pages[i]);
  });

  pages.forEach(function(page) {
    var ext = path.extname(page.url);
    var fname = page.filename + ext;

    ctx.download.start(page.url, fname, [{
      name: 'X-PxTool-Referer',
      value: pageMeta.referer
    }]);
  });
};

// Network Helper
(function() {
  var {
    browser
  } = require('bowser');
  if (browser.chrome || browser.opera) {
    chrome.webRequest.onBeforeSendHeaders.addListener(function(details) {
      var headers = details.requestHeaders.map(header => {
        if (header.name !== 'X-PxTool-Referer') {
          return header;
        }
        header.name = 'Referer';
        return header;
      });
      return {
        requestHeaders: headers
      };
    }, {
      urls: ['<all_urls>'],
      tabId: -1
    }, ['blocking', 'requestHeaders']);
  }
}());
