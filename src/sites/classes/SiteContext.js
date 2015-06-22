import {EventEmitter} from 'events';
import FileNamer from 'src/common/FilenameGenerator';

export default class SiteContext extends EventEmitter {
  constructor(site){
    super();
    this.prefix = site.namespace;
    this.idCache = new Set();
    ctx.dnode.getClient().on('configUpdated:' + this.prefix, newConf=>{
      this.emit('configUpdated', newConf);
    });

    ctx.dnode.getClient().on('historyUpdated', ()=>{
      this.emit('historyUpdated');
    });

    this.tmplConfig = site.template;

    //////////////////
    // Get defaults //
    //////////////////
    (() => {
      var def = {};
      site.config.forEach(c=>{
        def[c.name] = c.default;
      });
      this.defaults = def;
    }());

    this.buttonShown = false;
  }

  isDownloaded(id){
    if (this.idCache.has(id)) {
      return Promise.resolve(true);
    }
    return ctx.dnode.getClient().ready.call('historyExistsAsync', this.prefix + id).tap(exists=>{
      if (exists) {
        this.idCache.add(id);
      }
    });
  }

  getConfig(){
    return ctx.dnode.getClient().ready.call('configGetAsync', this.prefix).then(conf => {
      return R.merge(this.defaults, conf || {});
    });
  }

  getCached(id){
    return ctx.dnode.getClient().ready.call('getWorkCacheAsync', this.prefix + id).tap(function (cached) {
      debug('Work Cache')('Hit', cached);
    });
  }

  setCache(id, data){
    return ctx.dnode.getClient().ready.call('setWorkCacheAsync', this.prefix + id, data);
  }

  getFilename(template, data) {
    if (!this.namer) { // create singleton
      this.namer = new FileNamer(
        R.assoc('template', template, this.tmplConfig)
      );
    }

    return this.namer.render(data);
  }

  postMeta(meta) {
    meta.id = this.prefix + meta.id;
    this.pageMeta = meta;
    ctx.dnode.getClient().ready.call('setPageCacheAsync', meta);
  }

  startDownload(){
    var helper = require('src/common/DownloadHelper');
    helper.startDownload();
    helper.addHistory(this.pageMeta.id, this.pageMeta.work);
  }

  showButton(){
    var $ = require('jquery');
    require('./button.css');

    if (this.buttonShown) {
      return;
    }

    this.buttonShown = true;
    $(`<a id="pxtool-download" href="#">${ctx.m('common_download')}</a>`)
    .appendTo('body').click(this.startDownload.bind(this));
  }
}
