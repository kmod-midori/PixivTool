getPages = (work)->
  #Single page
  if work.type is "illustration" and work.page_count is 1
    return [
      {url:work.image_urls.large}
    ]
  
  #Multi page
  multi1 = work.type is "illustration" and work.page_count > 1
  multi2 = work.type is "manga"
  if multi1 or multi2
    return work.metadata.pages.map (page)->
      {url:page.image_urls.large}
  
  #Ugoira
  if work.type is "ugoira"
    delay = work.metadata.frames[0].delay_msec
    return [
      {
        url:work.metadata.zip_urls.ugoira600x600,
        comment:(require 'shared/i18n')('ugoira_zip',[delay])
      }
    ]

fixTime = (t)->
  tz = require 'timezone'
  tz(t, 'Asia/Tokyo')
  
prepareMeta = (work)->
  info = _.omit work,[
    'age_limit'
    'id'
    'book_style'
    'content_type'
    'favorite_id'
    'image_urls'
    'is_liked'
    'metadata'
    'page_count'
    'publicity'
    'stats'
    'is_manga'
  ]
  
  info.user = _.omit info.user,[
    'is_following'
    'is_follower'
    'is_friend'
    'profile_image_urls'
    'is_premium'
    'profile'
    'stats'
  ]
    
  info.created_time = fixTime info.created_time
  info.reuploaded_time = fixTime info.reuploaded_time
  
  return info

module.exports = (id, comm)->
  endpoint =
    "https://public-api.secure.pixiv.net/v1/works/#{id}.json?image_sizes=large"
  (require 'jquery').ajax(endpoint,{
    headers:
      Authorization:"Bearer 8mMXXWT9iuwdJvsVIvQsFYDwuZpRCMePeyagSh30ZdU"
  })
  .done (resp)->
    work = resp.response[0]
    console.log '[Pixiv Tool] Work ',work
    
    pages = getPages work
    
    meta = prepareMeta work
    
    comm.update {
      canDownload:true
      uuid:"pxv+#{id}"
      pages
      meta
    }
    
    