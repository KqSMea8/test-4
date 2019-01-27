const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpackConfig = require('./webpack.config');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const env = require('../config/prod.env.js')
const config = require('../config')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const stylusLoader = require('stylus-loader');

function resolveStaticPathPlugin() {
  return function(style) {
    style.define('resolveStaticPath', function(url) {
      return config.build.assetsSubDirectory+ url.string
    });
  };
}

module.exports = merge(webpackConfig, {
  mode: "production",
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  entry: {
    activity: path.resolve(__dirname, '../src/view/activity'),
    asset: path.resolve(__dirname, '../src/view/asset'),
    fund: path.resolve(__dirname, '../src/view/fund'),
    help: path.resolve(__dirname, '../src/view/help'),
    home: path.resolve(__dirname, '../src/view/home'),
    login: path.resolve(__dirname, '../src/view/login'),
    message: path.resolve(__dirname, '../src/view/message'),
    notification: path.resolve(__dirname, '../src/view/notification'),
    order: path.resolve(__dirname, '../src/view/order'),
    otc: path.resolve(__dirname, '../src/view/otc'),
    passport: path.resolve(__dirname, '../src/view/passport'),
    register: path.resolve(__dirname, '../src/view/register'),
    trade: path.resolve(__dirname, '../src/view/trade'),
    user: path.resolve(__dirname, '../src/view/user'),
  },
  output: {
    path: config.build.assetsRoot, // 输出的路径
    filename: "[name].[chunkhash:8].js", // 打包后文件h
    publicPath: env.PUBLISH_PATH ? config.build.assetsPublicPathPublish : config.build.assetsPublicPath
  },
  optimization: {
    minimizer: [
      //简化JavaScript
      new UglifyJSPlugin({
        extractComments: true,
        parallel: true,
        uglifyOptions: {
          warnings: false,
          parse: {},
          compress: {
            passes: 2
          },
          mangle: {
            toplevel: true,
            eval: true
          }, // Note `mangle.properties` is `false` by default.
          output: null,
          toplevel: false,
          nameCache: null,
          ie8: false,
          keep_fnames: false,
        }
      })
    ],
    splitChunks: {
      cacheGroups: {
        // commons: {
        //   name: "commons",
        //   chunks: "initial",
        //   minChunks: 2
        // },
        core: {
          test: /(.[\\/]core[\\/])|(.[\\/]class[\\/])|(.[\\/]config[\\/])|([\\/]src[\\/]lang[\\/])/,
          name: "core",
          chunks: "all",
          enforce: true
        },
        // common: {
        //   test: /.[\\/]common[\\/]/,
        //   name: "common",
        //   chunks: "all"
        // },
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|react-intl-universal)[\\/]/,
          name: "react",
          chunks: "all",
          enforce: true
        },
        vendors: {
          test: /[\\/]node_modules[\\/](?!react)/,
          name: "vendors",
          chunks: "all",
          enforce: true
        },
        // vendors: {
        //   test: /[\\/]node_modules[\\/]/,
        //   name: 'vendors',
        //   chunks: 'all'
        // },
        default: false
      }
    }
  },
  //插件
  plugins: [
    //传递环境变量，todo此处有待修改
    new webpack.DefinePlugin({
      "process.env": env
    }),
    
    // new BundleAnalyzerPlugin(),
  
    new stylusLoader.OptionsPlugin({
      default: {
        use: [
          resolveStaticPathPlugin()
        ],
        preferPathResolver: 'webpack'
      },
    }),
    
    //配置static目录拷贝到服务器目录下
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, "../static"),
        to: '../static',
        ignore: [".*"],
      },
      {
        from: path.resolve(__dirname, "../page"),
        to: '../page',
        ignore: [".*"],
      },
      {
        from: path.resolve(__dirname, "../profill"),
        to: env.PUBLISH_PATH ? config.build.assetsRoot : (config.build.assetsRoot + '/profill'),
        ignore: [".*"],
      }
    ]),
    
    //清理dist文件夹
    new CleanWebpackPlugin(['dist'], {
      root: path.resolve(__dirname, '../'),
    }),
    
    //生成简化的html文件，
    // new HtmlWebpackPlugin({
    //   template: config.build.index,
    //   inject: true,
    //   minify: {
    //     html5: true,
    //     collapseWhitespace: true,
    //     removeComments: true,
    //     removeTagWhitespace: true,
    //     removeEmptyAttributes: true,
    //     removeStyleLinkTypeAttributes: true
    //   }
    // })
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['react', 'vendors', 'core', 'home',],
      template: path.resolve(__dirname, '../src/view/home/index.html'),
      minify: {
        html5: true,
        collapseWhitespace: true,
        removeComments: true,
        removeTagWhitespace: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true
      },
      filename: "../home/index.html"
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['react', 'vendors', 'core', 'login',],
      template: path.resolve(__dirname, '../src/view/login/index.html'),
      minify: {
        html5: true,
        collapseWhitespace: true,
        removeComments: true,
        removeTagWhitespace: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true
      },
      filename: "../login/index.html"
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['react', 'vendors', 'core', 'register',],
      template: path.resolve(__dirname, '../src/view/register/index.html'),
      minify: {
        html5: true,
        collapseWhitespace: true,
        removeComments: true,
        removeTagWhitespace: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true
      },
      templateParameters: {
        jsPath: env.PUBLISH_PATH ? config.build.assetsPublicPathPublish : (config.build.assetsPublicPath + '/profill')
      },
      filename: "../register/index.html"
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['react', 'vendors', 'core', 'passport',],
      template: path.resolve(__dirname, '../src/view/passport/index.html'),
      minify: {
        html5: true,
        collapseWhitespace: true,
        removeComments: true,
        removeTagWhitespace: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true
      },
      filename: "../passport/index.html"
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['react', 'vendors', 'core', 'user',],
      template: path.resolve(__dirname, '../src/view/user/index.html'),
      minify: {
        html5: true,
        collapseWhitespace: true,
        removeComments: true,
        removeTagWhitespace: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true
      },
      filename: "../user/index.html"
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['react', 'vendors', 'core', 'asset',],
      template: path.resolve(__dirname, '../src/view/asset/index.html'),
      minify: {
        html5: true,
        collapseWhitespace: true,
        removeComments: true,
        removeTagWhitespace: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true
      },
      filename: "../asset/index.html"
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['react', 'vendors', 'core', 'order',],
      template: path.resolve(__dirname, '../src/view/order/index.html'),
      minify: {
        html5: true,
        collapseWhitespace: true,
        removeComments: true,
        removeTagWhitespace: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true
      },
      filename: "../order/index.html"
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['react', 'vendors', 'core', 'otc',],
      template: path.resolve(__dirname, '../src/view/otc/index.html'),
      minify: {
        html5: true,
        collapseWhitespace: true,
        removeComments: true,
        removeTagWhitespace: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true
      },
      filename: "../otc/index.html"
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['react', 'vendors', 'core', 'trade',],
      template: path.resolve(__dirname, '../src/view/trade/index.html'),
      minify: {
        html5: true,
        collapseWhitespace: true,
        removeComments: true,
        removeTagWhitespace: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true
      },
      filename: "../trade/index.html"
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['react', 'vendors', 'core', 'help',],
      template: path.resolve(__dirname, '../src/view/help/index.html'),
      minify: {
        html5: true,
        collapseWhitespace: true,
        removeComments: true,
        removeTagWhitespace: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true
      },
      filename: "../help/index.html"
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['react', 'vendors', 'core', 'notification',],
      template: path.resolve(__dirname, '../src/view/notification/index.html'),
      minify: {
        html5: true,
        collapseWhitespace: true,
        removeComments: true,
        removeTagWhitespace: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true
      },
      filename: "../notification/index.html"
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['react', 'vendors', 'core', 'message',],
      template: path.resolve(__dirname, '../src/view/message/index.html'),
      minify: {
        html5: true,
        collapseWhitespace: true,
        removeComments: true,
        removeTagWhitespace: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true
      },
      filename: "../message/index.html"
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['react', 'vendors', 'core', 'activity',],
      template: path.resolve(__dirname, '../src/view/activity/index.html'),
      minify: {
        html5: true,
        collapseWhitespace: true,
        removeComments: true,
        removeTagWhitespace: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true
      },
      filename: "../activity/index.html"
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['react', 'vendors', 'core', 'fund',],
      template: path.resolve(__dirname, '../src/view/fund/index.html'),
      minify: {
        html5: true,
        collapseWhitespace: true,
        removeComments: true,
        removeTagWhitespace: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true
      },
      filename: "../fund/index.html"
    }),
  ]
});
