var exp = {
  m: (msgid, data)=>{
    var IntlMessageFormat = require('intl-messageformat');
    var msg = chrome.i18n.getMessage(msgid);
    if(!data || msg.indexOf('{') === -1){
      return msg;
    }

    msg = new IntlMessageFormat(msg, chrome.i18n.getUILanguage());
    return msg.format(data);
  },
  messaging: require('./messaging'),
  button: require('./button'),
  tabs: require('./tabs')
  storage: require('./storage'),
};

module.exports = exp;
