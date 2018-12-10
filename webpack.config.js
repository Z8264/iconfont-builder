const path = require('path');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  // 入口
  entry: {
    index: path.resolve(__dirname, './src/index.js'),
  },
  // 输出
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  // 模式
  mode: 'development',
  // 模块
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      }
    ]
  },
  // 插件
  plugins: [
    // vue
    new VueLoaderPlugin()
  ],
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000
  }
}