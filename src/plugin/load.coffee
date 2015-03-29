req = require.context './sites',true,/\/index\.(coffee|js)$/
provider = new (require './provider')
for plugin in req.keys()
  (req plugin)(provider)
module.exports = provider
