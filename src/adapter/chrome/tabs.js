exports.getCurrent = function () {
  return new Promise(resolve=>{
    chrome.tabs.query({active: true, currentWindow: true}, tabs=>{
      var curr = tabs[0];
      resolve(curr ? curr.id : null);
    });
  });
};
