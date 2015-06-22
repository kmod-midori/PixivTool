exports.startDownload = function (selected, sid) {
  if (sid) {
    return ctx.dnode.getClient().ready.call('startDownloadAsync', selected, sid);
  } else {
    return ctx.dnode.getClient().ready.call('startDownloadAsync', selected);
  }

};

exports.addHistory = function (id, dat) {
  return ctx.dnode.getClient().ready.call('historyAddAsync', id, dat);
};
