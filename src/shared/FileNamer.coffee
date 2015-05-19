mote = require 'mote'
_ = require 'lodash'

escapePath = (str)->str.replace /[\|\\/:*?"<>]/g,'' #" Well..

delim = '__pxtool_path_delim__'

class FileNamer
  constructor:->
    @simpleReplace = []
    @tmpl = mote.compile('')
    
  addSimpleReplace:(pattern, path, desc = '')->
    if _.isArray pattern
      @simpleReplace = _.union @simpleReplace,pattern
    else
      @simpleReplace.push [pattern, match, desc]
      
  compile:(src)->
    #replace / and \ with delim
    src = src.replace /\/|\\/g, delim
    
    @simpleReplace.forEach (repl)->
      src = src.replace repl[0],"{{&#{repl[1]}}}"
      
    @tmpl = mote.compile(src)
    
  render:(data)->
    orig = escapePath @tmpl data
    #http://stackoverflow.com/questions/1144783/replacing-all-occurrences-of-a-string-in-javascript
    orig.split(delim).join('/')
    
module.exports = FileNamer