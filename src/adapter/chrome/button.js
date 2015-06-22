exports.setIcon = (url, tabId)=>{
  chrome.browserAction.setIcon({path: {38: url}, tabId}, ()=>{
    if (chrome.runtime.lastError) {
      debug('Icon')('Error Set', chrome.runtime.lastError);
    }
  });
};
