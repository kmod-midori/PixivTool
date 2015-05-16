#region Workers
SerializeWorker = require 'worker!./worker/serialize.coffee'
DeserializeWorker = require 'worker!./worker/deserialize.coffee'
#endregion

processData = (worker, data)->
  new Promise (resolve, reject)->
    w = new worker()

    w.onmessage = (e)->
      result = e.data
      if result.status != 'success'
        return reject(result.reason)

      resolve(result.data)

    w.postMessage data

exports.serialize = processData.bind(null, SerializeWorker)
exports.deserialize = processData.bind(null, DeserializeWorker)