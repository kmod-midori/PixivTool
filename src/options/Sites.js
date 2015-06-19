import Site from './site/Site';

module.exports = React.createClass({
  getInitialState: function() {
    return {
      sites: []
    };
  },
  componentDidMount: function() {
    var sitesReg = require('src/sites');
    sitesReg.ready.then(()=>{
      this.setState({
        sites: sitesReg.getOptionsConfig()
      });
    });
  },
  render: function () {
    var sites = this.state.sites.map(site=>{
      return <Site key={site.namespace} {...site}/>;
    });
    return <div>{sites}</div>;
  }
});
