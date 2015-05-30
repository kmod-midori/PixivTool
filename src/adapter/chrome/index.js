var exp = {}

if (!chrome.tabs) { // For content script, because chrome.tab is unavailable here.
  _.assign(exp,{
    messaging:require('./content/messaging')
  });
}

// Common
_.assign(exp,{
  i18n:chrome.i18n.getMessage
})

module.exports = exp;
