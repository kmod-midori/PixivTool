module.exports = React.createClass({
  getInitialState: function() {
    return {
      error: null,
      out: ''
    };
  },
  getDefaultProps: function() {
    return {
      onChange: function(){},
      onValidityChange: function(){},
      value: ''
    };
  },
  renderTmpl: function (tmpl) {
    var FileNamer = require('src/common/FilenameGenerator');
    var namer = new FileNamer(
      R.assoc('template', tmpl, this.props.config)
    );
    return namer.render(this.props.config.example);
  },
  componentWillReceiveProps: function(nextProps) {
    var out = '';
    try {
      out = this.renderTmpl(nextProps.value);
      this.setState({
        error: null,
        out
      });
    } catch(err) {
      if (err instanceof ReferenceError) {
        this.setState({
          error: ctx.m('settings_invalid_var', {v: /(.+) is not defined/.exec(err.message)[1]})
        });
      } else {
        this.setState({
          error: err.message
        });
      }
    }
  },
  render: function () {
    var rows = this.props.config.keys.map(key=>{
      return <tr key={key.path}>
        <td>{key.path}</td>
        <td>{ctx.m(key.msgid)}</td>
      </tr>;
    });
    var ex;

    if (this.state.error) {
      ex = <div className="mt-1">
        <div className="msg msg-red">{this.state.error}</div>
      </div>;
    } else {
      ex = <div className="card-box pd-1 mt-1">{this.state.out}</div>;
    }

    return <div>
      <label className="w-100p">
        {ctx.m(this.props.msgid)}
        <input className="mt-1" type="text" value={this.props.value} onChange={this.props.onChange}/>
      </label>
      {ex}
      <table className="table">
        <thead>
          <tr>
            <th>{ctx.m('settings_template')}</th>
            <th>{ctx.m('settings_description')}</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    </div>;
  }
});
