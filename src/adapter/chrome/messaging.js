import {
  IPCServer, IPCClient
}
from '../base';

class Server extends IPCServer {
  constructor() {
    super();

    chrome.runtime.onConnect.addListener((port) => {
      var sid = port.name,
        isTab = !!port.sender.tab;

      this.ports.set(sid, port);

      if (isTab) {
        this.tabs.set(sid, port.sender.tab.id);
        this.emit('tabSupported', sid, port.sender.tab.id);
        log.d(`${sid} => ${port.sender.tab.id}`);
      }
      log.d(`${sid} connected`);

      port.onDisconnect.addListener(() => {
        if (isTab) {
          this.emit('tabClosed', sid, this.getTabId(sid));
        }
        this.ports.delete(sid);
        this.tabs.delete(sid);
        log.d(`${sid} closed`);
      });
    });

    chrome.runtime.onMessage.addListener((req, sender, rep) => {
      var sid;
      if (sender.tab) {
        sid = this.getSessionId(sender.tab.id);
      }
      this.handleRequest(req, sid, rep);
      return true;
    });
  }

  broadcast(name, data) {
    this.ports.forEach(port=>{
      port.postMessage({name, data});
    });
  }
}

class Client extends IPCClient {
  constructor() {
    var port;
    super();

    port = this.port = chrome.runtime.connect({
      name: String.fromCharCode(Date.now() % 25 + 97) + Math.random().toString(36).slice(2)
    });
    port.onMessage.addListener((msg) => {
      this.emit(msg.name, msg.data);
    });
  }

  send(method, data, needResp = true) {
    if (needResp) {
      return new Promise((resolve, reject) => {
        // https://crxdoc-zh.appspot.com/extensions/messaging#simple
        chrome.runtime.sendMessage({method, data}, (ret) => {
          if (ret.status === 'fulfilled') {
            resolve(ret.result);
          } else { // rejected
            reject(new Error(ret.reason));
          }
        });
      });
    } else {
      chrome.runtime.sendMessage({method, data});
    }
  }
}

module.exports = window._pxCtx === 'back' ? new Server() : new Client();
