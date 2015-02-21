levelup = require('levelup')
leveljs = require('level-js')

module.exports = (emitter)->
  db = levelup('history', { db: leveljs, valueEncoding: 'json' })
  emitter.on 'db',(req, rep)->
    handlers = {
      get:->
        db.get req.key,(err,val)->
          if err
            rep(error:err)
          else
            rep(value:val)
      push:->
        db.put req.key,req.value,->
    }

    handlers[req.op]()
