var Navbar = require('./Navbar');

var App = React.createClass({
  displayName: 'App',
  render: function () {
    return <div>
      <Navbar status="error" tabId="10"/>
    </div>;
  }
});

module.exports = React.render(<App />, document.getElementById('popup'));

ctx.messaging.send('backlog', null, false);
