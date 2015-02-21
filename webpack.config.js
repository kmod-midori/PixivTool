var webpack = require("webpack");
var path = require("path");
module.exports = {
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
    }
  },
  output: {
    filename: "[name].bundle.js",
    path:path.join(__dirname, "build"),
    publicPath:"/"
  },
  plugins:[
    new webpack.IgnorePlugin(/^fs$/),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.CommonsChunkPlugin("deps.js")
  ]
};
