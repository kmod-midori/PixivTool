/*
D
 */
var Site = require('../Site');

export default class Pixiv extends Site {
  static match(){
    return true;
  }

  static run(){
    ctx.messaging.send('test', null, false);
  }
}
