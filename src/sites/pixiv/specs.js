/* eslint-env mocha */
import {expect} from 'chai';

module.exports = function () {
  describe('Pixiv', function () {
    describe('Location Matcher', function () {
      var matcher = require('./matcher');
      it('should reject when in any setting pages.', function () {
        expect(matcher({
          host: 'www.pixiv.net',
          pathname: '/setting_user.php'
        })).to.be.an('undefined');

        expect(matcher({
          host: 'www.pixiv.net',
          pathname: '/stacc/my/setting'
        })).to.be.an('undefined');
      });
    });
  });
};
