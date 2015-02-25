path = require 'path'
_ = require 'lodash'
gf = require '../genFilename'
history = require './history'
tz = require 'timezone'

removeFields = (x)->
  x._v = 1
  x = _.omit x,[
    'image_urls',
    'stats',
    'publicity',
    'age_limit',
    'is_manga',
    'is_liked',
    'favorite_id',
    'book_style',
    'metadata',
    'content_type'
    ]
  x.user = _.omit x.user,[
    'is_following'
    'is_follower'
    'is_friend'
    'profile_image_urls'
  ]
  x

module.exports = (data)->
  paths = for url in data.urls
    w = _.clone data.work
    w.page = {
      count:w.page_count
      orig:url[1]
    }
    chrome.downloads.download({
      url:url[0]
      filename:path.join 'pixiv',
        (gf data.tmpl,w).result + path.extname(url[0])
    })
  data.work.created_time = tz(data.work.created_time, 'Asia/Tokyo')
  data.work.reuploaded_time = tz(data.work.reuploaded_time, 'Asia/Tokyo')
  data.work.saved_time = tz(Date.now())
  history.add(data.work.id, removeFields data.work)
