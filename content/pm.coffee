exports.dbGet = (key, callback)->
  chrome.runtime.sendMessage {type:'db',op:'get',key},(rep)->
    callback(rep.error, rep.value)

exports.dbPush = (key, value)->
  chrome.runtime.sendMessage {type:'db',op:'push',key,value}

exports.reqDownload = (url, filename)->
  chrome.runtime.sendMessage {type:'download',url,filename}
