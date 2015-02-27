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
    if work.page_count > 1
      app.selected = (true for [1..work.page_count])

    updateStat = ->
      pm.queryId [id],(result)->
        app.downloaded = result[id]

    chrome.storage.onChanged.addListener updateStat
    updateStat()

    download = ->
      getURL = ->
        if work.type is "illustration" and work.page_count is 1
          return [{url:work.image_urls.large, page:0}]

        multi1 = work.type is "illustration" and work.page_count > 1
        multi2 = work.type is "manga"
        if multi1 or multi2
          urls = []
          work.metadata.pages.forEach (page, i)->
            return if !app.selected[i]
            urls.push {url:page.image_urls.large, page:i}
          return urls

        if work.type is "ugoira"
          return [{url:work.metadata.zip_urls.ugoira600x600, page:0}]

      pm.requestDownload (_.cloneDeep work),getURL(),app.settings.filename

    app.download = _.debounce download,1000,{leading:true,trailing:false}

  .fail ->
    app.loadError = 'Load Failed.'
  .always ->
    app.loaded = true
