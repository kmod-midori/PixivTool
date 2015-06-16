module.exports = ()=>{
  var loc = document.location;
  if (loc.pathname === '/member_illust.php' && loc.search.contains('mode=medium')) {
    require('./getMeta')(/illust_id=(\d+)/.exec(loc.search)[1]);
  }
};
