path = require 'path'
webpack = require 'webpack'

module.exports =
  entry:
#    options:'./src/opts/index.coffee'
    content:'./src/content/index.js'
#    background: './src/back/entry.coffee'
#    popup: './src/popup/entry.coffee'
  output:
    path: path.resolve './dist'
    filename:'[name].js'
    publicPath: '/bundles/'
  module:
    loaders:[
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          optional: ['runtime'],
          stage: 0
        }
      }
      {
        test: /\.css$/
        loader: 'style!css'
      }
      {
        test: /\.yml$/
        loader: "json!yaml"
      }
    ]

  resolve:
    extensions: ['', '.js','.coffee', '.webpack.js', '.web.js', '.yml']
    modulesDirectories: ['bower_components', 'node_modules']
    alias:
      src: path.resolve './src'
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
      ctx: path.resolve './src/adapter/ctx.js'
      log: path.resolve './src/common/logger.js'
      Promise:'bluebird'
    })
  ]
