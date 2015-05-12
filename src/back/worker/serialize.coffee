msgpack = (require 'msgpack5')()
zlib = require 'zlib'

self.onmessage = (e)->
  str = ""

  try
    buf = msgpack.encode e.data
    str = (zlib.deflateSync buf).toString 'base64'
  catch e
    return postMessage(status: 'error', reason: e)

  postMessage(status: 'success', data: str)