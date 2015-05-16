path = require 'path'
webpack = require 'webpack'

module.exports =
  entry:
#    options:'./src/opts/index.coffee'
    content:'./src/content/entry.coffee'
    background: './src/back/entry.coffee'
    popup: './src/popup/entry.coffee'
  output:
    path: path.resolve './dist'
    filename:'[name].js'
    publicPath: '/bundles/'
  module:
    loaders:[
      {
        test: /\.coffee$/
        loader: 'regenerator!coffee'
      }
      {
        test: /\.css$/
        loader: 'style!css'
      }
      {
        test: /\.yml$/
        loader: "json!yaml"
      }
      {
        test: /\.cson$/
        loader: "cson"
      }
    ]

  resolve:
    extensions: ['', '.coffee', '.webpack.js', '.web.js', '.js', '.yml', '.coffee.md']
    modulesDirectories: ['bower_components', 'node_modules']
    alias:
      shared:path.resolve './src/shared'
      fs:path.resolve './src/shared/shim/fs.coffee'
      mkdirp:path.resolve './src/shared/shim/mkdirp.coffee'
  plugins:[
    new webpack.ResolverPlugin([
      new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
    ])
    new webpack.optimize.CommonsChunkPlugin("deps.js")
    new webpack.BannerPlugin([
      "(c) 2015 Midori Kochiya"
      "GPLv3"
    ].join("\n"))
    new webpack.ProvidePlugin({
      _: 'lodash'
      Promise:'bluebird'
    })
  ]
