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
      deselected: [],
      meta: null
    };
  },
  componentDidMount: function(){
    ctx.messaging.send('get_metadata', this.props.session).then(meta=>{
      this.setState({meta});
    });
  },
  handleCheck: function (index, e) {
    if (e.target.checked) {
      this.setState({
        deselected: R.filter(R.complement(R.equals(index)), this.state.deselected) // Remove
      });
    } else {
      this.setState({
        deselected: R.insert(0, index)(this.state.deselected) // Insert
      });
    }
  },
  selectAll: function () {
    this.setState({deselected: []});
  },
  deselectAll: function () {
    // Set all to deselected
    // [1,2,3,....,pages.length - 1]
    this.setState({deselected: R.range(0, this.state.meta.pages.length)});
  },
  startDownload: function () {
    var pages = R.clone(this.state.meta.pages);
    _.pullAt(pages, this.state.deselected);
    ctx.messaging.send('start_download', {
      pages,
      ref: this.state.meta.referer
    });
    ctx.messaging.send('history_add', {
      id: this.state.meta.id,
      dat: this.state.meta.work
    });
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
        checked={!R.contains(index, this.state.deselected)}
        onChange={this.handleCheck.bind(this, index)}
        />;
    });

    dlCount = this.state.meta.pages.length - this.state.deselected.length;

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
