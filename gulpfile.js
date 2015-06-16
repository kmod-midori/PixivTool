require('coffee-script/register');

var minimist = require('minimist');

global.options = minimist(process.argv.slice(2),{
  string: ['target'],
  default:{
    target:'chrome'
  }
});

var requireDir = require('require-dir');
requireDir('./tasks');