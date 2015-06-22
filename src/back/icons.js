require('file?name=icons/default.png!src/assets/icons/default.png');
require('file?name=icons/active.png!src/assets/icons/active.png');

ctx.dnode.getServer.then(function (server) {
  server.on('connected', function (sid, tid) {
    ctx.button.setIcon('icons/active.png', tid);
  });
  server.on('closed', function (sid, tid) {
    ctx.button.setIcon('icons/default.png', tid);
  });
});
