path = require 'path'
module.exports = (emitter)->
  emitter.on 'download',(req, rep)->
    console.log req.filename + path.extname(req.url)
    chrome.downloads.download({
      url:req.url
      filename:req.filename + path.extname(req.url)
    })
