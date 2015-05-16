manager = require './TabManager'
rpc = require './RpcServer'

class TabMetaService
  constructor:->
    @metas = new Map()

  setMeta:(id,meta)=>
    @metas.set id,meta

  delMeta:(id)=>
    @metas.delete id

  getMeta:(id)=>
    @metas.get id

module.exports = service = new TabMetaService()

manager.on 'tabDisconnect',service.delMeta

rpc.addMethod 'tabMeta.set', rpc.targets.Tab, (param, senderId)->
  service.setMeta senderId, param.meta

rpc.addMethod 'tabMeta.get', rpc.targets.Tab | rpc.targets.Popup, (param)->
  service.getMeta param.id
