/*eslint-disable no-unused-vars,valid-jsdoc */
var {
  EventEmitter
} = require('events');

export class IPCServer extends EventEmitter {
  constructor() {
    super();

    this.handlers = new Map();
    this.ports = new Map();
    this.tabs = new Map();
  }

  /**
   * Adds a request handler.
   * @param {String}   name
   * @param {Function} callback
   */
  addHandler(name, callback) {
    this.handlers.set(name, callback);
  }

  /**
   * Get tab ID with session ID.
   * @param  {String} sid Session ID
   * @return {Number}     Tab ID
   */
  getTabId(sid) {
    return this.tabs.get(sid);
  }

  /**
   * Get session ID with tab ID.
   * @param  {Number} tid Tab ID
   * @return {String}     Session Id
   */
  getSessionId(tid) {
    var sid = null;

    this.tabs.forEach((v, k) => {
      if (v === tid) {
        sid = k;
      }
    });

    return sid;
  }

  /**
   * Handles requests.
   * @param  {Object} req    Request info
   * @param  {Object} sid    Sender session ID
   * @param  {Function} rep  Send response by calling this.
   */
  handleRequest(req, sid, rep) {
    Promise.try(() => {
      var handler = this.handlers.get(req.method);
      if (!handler) {
        throw Error(`${req.method} not found.`);
      }

      return Promise.try(handler, [req.data, sid]);
    })
    .catch((ret) => {
      log.d(`Rejected request from ${sid} [${JSON.stringify(req)}] because ${ret}`);
      rep({
        status: 'rejected',
        reason: ret
      });
    })
    .then((ret) => {
      rep({
        status: 'fulfilled',
        result: ret
      });
    });

  }
}

export class IPCClient extends EventEmitter {
  /**
   * Send request.
   * @param  {String} method
   * @param  {Object} data
   * @return {Promise}
   */
  send(method, data) {}
}

export class Storage {

}
