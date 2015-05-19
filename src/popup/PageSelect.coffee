React = require 'react'
i18n = require 'shared/i18n'

{div, a, ul, li, label, input, span, button} = React.DOM

PageItem = React.createClass {
  getDefaultProps: ->
    {
      changeHandler:->
      checked: false
    }
  render: ->
    checkbox = input({
      type:'checkbox',
      checked:@props.checked,
      className:'mr-1 p-check',
      onChange:@props.changeHandler
    })
    urlAttr = {
      className:'font-10 no-overflow mt-1 font-gray page-url'
    }
    
    (li {className:'b-b ml-0 p-li'},[
        (label {className:'pd-1'},[
          checkbox
          (span {className:'ml-1'},["P#{@props.index + 1}"])
          (div urlAttr,[@props.url])
        ])
        
    ])
}

module.exports = React.createClass {
  getInitialState: ->
    deselected:[]
    
  handleChange:(idx, e)->
    if e.target.checked
      @setState {deselected:_.pull @state.deselected,idx}
    else
      d = _.clone @state.deselected
      d.push idx
      @setState {deselected:d}
      
  startDownload:->
    pages = _.clone @props.pages
    console.log pages
    return if pages.length is 0
    @deselectAll()
    
  selectAll:->
    @setState {deselected:[]}
    
  deselectAll:->
    #Set all to deselected
    # [1,2,3,....,pages.length - 1]
    @setState {deselected:_.range @props.pages.length}
    
      
  render: ->
    items = for page,i in @props.pages
      React.createElement(PageItem, {
        changeHandler:@handleChange.bind(this,i)
        checked:i not in @state.deselected
        url:page.url
        index:i
      })
    
    dlCount = @props.pages.length - @state.deselected.length
    
    (div {},[
      (div {className:'card-box pd-1'},[
        (div {className:"pb-1 b-b button-group"},[
          (button {className:'button button-small button-green',onClick:@selectAll},[i18n 'select_all'])
          (button {className:'button button-small button-green',onClick:@deselectAll},[i18n 'deselect_all'])
        ])
        (ul {},items)
      ])
      (button {
        className:'button mt-1 button-green' + (if dlCount is 0 then " disabled" else ""),
        id:'btn-download',
        onClick:@startDownload
      },["#{i18n 'download'} (#{dlCount})"])
    ])
}