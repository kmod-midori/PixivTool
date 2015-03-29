class PluginProvider
  plugins:[]
  register: (options)->
    @plugins.push options

  filterBy: (host, path, query)->
    @plugins = @plugins.filter (p)-> p.match host,path,query

module.exports = PluginProvider
