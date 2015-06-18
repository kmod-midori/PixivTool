import Template from './Template';

module.exports = React.createClass({
  getInitialState: function() {
    return {
      data: {},
      dirty: false,
      loaded: false,
      valid: false
    };
  },
  handleChange: function (name, e) {
    var value;
    if (e.target.type === 'checkbox') {
      value = e.target.checked;
    } else {
      value = e.target.value;
    }
    this.setState({
      data: R.assoc(name, value, this.state.data),
      dirty: true
    });
    log.d('NEW', R.assoc(name, value, this.state.data));
  },
  componentDidMount: function() {
    require('src/common/ConfigObserver')(this.props.ns, this.props.defaults, false, data=>{
      this.setState({
        data,
        loaded: true
      });
    });
  },
  save: function () {
    if (!this.state.dirty || !this.isValid()) {
      return;
    }
    ctx.messaging.send('config_set', {
      ns: this.props.ns,
      data: this.state.data
    }).then(()=>{
      this.setState({dirty: false});
    });
  },
  isValid: function () {
    var refs = R.pluck('name', R.filter(R.where({type: R.equals('template')}), this.props.fields));
    var v = refs.map(ref=>{
      ref = this.refs[`template-${ref}`];
      return !!ref.state.error;
    });
    return R.all(R.equals(false), v);
  },
  render: function () {
    var fields = this.props.fields.map(f=>{
      switch (f.type) {
        case 'checkbox':
          return <label key={f.name}>
            <input type={f.type} checked={this.state.data[f.name]} onChange={R.partial(this.handleChange, f.name)}/>
            {ctx.m(f.msgid)}
          </label>;
        case 'template':
          return <Template key={f.name} config={f.config}
            msgid={f.msgid}
            value={this.state.data[f.name]}
            onChange={R.partial(this.handleChange, f.name)}
            ref={`template-${f.name}`} />;
        default:
          return <label key={f.name} className="mt-1">
            <span>{ctx.m(f.msgid)}</span>
            <input type={f.type} value={this.state.data[f.name]} onChange={R.partial(this.handleChange, f.name)}/>
          </label>;
      }
    });
    return <div className="card-box pd-1 mt-1 site">
      {this.state.loaded ? [] : <div className="card-box loading-overlay align-center"></div>}
      <h2 className="b-b pb-1">
        {ctx.m(this.props.name)}
        <div className="button-group right">
          <button className="button" onClick={this.componentDidMount.bind(this)}>{ctx.m('settings_discard')}</button>
          <button className={`button ${this.state.dirty ? '' : 'disabled'}`} onClick={this.save}>{ctx.m('settings_save')}</button>
        </div>
      </h2>

      <div className="controls">
        {fields}
      </div>
    </div>;
  }
});
