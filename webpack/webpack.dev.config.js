const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackConfig = require('./webpack.config');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const config = require('../config')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)
const env = require('../config/dev.env.js');

const stylusLoader = require('stylus-loader');

function resolveStaticPathPlugin() {
  return function(style) {
    style.define('resolveStaticPath', function(url) {
      return config.dev.assetsSubDirectory+ url.string
    });
  };
}

module.exports = merge(webpackConfig, {
  devtool: config.dev.devtool,
  mode: config.dev.mode,
  entry: {
    home: [
      `webpack-dev-server/client?http://${HOST || config.dev.host}:${PORT || config.dev.port}`,
      path.resolve(__dirname, '../src/view/home'),
    ],
    login: [
      `webpack-dev-server/client?http://${HOST || config.dev.host}:${PORT || config.dev.port}`,
      path.resolve(__dirname, '../src/view/login'),
    ],
    register: [
      `webpack-dev-server/client?http://${HOST || config.dev.host}:${PORT || config.dev.port}`,
      path.resolve(__dirname, '../src/view/register'),
    ],
    passport: [
      `webpack-dev-server/client?http://${HOST || config.dev.host}:${PORT || config.dev.port}`,
      path.resolve(__dirname, '../src/view/passport'),
    ],
    user: [
      `webpack-dev-server/client?http://${HOST || config.dev.host}:${PORT || config.dev.port}`,
      path.resolve(__dirname, '../src/view/user'),
    ],
    asset: [
      `webpack-dev-server/client?http://${HOST || config.dev.host}:${PORT || config.dev.port}`,
      path.resolve(__dirname, '../src/view/asset'),
    ],
    trade: [
      `webpack-dev-server/client?http://${HOST || config.dev.host}:${PORT || config.dev.port}`,
      path.resolve(__dirname, '../src/view/trade'),
    ],
    order: [
      `webpack-dev-server/client?http://${HOST || config.dev.host}:${PORT || config.dev.port}`,
      path.resolve(__dirname, '../src/view/order'),
    ],
    otc: [
      `webpack-dev-server/client?http://${HOST || config.dev.host}:${PORT || config.dev.port}`,
      path.resolve(__dirname, '../src/view/otc'),
    ],
    help: [
      `webpack-dev-server/client?http://${HOST || config.dev.host}:${PORT || config.dev.port}`,
      path.resolve(__dirname, '../src/view/help'),
    ],
    notification: [
      `webpack-dev-server/client?http://${HOST || config.dev.host}:${PORT || config.dev.port}`,
      path.resolve(__dirname, '../src/view/notification'),
    ],
    message: [
      `webpack-dev-server/client?http://${HOST || config.dev.host}:${PORT || config.dev.port}`,
      path.resolve(__dirname, '../src/view/message'),
    ],
    activity: [
      `webpack-dev-server/client?http://${HOST || config.dev.host}:${PORT || config.dev.port}`,
      path.resolve(__dirname, '../src/view/activity'),
    ],
    fund: [
      `webpack-dev-server/client?http://${HOST || config.dev.host}:${PORT || config.dev.port}`,
      path.resolve(__dirname, '../src/view/fund'),
    ],
  },
  plugins: [
    // new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': env
    }),
  
    new stylusLoader.OptionsPlugin({
      default: {
        use: [
          resolveStaticPathPlugin()
        ],
        preferPathResolver: 'webpack'
      },
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['home'],
      template: path.resolve(__dirname, '../src/view/home/index.html'),
      filename: "index.html"
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['login'],
      template: path.resolve(__dirname, '../src/view/login/index.html'),
      filename: "login/index.html"
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['register'],
      templateParameters: {
        jsPath: '/profill'
      },
      template: path.resolve(__dirname, '../src/view/register/index.html'),
      filename: "register/index.html"
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['passport'],
      template: path.resolve(__dirname, '../src/view/passport/index.html'),
      filename: "passport/index.html"
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['user'],
      template: path.resolve(__dirname, '../src/view/user/index.html'),
      filename: "user/index.html"
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['asset'],
      template: path.resolve(__dirname, '../src/view/asset/index.html'),
      filename: "asset/index.html"
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['order'],
      template: path.resolve(__dirname, '../src/view/order/index.html'),
      filename: "order/index.html"
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['otc'],
      template: path.resolve(__dirname, '../src/view/otc/index.html'),
      filename: "otc/index.html"
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['trade'],
      template: path.resolve(__dirname, '../src/view/trade/index.html'),
      filename: "trade/index.html"
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['help'],
      template: path.resolve(__dirname, '../src/view/help/index.html'),
      filename: "help/index.html"
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['notification'],
      template: path.resolve(__dirname, '../src/view/notification/index.html'),
      filename: "notification/index.html"
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['message'],
      template: path.resolve(__dirname, '../src/view/message/index.html'),
      filename: "message/index.html"
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['activity'],
      template: path.resolve(__dirname, '../src/view/activity/index.html'),
      filename: "activity/index.html"
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['fund'],
      template: path.resolve(__dirname, '../src/view/fund/index.html'),
      filename: "fund/index.html"
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    //配置static目录拷贝到服务器目录下
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: 'static',
        ignore: ['.*']
      },
      {
        from: path.resolve(__dirname, "../page"),
        to: 'page',
        ignore: [".*"],
      },
      {
        from: path.resolve(__dirname, "../profill"),
        to: 'profill',
        ignore: [".*"],
      }
    ])
  ],
});
