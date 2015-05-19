path = require 'path'
through = require 'through2'
gutil = require 'gulp-util'
_ = require 'lodash'
PluginError = gutil.PluginError

parsePlaceholder = (message)->
  refs = []
  matchCount = 0
  message = message.replace /\$(\d+:)?(\w+)\$/g, (_unused, order, ref) ->
    matchCount++
    if order
      order = parseInt(order)
    else
      order = matchCount
    refs[order] = ref
    return '$' + ref + '$'

  if not matchCount
    placeholders = undefined
  else
    placeholders = {}
    for i in [0...refs.length]
      placeholder = refs[i] ? ('_unused_' + i)
      placeholders[placeholder] = {content: '$' + i}

  return placeholders

module.exports = ->
  files = []
  first = null
  
  bufferContents = (file, enc, cb)->
    return cb() if file.isNull()
    
    
    if file.isStream()
      @emit 'error',new PluginError 'json2crx','Streaming not supported'
      return cb()
    
    if !first
      first = file
      
    content = {}
    
    try
      content = JSON.parse file.contents
    catch e
      @emit 'error',new PluginError 'json2crx','Invalid JSON in ' + file.path
      return cb()
    
    files.push {id:path.basename(file.path,path.extname(file.path)),content}
    cb()
    
  endStream = (cb)->
    if !first
      return cb()
    
    locales = {}
    
    for f in files
      _.forOwn f.content,(message, msgid)->
        _.forOwn message,(str, lang)->
          _.set locales,[lang,"#{f.id}_#{msgid}",'message'],str
          _.set locales,[lang,"#{f.id}_#{msgid}",'placeholders'],parsePlaceholder str
          
    _.forOwn locales,(content, name)->
      outFile = first.clone({ contents: false })
      outFile.path = path.join(first.base, name, 'messages.json')
      outFile.contents = new Buffer JSON.stringify content
      @push outFile
    ,this
        
    cb()
    
  through.obj(bufferContents, endStream)
      