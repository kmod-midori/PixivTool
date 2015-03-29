$ = require 'jquery'
url = require 'url'
qs = require 'querystring'
async = require 'async'
_ = require 'lodash'
pm = require 'shared/pm'
app = require './app'

cargo = async.cargo (ids,cb)->
  pm.queryId ids,cb
,50

getWorkID = (_url)->
  return false if not _url?
  qs.parse(url.parse(_url).query).illust_id

refresh = ->
  idCount = 0
  $('.image-item,.rank-detail,.before,.after').each (i, elem)->
    app.$set 'dlCount',0
    id = getWorkID($(elem).find('a').eq(0).attr('href'))
    return if !id
    idCount++
    cargo.push id,(result)->
      return if !result[id]
      app.$set 'dlCount',app.dlCount + 1
      $(elem).addClass("pxtool-dl-mark")
  app.$set 'idCount',idCount

refresh()
chrome.storage.onChanged.addListener refresh

target = document.querySelector('#illust-recommend')

if target != null
  observer = new MutationObserver(_.throttle(refresh, 1500))
  observer.observe(target, {
    childList: true,
    attributes: true,
    subtree: true
  })
