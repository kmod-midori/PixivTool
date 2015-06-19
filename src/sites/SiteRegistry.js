import {EventEmitter} from 'events';
import FileNamer from 'src/common/FilenameGenerator';

class SiteContext extends EventEmitter {
  constructor(site){
    super();
    this.prefix = site.namespace;
    this.idCache = new Set();
    ctx.messaging.on('configUpdated:' + this.prefix, newConf=>{
      this.emit('configUpdated', newConf);
    });

    ctx.messaging.on('historyUpdated', ()=>{
      this.emit('historyUpdated');
    });

    this.tmplConfig = site.template;
    (() => {
      var def = {};
      site.config.forEach(c=>{
        def[c.name] = c.default;
      });
      this.defaults = def;
    }());
  }

  isDownloaded(id){
    if (this.idCache.has(id)) {
      return Promise.resolve(true);
    }
    return ctx.messaging.send('history_id_exist', this.prefix + id).tap(exists=>{
      if (exists) {
        this.idCache.add(id);
      }
    });
  }

  injectCSS(enabled, color) {
    var $ = require('jquery');
    var cssText = '';
    var el = $('#pxtool-css');
    if (enabled) { // clear all css if disabled
      cssText = `
      .pxtool-dl-mark {
        background-color: ${color};
      }
      `;
    }

    if (el.length === 0) { // create one
      el = $('<style id="pxtool-css" type="text/css"></style>').appendTo('head');
    }
    el.html(cssText);
  }

  getConfig(){
    return ctx.messaging.send('config_get', this.prefix).then(conf=>{
      return R.merge(this.defaults, conf || {});
    });
  }

  getCached(id){
    return ctx.messaging.send('meta_cache_get', this.prefix + id).tap(function (cached) {
      log.d('Cache Hit:', cached);
    });
  }

  setCache(id, data){
    return ctx.messaging.send('meta_cache_set', {key: this.prefix + id, value: data});
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
    ctx.messaging.send('set_metadata', meta, false);
  }
}

class SiteRegistry extends EventEmitter {
  constructor(){
    super();
    this.sites = [];
    this.ready = new Promise(resolve=>{
      this.regsterDone = resolve;
    });
  }

  register(site){
    this.sites.push(site);
  }

  filterAndRun(location){
    this.sites.forEach(site => {
      var context;
      if (R.allPass(site.enableCondition, location)) {
        context = new SiteContext(site);
        if (R.allPass(site.downloadableCondition, location)) {
          process.nextTick(site.prepareDownload.bind(null, context));
        }
        process.nextTick(site.run.bind(null, context));
      }
    });
  }

  getOptionsConfig(){
    return this.sites.map(site => {
      return {
        name: site.name,
        fields: site.config,
        namespace: site.namespace,
        templateConfig: site.template
      };
    });
  }
}

module.exports = new SiteRegistry();
