msgpack = (require 'msgpack5')()
zlib = require 'zlib'

self.onmessage = (e)->
  obj = {}

  try
    buf = zlib.inflateSync(new Buffer(e.data,'base64'))
    obj = msgpack.decode buf
  catch e
    return postMessage(status: 'error', reason: e)

  postMessage(status: 'success', data: obj)
