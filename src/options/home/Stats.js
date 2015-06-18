module.exports = React.createClass({
  getInitialState: function() {
    return {
      spaceUsed: 0,
      historyCount: 0
    };
  },
  componentDidMount: function() {
    Promise.join(ctx.messaging.send('storage_get_space'), ctx.messaging.send('history_get_count'), (spaceUsed, historyCount)=>{
      this.setState({spaceUsed, historyCount});
    });
  },
  render: function () {
    return <div className="card-box pd-1 mt-1">
      <h2 className="b-b pb-1">{ctx.m('settings_statistics')}</h2>
      <h4 className="pt-1">{ctx.m('settings_space_used', {used: this.state.spaceUsed / 1000})}</h4>
      <h4 className="pt-1">{ctx.m('settings_history_count', {count: this.state.historyCount})}</h4>
    </div>;
  }
});
