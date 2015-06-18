import Navbar from './Navbar';
import { RouteHandler } from 'react-router';
var App = React.createClass({
  render: function () {
    return <div>
      <Navbar />
      <div className="wrap cleared">
        <RouteHandler />
      </div>
    </div>;
  }
});

module.exports = App;
