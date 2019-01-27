export default {
  /**
   * 使用方法
   *  1.在ProxyConfig配置好相关参数
   *  2.直接this.Storage.XXX.XX()执行
   *  3.set：存Storage
   *    add：添加一项
   *    del：删除一项，或者根据某一条件删除部分
   *    get：取Storage
   *    handler：最后一个参数为true，则调add，第二个参数为false则调del
   *    removeAll：删除所有
   *     【具体操作查看libs/Storage.js】
   */
  useStorage: true,// 是否开启Storage
  /**
   * name:标识，名称
   * duration:失效间隔
   * expiryTime:到期时间
   * onlySession:只用session
   */
  storageList: [
    {name: 'userToken', duration: 0, expiryTime: 0, default: null, useDefault: true, onlyCookie: true},//userToken
    {name: 'userId', duration: 0, expiryTime: 0, default: null, useDefault: true, onlyCookie: true},//userId
    {name: 'userName', duration: 0, expiryTime: 0, default: null, useDefault: true, onlyCookie: true},//userName
    // {name: 'in', duration: 0, expiryTime: 0, default: null, useDefault: true},//是否为新用户
    {name: 'mo', duration: 0, expiryTime: 0, useDefault: true, onlyCookie: true},//两步认证登录类型
    {name: 'notLoginMarkerId', duration: 0, expiryTime: 0, default: [], useDefault: true, onlyCookie: true},//未登录首页市场数据
    {name: 'wt', duration: 0, expiryTime: 0,default: null, useDefault: false, onlyCookie: true},//token
    {name: 'path', duration: 0, expiryTime: 0,default: null, useDefault: true, onlyCookie: true}, // 上一个页面路径

    // {name: 'userMsg', duration: 0, expiryTime: 0, onlySession:true}, // 用户信息
    // {name: 'marketList', duration: 0, expiryTime: 0}, //首页交易所列表排序
    // {name: 'filterItems', duration: 0, expiryTime: 0}//首页时间和币种维度筛选
    // {name: 'chargeCurrency', duration: 0, expiryTime: 0, onlySession:true}, // 用户信息
    // {name: 'extractCurrency', duration: 0, expiryTime: 0, onlySession:true}, // 用户信息
    // {name: 'coinCurrency', duration: 0, expiryTime: 0, onlySession:true}, // 用户信息

    { name: 'language', duration: 0, expiryTime: 0, onlyCookie: true },//语言设置
    { name: 'c', duration: 0, expiryTime: 0 ,onlyCookie: true},//
    { name: 'os', duration: 0, expiryTime: 0, onlyCookie: true},//设备标识

    {name: 'searchCoin', duration: 0, expiryTime: 0 },//h5-资产-搜索历史记录
  ]
}
