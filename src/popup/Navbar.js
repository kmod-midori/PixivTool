var colors = {
  unsupported: 'blue',
  active: 'green',
  error: 'red'
};

var Navbar = React.createClass({
  render: function(){
    return <div className={`nav nav-${colors[this.props.status]}`}>
      <a href="#" className="nav-item nav-head">
        {ctx.m('common_app_name')} @ {this.props.tabId}
      </a>
      <a href="#" className="nav-item">{ctx.m('common_settings')}</a>
      <a href="#" className="nav-item">{ctx.m('popup_purge_cache')}</a>
    </div>;
  }
});

module.exports = Navbar;
