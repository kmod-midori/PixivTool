var Sticky = require('react-sticky');
var PageItem = React.createClass({
  getDefaultProps: function () {
    return {
      onChange: ()=>{},
      checked: false,
      index: 0,
      url: '',
      extData: ''
    };
  },
  render: function () {
    var checkbox = <input
      type="checkbox"
      checked={this.props.checked}
      className="mr-1 p-check"
      onChange={this.props.onChange}/>;
    var urlClass = 'font-10 no-overflow mt-1 font-gray page-url';

    var extStr = this.props.extData ? `(${this.props.extData})` : '';
    return <li className="b-b ml-0 p-li">
      <label className="pd-1">
        {checkbox}
        <span className="md-1">
          {`   P${this.props.index + 1}` + extStr}
        </span>
        <div className={urlClass}>{this.props.url}</div>
        <div className={urlClass}>{this.props.filename}</div>
      </label>
    </li>;
  }
});

module.exports = React.createClass({
  getInitialState: ()=>{
    return {
      selected: [],
      meta: null
    };
  },
  componentDidMount: function(){
    ctx.dnode.getClient().ready.call('getPageCacheAsync', this.props.session).then(meta=>{
      this.setState({
        meta,
        selected: R.range(0, meta.pages.length)
      });
    });
  },
  handleCheck: function (index, e) {
    if (e.target.checked) {
      this.setState({
        selected: R.insert(0, index)(this.state.selected) // Insert
      });
    } else {
      this.setState({
        selected: R.filter(R.complement(R.equals(index)), this.state.selected) // Remove
      });
    }
  },
  selectAll: function () {
    // Set all to selected
    // [1,2,3,....,pages.length - 1]
    this.setState({selected: R.range(0, this.state.meta.pages.length)});
  },
  deselectAll: function () {
    this.setState({selected: []});
  },
  startDownload: function () {
    var helper = require('src/common/DownloadHelper');
    helper.startDownload(this.state.selected, this.props.session);
    helper.addHistory(this.state.meta.id, this.state.meta.work);
    this.deselectAll();
  },
  render: function () {
    var pages, dlCount;
    if (!this.state.meta) {
      return <div>{ctx.m('popup_download_unavail')}</div>;
    }

    pages = this.state.meta.pages.map((page, index)=>{
      return <PageItem key={index}
        index={index}
        url={page.url}
        extData={page.extData}
        filename={page.filename}
        checked={R.contains(index, this.state.selected)}
        onChange={this.handleCheck.bind(this, index)}
        />;
    });

    dlCount = this.state.selected.length;

    return <div>
      <div className="card-box pd-1">
        <Sticky stickyStyle={{}}>
          <button className="button mt-1 button-green" id="btn-download" onClick={this.startDownload}>
            {ctx.m('common_download') + ` (${dlCount})`}
          </button>
        </Sticky>
        <div className="pb-1 pt-1 b-b button-group">
          <button className="button button-small button-green" onClick={this.selectAll}>
            {ctx.m('common_select_all')}
          </button>
          <button className="button button-small button-green" onClick={this.deselectAll}>
            {ctx.m('common_deselect_all')}
          </button>
        </div>
        <ul>{pages}</ul>
      </div>
    </div>;
  }
});
