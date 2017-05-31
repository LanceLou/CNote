var path = require('path');
var webpack = require('webpack');

var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(__dirname, './inPageSrc/index.js');
var BUILD_PATH = path.resolve(__dirname, './disc');

module.exports = {
  entry: [APP_PATH],
  output: {
    path: BUILD_PATH,
    filename: 'bundle.js'
  },
  devtool: "source-map",
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: { presets: [ 'es2015', 'stage-0'] }
    }]
  },
  plugins: [
    // 需要手动添加 HotModuleReplacementPlugin , 命令行的方式会自动添加
    new webpack.HotModuleReplacementPlugin()
  ],
  node: {
    fs: "empty"
  }
}