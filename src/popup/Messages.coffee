React = require 'react'
{div} = React.DOM
i18n = require 'shared/i18n'

module.exports = React.createClass {
  render: ->
    msgs = @props.messages
    
    if !@props.ready
      msgs.push {color:'blue',text:i18n 'popup_inactive'}
    
    div {className:'mb-1'}, msgs.map (msg)->
      div {className:"msg msg-#{msg.color}"},[msg.text]
    
}
