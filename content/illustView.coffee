app = require './app'
$ = require 'jquery'
qs = require 'querystring'
pm = require './pm'
_ = require 'lodash'

if $('.works_display').length != 0
  app.$set 'illustView',true
  id = qs.parse(document.location.search.substring(1)).illust_id
  endpoint =
    "https://public-api.secure.pixiv.net/v1/works/#{id}.json?image_sizes=large"

  $.ajax(endpoint,{
    headers:
      Authorization:"Bearer 8mMXXWT9iuwdJvsVIvQsFYDwuZpRCMePeyagSh30ZdU"
  })
  .done (resp)->
    if resp.status != 'success'
      return app.loadError = 'Load Failed.'
    work = resp.response[0]
    app.workInfo = work
    if work.is_manga
      app.selected = (true for [1..work.page_count])

    pm.dbGet id,(err)-> app.downloaded = !err
    setInterval (->pm.dbGet id,(err)-> app.downloaded = !err),3000

    download = ->
      w = {
        id:work.id
        title:work.title
        user:_.clone work.user
        tags:work.tags
        tools:work.tools
        date:work.created_time
        isMulti:work.is_manga
        page:{
          count:work.page_count
        }
      }
      gf = require 'global/gen-filename'
      w.page.orig = 0
      if !work.is_manga
        pm.reqDownload work.image_urls.large,(gf app.settings.filename,w).result
        pm.dbPush id,w

    app.download = _.debounce download,20000,{
      leading:true,trailing:false
      }

  .fail ->
    app.loadError = 'Load Failed.'
  .always ->
    app.loaded = true
