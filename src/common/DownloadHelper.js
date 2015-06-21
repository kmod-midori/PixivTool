exports.startDownload = function (pages, referer) {
  return ctx.messaging.send('start_download', {
    pages,
    ref: referer
  });
};

exports.addHistory = function (id, dat) {
  return ctx.messaging.send('history_add', {
    id,
    dat
  });
};
