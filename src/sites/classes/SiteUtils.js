export class Page {
  constructor(url, filename, extData){
    this.url = url;
    this.filename = filename;
    this.extData = extData;
  }
}

export class PageMeta {
  constructor(work, id, pages, referer = document.location.toString(), copyright = null){
    this.work = work;
    this.id = id;

    pages.forEach(function (page) {
      if (!page instanceof Page) {
        throw new TypeError('Every page should be an instance of Page');
      }
    });

    this.pages = pages;
    this.referer = referer;
    this.copyright = copyright;
  }
}

export class MatchedElement {
  constructor(id, elem){
    this.id = id;
    this.element = elem;
  }
}

export function createObject(mapping) {
  return function (obj) {
    var ret = {};
    R.toPairs(mapping).forEach(function (pair) {
      var func, value;

      if (typeof pair[1] == 'string') {
        func = R.path(pair[1].split('.'));
      } else if (Array.isArray(pair[1])) {
        func = R.path(pair[1]);
      } else if (typeof pair[1] == 'function') {
        func = pair[1];
      } else {
        throw new TypeError(`${pair[0]} is not String, Array or Function`);
      }

      value = func(obj);
      if (typeof value == 'undefined') {
        throw new ReferenceError(`${pair[0]} is undefined in target object`);
      }
      ret[pair[0]] = value;
    });

    return ret;
  };
}

export function correctTime(path, timezone) {
  var moment = require('moment-timezone');
  return function (obj) {
    var t = R.path(path, obj);
    return Number(moment.tz(t, timezone));
  };
}
