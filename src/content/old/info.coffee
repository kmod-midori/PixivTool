module.exports = {
  data:
    settings:
      bgColor:{}
    illustView:false
    downloaded:false
    loaded:false
    loadError:""
    workInfo:false
  computed:
    isMulti:->
      return false if !@workInfo
      @workInfo.page_count > 1
}
