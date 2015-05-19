$ = require 'jquery'
qs = require 'querystring'
loc = document.location

exports.match = ->
  if loc.host != 'www.pixiv.net'
    return false
  
  pathBlacklist = [
    'upload.php'
    'event.php'
    'event_detail.php'
    'profile_event.php'
    'event_add.php'
    'info.php'
    'help.php'
    'privacy.php'
    'guideline.php'
    'brand_terms.php'
    'premium.php'
    'msgbox.php'
    'msg_view.php'
    'search_user.php'
  ]
  
  if loc.pathname[1..] in pathBlacklist
    return false
  
  if loc.pathname[1..5] == 'novel' || loc.pathname[1..7] == 'setting'
    return false
  
  return true

exports.run = (comm)->
  (require './marking')(comm)
  
  if loc.pathname == '/member_illust.php'
    query = qs.parse(document.location.search[1..])
    if query.mode == 'medium' and query.illust_id?
      (require './pullMeta')(query.illust_id, comm)