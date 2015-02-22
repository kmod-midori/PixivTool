<style>
#dl-btn {
  width:87%;
  padding:10px;
}
</style>

<template lang="jade">
style
  |.pxtool-dl-mark {
  | background-color:rgb({{settings.bgColor.R}},{{settings.bgColor.G}},{{settings.bgColor.B}});
  |}
div.area_title
  |{{'app_name' | i18n}}
div.area_inside
  |Found {{idCount}}, {{dlCount}} of them are in your history database.
  div(v-show="illustView")
    hr
    h3.pxtool-dl-mark(v-if="downloaded") [Downloaded]
    h3(v-if="!downloaded") [Not Downloaded Before]
    h3(v-if="!loaded") Loading...
    h3(v-if="loadError") {{loadError}}
    div(v-if="workInfo")
      p Type: {{workInfo.type}}
      div(v-if="workInfo.type == 'manga'")
        ul
          li(v-repeat="workInfo.metadata.pages")
            label
              input(type="checkbox",v-model="selected[$index]")
              |Page {{$index + 1}}
      a._button#dl-btn(v-on="click:download") Download!
</template>

<script>
module.exports = require('./info');
</script>
