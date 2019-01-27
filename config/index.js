'use strict'

const path = require('path')

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: '/static',
    assetsPublicPath: '/',
    mode:'development',

    host: '0.0.0.0', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,


    devtool: 'cheap-module-eval-source-map',

    //导入变量
    externals:{}
  },

  build: {

    mode: 'production',
    // Paths
    assetsRoot: path.resolve(__dirname, '../dist/js'),
    assetsSubDirectory: '//static.qb.com',
    assetsPublicPath: '//script.qb.com',
    assetsPublicPathPublish: 'https://js.veetao.com/qb/js',

    productionSourceMap: false,
    devtool: '#source-map',

    externals:{}
  }
}
