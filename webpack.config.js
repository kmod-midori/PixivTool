var webpack = require("webpack");
var path = require("path");
module.exports = {
  watch:true,
  entry:{
    options:'./options/entry.coffee',
    content:'./content/entry.coffee',
    event:'./event/entry.coffee'
  },
  module: {
    loaders: [
      { test: /\.coffee$/, loader: "coffee-loader" },
      { test: /\.jade$/, loader: "template-html-loader" },
      { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.vue$/, loader: "vue" },
      { test: /\.json$/, loader: "json-loader" },
      { test: /\.cson$/, loader: "cson-loader" },
      { test: /\.yml$/, loader: "json!yaml" },
      {
        test: /\.scss$/,
        loader: "style!css!sass?outputStyle=expanded&" +
          "includePaths[]=" +
            (path.resolve(__dirname, "./bower_components")) + "&" +
          "includePaths[]=" +
            (path.resolve(__dirname, "./node_modules")) + "&" +
          "includePaths[]=./bower_components/foundation/scss"
      }
    ]
  },
  resolve:{
    extensions:[
      "", ".webpack.js", ".web.js", ".js",
      ".coffee",
      ".cson",
      ".json"
    ],
    alias:{
      global:path.join(__dirname,"global")
    },
    modulesDirectories: ["bower_components", "node_modules"]
  },
  output: {
    filename: "[name].bundle.js",
    path:path.join(__dirname, "build"),
    publicPath:"/"
  },
  plugins:[
    new webpack.ResolverPlugin([
      new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
    ]),
    new webpack.IgnorePlugin(/^fs$/),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.CommonsChunkPlugin("deps.js")
  ]
};
