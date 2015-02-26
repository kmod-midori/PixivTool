app = require './app'
$ = require 'jquery'
qs = require 'querystring'
pm = require '../pm'
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
    console.log 'WORK',_.cloneDeep work
    if work.is_manga
      app.selected = (true for [1..work.page_count])

    updateStat = ->
      pm.queryId [id],(result)->
        app.downloaded = result[id]

    chrome.storage.onChanged.addListener updateStat
    updateStat()
    download = ->
      url = []
      #FIXME Can't download multi page illustration with type 'illustration'
      switch work.type
        when "illustration"
          url[0] = [work.image_urls.large, 0]
        when "manga"
          work.metadata.pages.forEach (page, i)->
            return if !app.selected[i]
            url.push [page.image_urls.large,i]
        when "ugoira"
          url[0] = [work.metadata.zip_urls.ugoira600x600, 0]
      pm.requestDownload (_.cloneDeep work),url,app.settings.filename

    app.download = _.debounce download,1000,{
      leading:true,trailing:false
      }

  .fail ->
    app.loadError = 'Load Failed.'
  .always ->
    app.loaded = true
