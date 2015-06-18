import Stats from './home/Stats';
module.exports = React.createClass({
  render: function () {
    return <div>
      <div className="card-box pd-1 align-center">
        <h1>{ctx.m('common_welcome')}</h1>
      </div>
      <Stats />
    </div>;
  }
});
