var Navbar = require('./Navbar');
var PageSelect = require('./PageSelect');

var App = React.createClass({
  displayName: 'App',
  getInitialState: ()=>{
    return {
      status: 'unsupported',
      session: null
    };
  },
  componentDidMount: function(){
    ctx.messaging.send('get_current_session').then(sid=>{
      this.setState({
        session: sid,
        status: sid ? 'active' : 'unsupported'
      });
    });
  },
  render: function () {
    var isActive = this.state.status === 'active';
    var sel = isActive ? [<PageSelect session={this.state.session} />] : [];
    return <div>
      <Navbar status={this.state.status}/>
      <div id="content" className={isActive ? '' : 'hide'}>
        {sel}
      </div>
    </div>;
  }
});

module.exports = React.render(<App />, document.getElementById('popup'));
