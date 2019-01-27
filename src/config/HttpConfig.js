/**
 * 使用方法
 *  1.在ProxyConfig配置好相关参数
 *  2.直接this.Proxy.XXX生成链接，返回promise
 *      注：若需要参数，this.Proxy.XXX（params）
 */

// import httpAfterHandler from '@/common/js/afterHandler/HttpAfterHandler' // 这里引入http请求后的处理器，没有可以不引入
// import httpPreHandler from '@/common/js/preHandler/HttpPreHandler' // 这里引入http请求前的处理器，没有可以不引入

export default {
  useHttp: true,// 是否开启http
  useHttpZip: false,// 是否开启http压缩
  /**
   * name:请求标识
   * data:请求数据
   *  url:路径
   *  method:请求方式
   *  。。。
   * 注：其他fetch可以传入的参数，也在data里面传入
   */
  // httpPreHandler,
  // httpAfterHandler,
  config: [
    {name: 'activityState', data: {url: '/v1/activity_c/', method: 'post'}, action: 'cfg', actionBack: 'cfgr', loggerInfo:'活动开关'},
    {name: 'checkVersion', data: {url: '/v1/common/', method: 'post'}, action: 'cv', actionBack: 'cvr', loggerInfo:'安卓版本'},
    {name: 'sendChannel', data: {url: '/v1/common/', method: 'post'}, action: 'cs', actionBack: 'csr', loggerInfo:'统计渠道'}
  ],
  user: [ // 用户
    {name: 'getUserInfo', data: {url: '/user/settings/', method: 'post'}, action: 'ui', actionBack: 'uir', needToken: true, loggerInfo:'用户基本数据'}, // 获取用户信息
    {name: 'getUserAuth', data: {url: '/user/settings/', method: 'post'}, action: 'ua', actionBack: 'uar', needToken: true, loggerInfo: '用户认证信息'}, // 获取用户认证信息
    {name: 'getUserCreditsNum', data: {url: '/user/settings/', method: 'post'}, action: 'guc', actionBack: 'gucr', needToken: true, loggerInfo: '用户积分'}, // 获取用户积分
    {name: 'uploadUserAuth', data: {url: '/user/settings/', method: 'post'}, action: 'upa', actionBack: 'upar', needToken: true, loggerInfo: '上传用户认证信息'}, // 上传用户认证信息
    {name: 'getLoginPwd', data: {url: '/user/settings/', method: 'post'}, action: 'mlp', actionBack: 'mlpr', needToken: true, loggerInfo: '设置登录密码'}, // 设置登录密码
    {name: 'getCaptcha', data: {url: '/user/common/', method: 'post'}, action: 'gca', actionBack: 'gcar', loggerInfo: '获取图形验证码'}, // 获取图形验证码
    {name: 'getVerifyCode', data: {url: '/user/common/', method: 'post'}, action: 'gco', actionBack: 'gcor', loggerInfo: '验证码'}, // 获取验证码
    // {name: 'setFundPwd', data: {url: '/user/', method: 'post'}, action: 'setFundPass', actionBack: 'setFundPassRes', needToken: true}, // 设置资金密码
    {name: 'modifyFundPwd', data: {url: '/user/settings/', method: 'post'}, action: 'mfp', actionBack: 'mfpr', needToken: true, loggerInfo: '设置修改资金密码'}, // 修改资金密码
    {name: 'bindUser', data: {url: '/user/settings/', method: 'post'}, action: 'ba', actionBack: 'bar', needToken: true, loggerInfo: '绑定手机邮箱'}, // 绑定手机邮箱
    {name: 'getGoogle', data: {url: '/user/settings/', method: 'post'}, action: 'gs', actionBack: 'gsr', needToken: true, loggerInfo: '谷歌验证密钥'}, // 获取谷歌验证密钥
    {name: 'getCurrentLogin', data: {url: '/user/settings/', method: 'post'}, action: 'gll', actionBack: 'gllr', needToken: true, loggerInfo: '获取当前登录设备列表'}, // 获取当前登录设备列表
    {name: 'getLoginList', data: {url: '/user/settings/', method: 'post'}, action: 'gor', actionBack: 'gorr', needToken: true, loggerInfo: '获取登录日志'}, // 获取登录日志
    {name: 'getUserCredits', data: {url: '/user/settings/', method: 'post'}, action: 'uch', actionBack: 'uchr', needToken: true, loggerInfo: '获取积分详情'}, // 获取积分详情
    {name: 'getIpList', data: {url: '/user/settings/', method: 'post'}, action: 'iwl', actionBack: 'iwlr', needToken: true, loggerInfo: '查看ip白名单'}, // 查看ip白名单
    {name: 'addIp', data: {url: '/user/settings/', method: 'post'}, action: 'ii', actionBack: 'iir', needToken: true, loggerInfo: '添加ip白名单'}, // 添加ip白名单
    {name: 'deletIp', data: {url: '/user/settings/', method: 'post'}, action: 'di', actionBack: 'dir', needToken: true, loggerInfo: '删除ip白名单'}, // 删除ip白名单
    {name: 'setFundPwdSuspend', data: {url: '/user/settings/', method: 'post'}, action: 'sfs', actionBack: 'sfsr', needToken: true, loggerInfo: '设置资金密码输入间隔'}, // 设置资金密码输入间隔
    {name: 'getFundPwdSuspend', data: {url: '/user/settings/', method: 'post'}, action: 'gfs', actionBack: 'gfsr', needToken: true, loggerInfo: '查看资金密码输入间隔'}, // 查看资金密码输入间隔
    {name: 'setTwoVerify', data: {url: '/user/settings/', method: 'post'}, action: 'sv', actionBack: 'svr', needToken: true, loggerInfo: '修改两步认证'}, // 修改两步认证
    {name: 'setGoogleVerify', data: {url: '/user/settings/', method: 'post'}, action: 'vgc', actionBack: 'vgcr', needToken: true, loggerInfo: '验证谷歌验证码'}, // 验证谷歌验证码
    {name: 'setUserNotify', data: {url: '/user/settings/', method: 'post'}, action: 'sut', actionBack: 'sutr', needToken: true, loggerInfo: '修改通知方式'}, // 修改通知方式
    {name: 'outOther', data: {url: '/user/settings/', method: 'post'}, action: 'kfc', actionBack: 'kfcr', needToken: true, loggerInfo: '退出其他设备'}, // 退出其他设备
    {name: 'newPaymentAccount', data: {url: '/user/settings/', method: 'post'}, action: 'newPaymentAccount', actionBack: 'newPaymentAccountr', needToken: true, loggerInfo: '添加收付款账号'},
    {name: 'updatePaymentAccount', data: {url: '/user/settings/', method: 'post'}, action: 'updatePaymentAccount', actionBack: 'updatePaymentAccountr', needToken: true, loggerInfo: '更新收付款账号'},
    {name: 'delPaymentAccount', data: {url: '/user/settings/', method: 'post'}, action: 'delPaymentAccount', actionBack: 'delPaymentAccountr', needToken: true, loggerInfo: '删除收付款账号'},
    {name: 'setPaymentAccountUsable', data: {url: '/user/settings/', method: 'post'}, action: 'setPaymentAccountUsable', actionBack: 'setPaymentAccountUsabler', needToken: true, loggerInfo: '开关收付款账号'},
    {name: 'myPaymentAccounts', data: {url: '/user/settings/', method: 'post'}, action: 'myPaymentAccounts', actionBack: 'myPaymentAccountsr', needToken: true, loggerInfo: '我的收付款账号列表'},

    {name: 'getQbtTrade', data: {url: '/v1/common/', method: 'post'}, action: 'ai', actionBack: 'air', loggerInfo: '关于我们'}, //关于我们
    {name: 'getIPAddr', data: {url: '/v1/common/', method: 'post'}, action: 'ia', actionBack: 'iar', loggerInfo: '获取当前iP'}, // 获取当前iP
    {name: 'getAward', data: {url: '/v1/user/', method: 'post'}, action: 'ga', actionBack: 'gar', needToken: true, loggerInfo: '领取奖励'}, // 领取奖励

    {name: 'hasStore', data: {url: '/v1/otc/order/', method: 'post'}, action: 'otcHasStore', actionBack: 'otcHasStorer', needToken: true, loggerInfo: '判断用户是否开通商铺'}, // 判断用户是否开通商铺
  ],
  notice: [
    {name: 'getActivity', data: {url: '/v1/common/', method: 'post'}, action: 'at', actionBack: 'atr', loggerInfo: '资讯公告内容'}, // 资讯公告内容
    {name: 'getUserNocticeList', data: {url: '/v1/user/', method: 'post'}, action: 'gunl', actionBack: 'gunlr', needToken: true, loggerInfo: '获取通知列表'}, // 获取通知列表
    {name: 'upDateUserNocticeList', data: {url: '/v1/user/', method: 'post'}, action: 'uuns', actionBack: 'uunsr', needToken: true, loggerInfo: '读取通知'}, // 读取通知
    {name: 'readAllUserNotifications', data: {url: '/v1/user/', method: 'post'}, action: 'rauns', actionBack: 'raunsr', needToken: true, loggerInfo: '清除全部通知'}, // 清除全部通知
  ],
  market: [
    //币种资料
    { name: 'coinInfo', data: { url: '/v1/common/', method: 'post' }, action: 'ci', actionBack: 'cir', loggerInfo:'币种资料'},
    //平台币资料
    { name: 'getQb', data: { url: '/v1/common/', method: 'post' }, action: 'qd', actionBack: 'qdr' , loggerInfo:'平台币资料'},
    // 获取交易对名称以及id
    {name: 'pairInfo', data: {url: '/v1/common/', method: 'post'}, action: 'al', actionBack: 'alr', loggerInfo:'全部交易对'},
    // 获取推荐交易对
    {name: 'getRecommendCoins', data: {url: '/v1/common/', method: 'post'}, action: 'rc', actionBack: 'rcr', loggerInfo:'推荐交易对'},
    // 添加收藏
    {name: 'changeFavorite', data: {url: '/v1/user/', method: 'post'}, action: 'cf', actionBack: 'cfr', needToken: true, loggerInfo:'收藏' },
    // 获取收藏
    {name: 'getFavoriteList', data: {url: '/v1/user/', method: 'post'}, action: 'fl', actionBack: 'flr', needToken: true, loggerInfo:'收藏数据' },
    // 获取交易对
    {name: 'getAllChg', data: {url: '/v1/common/', method: 'post'}, action: 'gac', actionBack: 'gacr', loggerInfo:'涨跌幅数据' },
    {name: 'getBank', data: {url: '/v1/common/', method: 'post'}, action: 'ra', actionBack: 'rar', loggerInfo:'汇率数据' }
  ],
  asset: [
    // 获取交易对手续费5.16（pass）
    {name: 'getFee', data: {url: '/v1/common/', method: 'post'}, action: 'atp', actionBack: 'atpr', loggerInfo:'交易对手续费'},
    // 获取总资产(包含各个钱包币种的详细信息)4.1
    {name: 'totalAsset', data: {url: '/v1/property/', method: 'post'}, action: 'gp', actionBack: 'gpr', needToken: true, loggerInfo:'总资产(包含各个钱包币种的详细信息)'},
    // 获取全部币种列表
    {name: 'getAllCoinList', data: {url: '/v1/common/', method: 'post'}, action: 'gai', actionBack: 'gair', loggerInfo:'全部币种列表'},
    //24小时提现额度, 查询币种额度，4.2
    {name: 'balance', data: {url: '/v1/property/', method: 'post'}, action: 'gb', actionBack: 'gbr', needToken: true, loggerInfo:' 币种额度'},
    // 充币地址查询4.4（pass）
    {name: 'chargeAddress', data: {url: '/v1/property/', method: 'post'}, action: 'ca', actionBack: 'car', needToken: true, loggerInfo:'充币地址查询'},
    // 充提记录4.10
    {name: 'history', data: {url: '/v1/property/', method: 'post'}, action: 'cr', actionBack: 'crr', needToken: true, loggerInfo:'充提记录'},
    // 提币矿工费4.5
    {name: 'minerFee', data: {url: '/v1/property/', method: 'post'}, action: 'mf', actionBack: 'mfr', needToken: true, loggerInfo:'提币矿工费'},
    // 提币地址查询4.7（pass）
    {name: 'extractAddress', data: {url: '/v1/property/', method: 'post'}, action: 'wa', actionBack: 'war', needToken: true, loggerInfo:'提币地址查询'},
    // 提交提币订单4.6（pass）
    {name: 'extractOrder', data: {url: '/v1/property/', method: 'post'}, action: 'wd', actionBack: 'wdr', needToken: true, loggerInfo:'提交提币订单'},
    // 撤销提币申请
    {name: 'cancelWithdraw', data: {url: '/v1/property/', method: 'post'}, action: 'cwd', actionBack: 'cwdr', needToken: true, loggerInfo:'撤销提币申请'},
    //增加提币地址4.8(需要登录)（pass）
    {name: 'addAddress', data: {url: '/v1/property/', method: 'post'}, action: 'awa', actionBack: 'awar', needToken: true, loggerInfo:'增加提币地址'},
    // 删除提币地址4.9(需要登录)（pass）
    {name: 'delAddress', data: {url: '/v1/property/', method: 'post'}, action: 'dwa', actionBack: 'dwar', needToken: true, loggerInfo:'删除提币地址'},
    // 验证资金密码
    {name: 'verifyFundPass', data: {url: '/v1/user/', method: 'post'}, action: 'vf', actionBack: 'vfr', needToken: true, loggerInfo:'验证资金密码'},

    //otc资产
    {name: 'otcAccount', data: {url: '/v1/otc/property/', method: 'post'}, action: 'otcGetAccountStock', actionBack: 'otcGetAccountStockr', needToken: true, loggerInfo: 'otc资产列表'},
    {name: 'otcChargeAddress', data: {url: '/v1/otc/property/', method: 'post'}, action: 'otcGetCurrencyAddress', actionBack: 'otcGetCurrencyAddressr', needToken: true, loggerInfo: 'otc充币地址'},
    {name: 'otcHistory', data: {url: '/v1/otc/property/', method: 'post'}, action: 'otcGetAccountRecords', actionBack: 'otcGetAccountRecordsr', needToken: true, loggerInfo: 'otc资产记录'},
    {name: 'otcChargeHistory', data: {url: '/v1/otc/property/', method: 'post'}, action: 'otcGetChargeRecords', actionBack: 'otcGetChargeRecordsr', needToken: true, loggerInfo: 'otc获取充币记录'},
    {name: 'transferIn', data: {url: '/v1/otc/property/', method: 'post'}, action: 'otcTransferFromExchange', actionBack: 'otcTransferFromExchanger', needToken: true, loggerInfo: '交易所资金划转到otc'},
    {name: 'transferOut', data: {url: '/v1/otc/property/', method: 'post'}, action: 'otcTransferToExchange', actionBack: 'otcTransferToExchanger', needToken: true, loggerInfo: 'otc资金划转到交易所'},

    //套利寶
    {name: 'fundHistory', data: {url: '/v1/funds/', method: 'post'}, action: 'assetHistory', actionBack: 'assetHistoryr', needToken: true, loggerInfo: '套利宝资产记录'},
    {name: 'getMyFund', data: {url: '/v1/funds/', method: 'post'}, action: 'userFundList', actionBack: 'userFundListr', needToken: true, loggerInfo: '我的投资列表'},
    {name: 'fundAccount', data: {url: '/v1/funds/', method: 'post'}, action: 'userAccount', actionBack: 'userAccountr', needToken: true, loggerInfo: '套利宝账户信息'},
    {name: 'earningsHistory', data: {url: '/v1/funds/', method: 'post'}, action: 'profitList', actionBack: 'profitListr', needToken: true, loggerInfo: '累计收益记录'},
    {name: 'redeemFund', data: {url: '/v1/funds/', method: 'post'}, action: 'redeemFund', actionBack: 'redeemFundr', needToken: true, loggerInfo: '赎回套利宝'},
    {name: 'bankCard', data: {url: '/v1/funds/', method: 'post'}, action: 'productRelatedInfo', actionBack: 'productRelatedInfor', needToken: true, loggerInfo: '银行卡列表'},
    {name: 'fundTransfer', data: {url: '/v1/funds/', method: 'post'}, action: 'fundTransfer', actionBack: 'fundTransferr', needToken: true, loggerInfo: '套利宝资金划转'},

  ],
  userOrder: [
    //当前订单
    {name: 'currentOrder', data: {url: '/v1/order/', method: 'post'}, action: 'co', actionBack: 'cor', needToken: true, loggerInfo:'当前订单数据'},
    //历史订单
    {name: 'historyOrder', data: {url: '/v1/order/', method: 'post'}, action: 'cor', actionBack: 'corr', needToken: true, loggerInfo:'历史订单数据'},
    //订单详情
    {name: 'orderDetail', data: {url: '/v1/order/', method: 'post'}, action: 'od', actionBack: 'odr', needToken: true, loggerInfo:'订单详情数据'},
    //近期交易市场
    {name: 'recentOrderMarket', data: {url: '/v1/common/', method: 'post'}, action: 'rom', actionBack: 'romr', loggerInfo:'近期交易市场数据'},
    //近期交易个人
    {name: 'recentOrderUser', data: {url: '/v1/order/', method: 'post'}, action: 'rou', actionBack: 'rour', needToken: true, loggerInfo:'近期交易个人数据'},
    //挂单列表
    {name: 'getDepth', data: {url: '/v1/common/', method: 'post'}, action: 'gd', actionBack: 'gdr', loggerInfo:'挂单列表深度数据'},
    //撤单操作
    {name: 'cancelOrder', data: {url: '/v1/order/', method: 'post'}, action: 'can', actionBack: 'canr', needToken: true, loggerInfo:'撤单'},
    // 获取k线数据
    {name: 'getKline', data: {url: '/v1/common/', method: 'post'}, action: 'gk', actionBack: 'gkr', loggerInfo:'k线数据'},

    {name: 'otcSaleDetail', data: {url: '/v1/otc/order/', method: 'post'}, action: 'otcSaleDetail', actionBack: 'otcSaleDetailr',needToken: true, loggerInfo:'确定订单广告详情'},
    {name: 'getPrice', data: {url: '/v1/otc/common/', method: 'post'}, action: 'getPrice', actionBack: 'getPricer', loggerInfo:'单个币种价格'},
    {name: 'otcOrderStore', data: {url: '/v1/otc/order/', method: 'post'}, action: 'otcOrderStore', actionBack: 'otcOrderStorer', needToken: true, loggerInfo:'otc订单列表'},
    {name: 'otcNewOrder', data: {url: '/v1/otc/order/', method: 'post'}, action: 'otcNewOrder', actionBack: 'otcNewOrderr', needToken: true, loggerInfo:'otc生成订单'},
    {name: 'otcUpdateOrder', data: {url: '/v1/otc/order/', method: 'post'}, action: 'otcUpdateOrder', actionBack: 'otcUpdateOrderr', needToken: true, loggerInfo:'订单标记状态'},
    {name: 'otcCancelOrder', data: {url: '/v1/otc/order/', method: 'post'}, action: 'otcCancelOrder', actionBack: 'otcCancelOrderr', needToken: true, loggerInfo:'取消otc订单'},
    {name: 'otcNewRate', data: {url: '/v1/otc/order/', method: 'post'}, action: 'otcNewRate', actionBack: 'otcNewRater', needToken: true, loggerInfo:'用户评价'},
    {name: 'otcUnread', data: {url: '/v1/otc/chat/', method: 'post'}, action: 'guo', actionBack: 'guor', needToken: true, loggerInfo:'otc未读消息订单'},
    {name: 'otcChat', data: {url: '/v1/otc/chat/', method: 'post'}, action: 'gm', actionBack: 'gmr', needToken: true, loggerInfo:'otc聊天记录'},
    {name: 'otcGetOrders', data: {url: '/v1/otc/order/', method: 'post'}, action: 'otcGetOrders', actionBack: 'otcGetOrdersr', needToken: true, loggerInfo:'otc单个订单详情'},
    {name: 'salesPaymentAccounts', data: {url: '/v1/otc/user/', method: 'post'}, action: 'salesPaymentAccounts', actionBack: 'salesPaymentAccountsr', needToken: true, loggerInfo: '卖家收付款账号列表'},
    {name: 'otcNewAppealAdd', data: {url: '/v1/otc/order/', method: 'post'}, action: 'otcNewAppealAdd', actionBack: 'otcNewAppealAddr', needToken: true, loggerInfo: '申诉订单'},
    {name: 'otcReadOderMessages', data: {url: '/v1/otc/chat/', method: 'post'}, action: 'otcReadOderMessages', actionBack: 'otcReadOderMessagesr', needToken: true, loggerInfo: '设置订单消息已读'},


    // 套利宝
    {name: 'fundOrderList', data: {url: '/v1/funds/', method: 'post'}, action: 'orderList', actionBack: 'orderListr', needToken: true, loggerInfo: '获取套利宝订单数据'},
    {name: 'fundOrderMark', data: {url: '/v1/funds/', method: 'post'}, action: 'orderMark', actionBack: 'orderMarkr', needToken: true, loggerInfo: '标记订单状态'},
    {name: 'fundGatheringCard', data: {url: '/v1/funds/', method: 'post'}, action: 'gatheringCard', actionBack: 'gatheringCardr', needToken: true, loggerInfo: '获取收款银行卡信息'},
    {name: 'fundOrderInfo', data: {url: '/v1/funds/', method: 'post'}, action: 'orderInfo', actionBack: 'orderInfor', needToken: true, loggerInfo: '查询指定订单详情'},

  ],
  deal: [
    //交易接口
    // {name: 'dealExchange', data: {url: '/order/', method: 'post'}, action: 'makeOrder', actionBack: 'makeOrderRes', needToken: true}
    {name: 'dealExchange', data: {url: '/v1/order/', method: 'post'}, action: 'mo', actionBack: 'mor', needToken: true, loggerInfo:'下单操作'},
    {name: 'getCoinMinTrade', data: {url: '/v1/common/', method: 'post'}, action: 'gcm', actionBack: 'gcmr', loggerInfo:'最小交易量数据'},
    {name: 'getCharge', data: {url: '/v1/common/', method: 'post'}, action: 'gai', actionBack: 'gair', loggerInfo:'是否可充提'}
  ],
  activity: [
    // 获取我的QBT
    { name: 'getMyQbt', data: { url: '/v1/activity/', method: 'post' }, action: 'gmq', actionBack: 'gmqr', needToken: true, loggerInfo:'我的QBT'},
    // { name: 'getMyQbt', data: { url: '/v1/user/', method: 'post' }, action: 'gmq', actionBack: 'gmqr', needToken: true, loggerInfo:'我的QBT'},
    // 获取邀请列表
    { name: 'getInvited', data: { url: '/v1/activity/', method: 'post' }, action: 'gi', actionBack: 'gir', needToken: true, loggerInfo:'邀请列表'},
    // { name: 'getInvited', data: { url: '/v1/user/', method: 'post' }, action: 'gi', actionBack: 'gir', needToken: true, loggerInfo:'邀请列表'},
    // 获取活动排行榜
    { name: 'getRankingList', data: { url: '/v1/user/', method: 'post' }, action: 'qr', actionBack: 'qrr', needToken: true, loggerInfo:'活动排行榜'},
    // 活动内容
    {name: 'getHomeBanner', data: {url: '/v1/common/', method: 'post'}, action: 'hb', actionBack: 'hbr', loggerInfo:'活动内容'},
    //TODO 获取QBT信息
    { name: 'getQbtInfo', data: { url: '/v1/common/', method: 'post' }, action: 'qd', actionBack: 'qdr', loggerInfo:'QBT信息'},
    // 注册活动
    { name: 'getAward', data: { url: '/v1/activity_c/', method: 'post' }, action: 'ga', actionBack: 'gar', loggerInfo:'注册活动'},
    // 活动快速注册
    { name: 'getInviteCode', data: { url: '/v1/activity/', method: 'post' }, action: 'gic', actionBack: 'gicr', needToken: true, loggerInfo:'获取活动邀请码'}
  ],
  login: [
    // {name: 'getVerifyCodeLogin', data: {url: '/user/common/', method: 'post'}, action: 'gco', actionBack: 'gcor', loggerInfo: '验证码'}, // 获取验证码
    // {name: 'getCaptchaLogin', data: {url: '/user/common/', method: 'post'}, action: 'gca', actionBack: 'gcar', loggerInfo: '获取图形验证码'}, // 获取图形验证码
    {name: 'forgetLoginPass', data: {url: '/user/common/', method: 'post'}, action: 'flp', actionBack: 'flpr', loggerInfo: '找回密码'}, // 找回密码
    {name: 'register', data: {url: '/user/register/', method: 'post'}, action: 'reg', actionBack: 'regr', loggerInfo: '注册'}, // 注册
    {name: 'login', data: {url: '/user/login/', method: 'post'}, action: 'log', actionBack: 'logr', loggerInfo: '登录'}, // 登录
  ],
  fund: [ // 套利宝
    {name: 'getFundProduct', data: {url: '/v1/funds_c/', method: 'post'}, action: 'productList', actionBack: 'productListr', loggerInfo: '获取套利宝首页产品'},
    // {name: 'redeemFund', data: {url: '/v1/funds/', method: 'post'}, action: 'frdm', actionBack: 'frdmr', needToken: true, loggerInfo: '赎回套利宝'},
    // {name: 'getMyFund', data: {url: '/v1/funds/', method: 'post'}, action: 'fui', actionBack: 'fuir', needToken: true, loggerInfo: '获取我的持有套利宝'},
    {name: 'fundDeal', data: {url: '/v1/funds/', method: 'post'}, action: 'buy', actionBack: 'buyr', needToken: true,loggerInfo: '申购操作'},
    // {name: 'fundHistory', data: {url: '/v1/funds/', method: 'post'}, action: 'fel', actionBack: 'felr', needToken: true,loggerInfo: '收益记录'},
  ],

  otc: [
    {name: 'otcNewSale', data: {url: '/v1/otc/order/', method: 'post'}, action: 'otcNewSale', actionBack: 'otcNewSaler', needToken: true, loggerInfo: '创建新的广告'},
    {name: 'priceList', data: {url: '/v1/otc/common/', method: 'post'}, action: 'getPriceList', actionBack: 'getPriceListr', loggerInfo: '币种价格列表'},
    {name: 'boundaryPrice', data: {url: '/v1/otc/common/', method: 'post'}, action: 'otcGetOrderMinOrMax', actionBack: 'otcGetOrderMinOrMaxr', loggerInfo: 'Otc广告最高或最低价格'},


    {name: 'otcSales', data: {url: '/v1/otc/common/', method: 'post'}, action: 'otcSales', actionBack: 'otcSalesr', loggerInfo: '首页广告列表'},
    {name: 'canDealCoins', data: {url: '/v1/otc/common/', method: 'post'}, action: 'canDealCoins', actionBack: 'canDealCoinsr', loggerInfo: '首页可交易币种列表', needDbpro: true},
    {name: 'traderInfo', data: {url: '/v1/otc/common/', method: 'post'}, action: 'traderInfo', actionBack: 'traderInfor', loggerInfo: '商户信息'},
    {name: 'otcQuickBuy', data: {url: '/v1/otc/order/', method: 'post'}, action: 'otcQuickBuy', actionBack: 'otcQuickBuyr', needToken: true, loggerInfo: '快速购买'},
    {name: 'otcHandleSale', data: {url: '/v1/otc/order/', method: 'post'}, action: 'otcHandleSale', actionBack: 'otcHandleSaler', needToken: true, loggerInfo: 'otc广告上架下架'},
    {name: 'otcDelSale', data: {url: '/v1/otc/order/', method: 'post'}, action: 'otcDelSale', actionBack: 'otcDelSaler', needToken: true, loggerInfo: 'otc广告删除'},
  ]
}
