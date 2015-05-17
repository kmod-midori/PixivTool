ctx = require.context("./sites", true, /site\.coffee$/)

connected = false

for sitePath in ctx.keys()
  do (sitePath)->
    site = ctx(sitePath)
    Promise.try(site.match)
    .then (matched)->
      if matched
        console.info "[Pixiv Tool] Starting #{sitePath}"
        
        if !connected
          chrome.runtime.connect()
        
        site.run(require './popup_comm')
    .catch (err)->
      console.error "[Pixiv Tool] Match error in #{sitePath}: #{err}"