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

/**
 * Convert anything to a transform function.
 * @param  {Array|String|Function} trans
 * @return {Function}
 */
function processTransformer(trans){
  if (typeof trans == 'string') {
    return R.path(trans.split('.'));
  }

  if (Array.isArray(trans)) {
    return R.path(trans);
  }

  if (typeof trans == 'function') {
    return trans;
  }

  throw new TypeError(`Need String, Array or Function`);
}

export function createObject(mapping) {
  return function (obj) {
    var ret = {};
    R.toPairs(mapping).forEach(function (pair) {
      var value;
      var func = processTransformer(pair[1]);

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
