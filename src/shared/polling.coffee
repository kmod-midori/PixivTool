exports.poll = (interval, callback)->
  id = null

  clear = -> clearInterval id

  id = setInterval callback.bind(this,clear),interval

  callback.apply(this,[clear])

  return
