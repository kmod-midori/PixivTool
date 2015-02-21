$ = require 'jquery'
url = require 'url'
qs = require 'querystring'
pm = require './pm'
app = require './app'

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
    pm.dbGet id,(err)->
      return if err
      app.$set 'dlCount',app.dlCount + 1
      $(elem).addClass("pxtool-dl-mark")
  app.$set 'idCount',idCount

setInterval refresh,3000
refresh()

target = document.querySelector('#illust-recommend')

if target is not null
  observer = new MutationObserver(_.throttle(refresh, 1500))
  observer.observe(target, {
    childList: true,
    attributes: true,
    subtree: true
  })
