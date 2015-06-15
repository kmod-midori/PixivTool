exports.setIcon = (url, tabId)=>{
  chrome.browserAction.setIcon({path: {38: url}, tabId}, ()=>{
    if (chrome.runtime.lastError) {
      log.d('Set icon error ', chrome.runtime.lastError);
    }
  });
};
