<style>
body{
    font-family: Tahoma,'Microsoft YaHei UI','Microsoft YaHei',DengXian,SimSun,'Segoe UI',Tahoma,Helvetica,sans-serif;
    font-size: 14px;
}

h1, h2, h3, h4, h5, h6 {
    font-family: 'Microsoft YaHei UI','Microsoft YaHei',DengXian,SimSun,'Segoe UI',Tahoma,Helvetica,sans-serif;
}

input[type=checkbox]{
  vertical-align: -2px;
  margin-right:3px;
}

#bg-rgb input[type=range]{
  vertical-align: middle;
  margin-left:5px;
}

#bg-rgb > div {
  margin-top:5px;
}
</style>

<template lang="jade">
form(name="settingsForm")
  a.button.right(v-on="click:save",v-class="disabled:warnings.length != 0") {{saveBtn | i18n}}
  div(v-partial="ui-settings")
  hr
  div(v-partial="dl-settings")
</template>

<script>
var _ = require('lodash');
var genFilename = function(val){
  return require('global/gen-filename')(val, require('./filename-eg'));
};
var mod  = {
  data:require('global/defaults'),
  watch:{
    filename:function(val){
      var result = genFilename(val);
      this.$set('outFilename',result.result);
      this.$set('warnings',result.warnings);
    }
  },
  methods:{
    render:function(val){
      return genFilename(val).result;
    },
    save:function(){
      if(this.warnings.length != 0)return;
      var set = {
        filename:this.filename,
        keepHistory:this.keepHistory,
        bgColor:_.clone(this.bgColor),
        mark:this.mark,
        notify:this.notify,
        alert:this.alert
      };
      var that = this;
      chrome.storage.local.set({settings:set},function(){
        that.saveBtn = 'settings_saved';
        setTimeout(function(){that.saveBtn = 'save';},2000);
      });
    }
  }
};
mod.data.outFilename = genFilename(require('global/defaults').filename).result;
mod.data.warnings = [];
mod.data.saveBtn = 'save';
mod.data.pattern = require('./pattern');
module.exports = mod;
</script>
