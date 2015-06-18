import Site from './site/Site';

module.exports = React.createClass({
  render: function () {
    var sites = require('src/sites').map(s=>{
      s = s.settings;
      return <Site key={s.name} {...s}/>;
    });
    return <div>{sites}</div>;
  }
});
