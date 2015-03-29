path = require 'path'
webpack = require 'webpack'

module.exports =
  entry:
    options:'./src/opts/index.coffee'
    content:'./src/content/entry.coffee'
    background: './src/back/entry.coffee'
  output:
    path: path.resolve './dist'
    filename:'[name].js'

  module:
    loaders:[
      {
        test: /\.coffee$/
        loader: 'coffee-loader'
      }
      {
        test: /\.scss$/,
        loader: [
          'style!css!sass?'
          'outputStyle=expanded&'
          'includePaths[]=./bower_components/foundation/scss/'
        ].join('')
      }
      {
        test: /\.yml$/
        loader: "json!yaml"
      }
      {
        test: /\.hbs$/
        loader: "raw"
      }
      {
        test: /\.cson$/
        loader: "cson"
      }
      {
        test: /\.vue$/
        loader: "vue"
      }
    ]

  resolve:
    extensions: ['', '.coffee', '.webpack.js', '.web.js', '.js', '.scss', '.yml']
    modulesDirectories: ['bower_components', 'node_modules']
    alias:
      shared:path.resolve './src/shared'
      plugin:path.resolve './src/plugin'

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
    })
    new webpack.IgnorePlugin /^fs$/
  ]
