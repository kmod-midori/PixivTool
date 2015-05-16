//var chromeApiPromisifyAll = require('./chrome_api');

var storage = chrome.storage.local;

export class ChromeStorage {
    constructor(name: string){
        chrome.storage.onChanged.addListener(function (change) {

        })
    }
}