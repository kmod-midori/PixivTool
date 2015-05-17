React = require 'react'

Navbar = require './Navbar'
Messages = require './Messages'
PageSelect = require './PageSelect'

{div} = React.DOM

App = React.createClass
  displayName:'App'
  getInitialState:->
    {
      tabId:0
      ready:false
      messages:{}
      tabData:{}
    }
  render: ->
    div {},[
      React.createElement(Navbar, {tabId: @state.tabId, ready: @state.ready})
      (div {style:margin:'10px'},[ #content
        React.createElement(Messages,{ready: @state.ready, messages:@state.tabData.messages || []})
        (if @state.tabData.canDownload then React.createElement PageSelect,{pages:@state.tabData.pages})
      ])
    ]

module.exports = React.render React.createElement(App,null),document.getElementById('popup')
