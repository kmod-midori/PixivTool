path = require 'path'
webpack = require 'webpack'

module.exports =
  entry:
    options:'./src/options/index.js'
    content:'./src/content/index.js'
    background: './src/back/index.js'
    popup: './src/popup/index.js'
    # tests: 'mocha!./tests/index.js'
  output:
    path: path.resolve './dist'
    filename:'[name].js'
    publicPath: '/'
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
        test: /\.json$/
        loader: 'json'
      }
      {
        test: /\.yml$/
        loader: "json!yaml"
      }
    ]
    preLoaders:[
      {
        test: /\.jsx?$/,
        loader: "eslint-loader",
        exclude: /(node_modules|bower_components)/
      }
    ]
  eslint: {
    failOnError: true
  }
  resolve:
    extensions: ['', '.jsx','.js', '.webpack.js', '.web.js', '.yml']
    modulesDirectories: ['bower_components', 'node_modules']
    alias:
      src: path.resolve './src'
  plugins:[
    new webpack.ResolverPlugin([
      new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", [
        "main"
      ])
    ])
    new webpack.optimize.CommonsChunkPlugin("deps","deps.js")
    new webpack.BannerPlugin([
      "(c) 2015 Midori Kochiya"
      "GPLv3"
    ].join("\n"))
    new webpack.ProvidePlugin({
      _: 'lodash'
      ctx: path.resolve './src/adapter/ctx.js'
      debug: 'debug'
      Promise:'bluebird'
      React: 'react',
      R: 'ramda'
    })
  ]
  node:
    console: false
    process: true
    global: true
    Buffer: true
    __filename: "mock"
    __dirname: "mock"
    fs: 'empty'
