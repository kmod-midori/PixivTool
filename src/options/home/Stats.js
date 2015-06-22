module.exports = React.createClass({
  getInitialState: function() {
    return {
      spaceUsed: 0,
      historyCount: 0
    };
  },
  componentDidMount: async function() {
    var client = await ctx.dnode.getClient().ready;
    this.setState({
      spaceUsed: await client.getUsedStroageAsync(),
      historyCount: await client.historyCountAsync()
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
