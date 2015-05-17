React = require 'react'
i18n = require 'shared/i18n'

{div, a} = React.DOM

module.exports = React.createClass {
  render: ->
    (div {className:'nav ' + (if @props.ready then 'nav-green' else 'nav-blue')},[
      (a {className:'nav-item nav-head'},["#{i18n 'app_name'}@#{@props.tabId}"])
      (a {className:'nav-item'},[i18n 'settings'])
      (a {className:'nav-item'},[i18n 'purge_meta_cache'])
    ])
}
