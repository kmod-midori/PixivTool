msgpack = (require 'msgpack5')()
BSON = require("bson").BSONPure.BSON
zlib = require 'zlib'

data = JSON.parse (require 'fs').readFileSync './export.json'

out_dat = []

for id,dat of data
  dat = zlib.inflateSync new Buffer dat,'base64'
  out_dat.push [id,BSON.deserialize dat]

buf = msgpack.encode out_dat

str = (zlib.deflateSync buf).toString 'base64'

(require 'fs').writeFileSync 'out.msgpack',str