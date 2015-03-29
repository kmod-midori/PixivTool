plugins = require 'plugin/load'

loc = document.location
qs = require 'querystring'
plugins.filterBy loc.host,loc.pathname,qs.parse(loc.search.substring(1))
