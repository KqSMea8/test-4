'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  LOG_DEBUG: 2,
  ACTIVITY_PATH: '"/activity"',
  ASSET_PATH: '"/asset"',
  FUND_PATH: '"/fund"',
  HELP_PATH: '"/help"',
  HOME_PATH: '"/"',
  LOGIN_PATH: '"/login"',
  MESSAGE_PATH: '"/message"',
  NOTIFICATION_PATH: '"/notice"',
  ORDER_PATH: '"/order"',
  OTC_PATH: '"/otc"',
  PASSPORT_PATH: '"/passport"',
  REGISTER_PATH: '"/register"',
  TRADE_PATH: '"/trade"',
  USER_PATH: '"/user"',
  STATIC_PATH: '"/static"',
  DOMAIN: '"127.0.0.1"',
  STATICS_FLAG: false,//禁止发送请求数据，正式上线需改为true
})
