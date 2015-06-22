exports.start = (url, filename, headers)=>{
  debug('Download')(url, filename, headers);
  chrome.downloads.download({
    url,
    filename,
    headers
  });
};
