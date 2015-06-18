var delim = '__pxtool_path_delim__';

export default class FilenameCreator {
  constructor(options){
    var tmpl = options.template;
    (options.preReplace || []).forEach(r=>{
      tmpl = tmpl.replace(r[0], r[1]);
    });
    tmpl = tmpl.replace(/{{/g, '<%= ').replace(/}}/g, ' %>');

    //replace / and \ with delim
    tmpl = tmpl.replace(/\/|\\/g, delim);

    this.template = require('lodash/string/template')(tmpl, {
      imports: {
        R: require('ramda'),
        moment: require('moment-timezone')
      }
    });
  }

  render(data){
    var str = this.template(data).replace(/[\|\\/:*?"<>]/g, '');
    // http://stackoverflow.com/questions/1144783/replacing-all-occurrences-of-a-string-in-javascript
    return str.split(delim).join('/');
  }
}
