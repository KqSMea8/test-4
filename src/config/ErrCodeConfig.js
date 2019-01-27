import intl from "react-intl-universal";

export default {
  "-1": {
    // msg: "FETCH错误",
    get msg() {
      return intl.get("-1");
    },
    errCode: "FETCH_ERROR"
  },
  "-2": {
    // msg: "RESPONES解析错误",
    get msg() {
      return intl.get("-2");
    },
    errCode: "RESPONES_TEXT_ERROR"
  },
  "-3": {
    // msg: "JSON解析错误",
    get msg() {
      return intl.get("-3");
    },
    errCode: "JSON_PARSE_ERROR"
  },
  "-4": {
    // msg: "压缩错误",
    get msg() {
      return intl.get("-4");
    },
    errCode: "ZIP_PARSE_ERROR"
  },
  "-5": {
    // msg: "解压缩错误",
    get msg() {
      return intl.get("-5");
    },
    errCode: "UNZIP_PARSE_ERROR"
  },
  "-6": {
    // msg: "Blob数据解析错误",
    get msg() {
      return intl.get("-6");
    },
    errCode: "BLOB_PARSE_ERROR"
  },
  1: {
    // msg: "未知错误",
    get msg() {
      return intl.get(1);
    },
    errCode: "ErrCodeUnknown",
    ret: 1
  },
  2: {
    // msg: "数据库错误",
    get msg() {
      return intl.get(2);
    },
    errCode: "ErrCodeUnknown",
    ret: 2
  },
  10: {
    // msg: "不能下单给自己",
    get msg() {
      return intl.get(10);
    },
    errCode: "ORDERTOSELF",
    ret: 10
  },
  11: {
    // msg: "卖家(对方)电子币不足",
    get msg() {
      return intl.get(11);
    },
    errCode: "ORDERNOENOUGH",
    ret: 11
  },
  12: {
    // msg: "没有这条发布信息",
    get msg() {
      return intl.get(12);
    },
    errCode: "ORDERNOPUBLISH",
    ret: 12
  },
  13: {
    // msg: "买家(对方)有订单未完成",
    get msg() {
      return intl.get(13);
    },
    errCode: "ORDERNOTFINIDH",
    ret: 13
  },
  14: {
    // msg: "当天取消订单超过5次",
    get msg() {
      return intl.get(14);
    },
    errCode: "ORDERCANCELFIVE",
    ret: 14
  },
  15: {
    // msg: "对方当天取消订单超过5次",
    get msg() {
      return intl.get(15);
    },
    errCode: "ORDERCANCELFIVEO",
    ret: 15
  },
  16: {
    // msg: "只有买家可以取消订单",
    get msg() {
      return intl.get(16);
    },
    errCode: "ORDERCANCELNOTBUYER",
    ret: 16
  },
  17: {
    // msg: "买家(你自己)电子币不足",
    get msg() {
      return intl.get(17);
    },
    errCode: "ORDERNOENOUGHSELF",
    ret: 17
  },
  18: {
    // msg: "买家(你自己)有订单未完成",
    get msg() {
      return intl.get(18);
    },
    errCode: "ORDERNOTFINIDHSELF",
    ret: 18
  },
  19: {
    // msg: "重建订单 广告已下架",
    get msg() {
      return intl.get(19);
    },
    errCode: "ORDERNOTONSALE",
    ret: 19
  },
  20: {
    // msg: "发布出售,电子币不足",
    get msg() {
      return intl.get(20);
    },
    errCode: "SALENOENOUGH",
    ret: 20
  },
  21: {
    // msg: "最多可同时发布3条广告",
    get msg() {
      return intl.get(21);
    },
    errCode: "SALETHREE",
    ret: 21
  },
  22: {
    // msg: "一个币种同时只能上架一条广告",
    get msg() {
      return intl.get(22);
    },
    errCode: "SALESAMECOIN",
    ret: 22
  },
  23: {
    // msg: "广告金额不合规",
    get msg() {
      return intl.get(23);
    },
    errCode: "SALEMONEYINVALID",
    ret: 23
  },
  24: {
    // msg: "大额认证无效",
    get msg() {
      return intl.get(24);
    },
    errCode: "SALEVERIFYINVALID",
    ret: 24
  },
  26: {
    // msg: "下卖单需要传入资金密码",
    get msg() {
      return intl.get(26);
    },
    errCode: "NEED_FUNDPASS",
    ret: 26
  },
  27: {
    // msg: "订单的状态不对或者订单不存在",
    get msg() {
      return intl.get(27);
    },
    errCode: "ORDER_STATE_ERROR",
    ret: 27
  },
  28: {
    // msg: "有三个以上的订单未完成",
    get msg() {
      return intl.get(28);
    },
    errCode: "ORDER_UNDONE",
    ret: 28
  },
  31: {
    // msg: "钱包余额小于0",
    get msg() {
      return intl.get(31);
    },
    errCode: "WITHDRAWZERO",
    ret: 31
  },
  32: {
    // msg: "钱包金额不足",
    get msg() {
      return intl.get(32);
    },
    errCode: "WITHDRAWNOENOUGH",
    ret: 32
  },
  33: {
    // msg: "小于提币限额",
    get msg() {
      return intl.get(33);
    },
    errCode: "WITHDTOOLITTLE",
    ret: 33
  },
  34: {
    // msg: "大于24小时提币限额",
    get msg() {
      return intl.get(34);
    },
    errCode: "WITHDRAWOVER24HLIMIT",
    ret: 34
  },
  41: {
    // msg: "评价无此订单",
    get msg() {
      return intl.get(41);
    },
    errCode: "RATENOSUCHORDER",
    ret: 41
  },
  42: {
    // msg: "双方已评价",
    get msg() {
      return intl.get(42);
    },
    errCode: "RATEBOTH",
    ret: 42
  },
  43: {
    // msg: "订单未完成",
    get msg() {
      return intl.get(43);
    },
    errCode: "RATENOTFIN",
    ret: 43
  },
  44: {
    // msg: "卖家ID错误",
    get msg() {
      return intl.get(44);
    },
    errCode: "RATEBADSELLER",
    ret: 44
  },
  45: {
    // msg: "买家已评价",
    get msg() {
      return intl.get(45);
    },
    errCode: "RATEDBUYER",
    ret: 45
  },
  46: {
    // msg: "买家ID错误",
    get msg() {
      return intl.get(46);
    },
    errCode: "RATEBADBUYER",
    ret: 46
  },
  47: {
    // msg: "卖家已评价",
    get msg() {
      return intl.get(47);
    },
    errCode: "RATEDSELLER",
    ret: 47
  },
  48: {
    // msg: "不是你的订单",
    get msg() {
      return intl.get(48);
    },
    errCode: "RATENOTUORDER",
    ret: 48
  },
  95: {
    // msg: "参数错误",
    get msg() {
      return intl.get(95);
    },
    errCode: "ErrCodeUnknown",
    ret: 95
  },
  98: {
    // msg: "下单时对方改变价格",
    get msg() {
      return intl.get(98);
    },
    errCode: "ErrCodeUnknown",
    ret: 98
  },
  99: {
    // msg: "广告可交易量不足",
    get msg() {
      return intl.get(99);
    },
    errCode: "ErrCodeUnknown",
    ret: 99
  },
  101: {
    // msg: "身份认证进行中",
    get msg() {
      return intl.get(101);
    },
    errCode: "ErrCodeUnknown",
    ret: 101
  },
  102: {
    // msg: "身份认证状态不识别",
    get msg() {
      return intl.get(102);
    },
    errCode: "ErrCodeUnknown",
    ret: 102
  },
  103: {
    // msg: "身份认证已通过",
    get msg() {
      return intl.get(103);
    },
    errCode: "ErrCodeUnknown",
    ret: 103
  },
  109: {
    // msg: "身份认证已通过",
    get msg() {
      return intl.get(109);
    },
    errCode: "ErrCodeUnknown",
    ret: 109
  },
  200: {
    // msg: "身份认证已通过",
    get msg() {
      return intl.get(200);
    },
    errCode: "ParamsErr",
    ret: 200
  },
  201: {
    // msg: "半小时内发送超过5次登录验证码",
    get msg() {
      return intl.get(201);
    },
    errCode: "CodeSentFiveTimesInHalfHour",
    ret: 201
  },
  240: {
    // msg: "评论已删除",
    get msg() {
      return intl.get(240);
    },
    errCode: "RATEDELETED",
    ret: 240
  },
  241: {
    // msg: "评论已超时不可删除",
    get msg() {
      return intl.get(241);
    },
    errCode: "RATEOVERTIME",
    ret: 241
  },
  250: {
    // msg: "系统维护中",
    get msg() {
      return intl.get(250);
    },
    errCode: "SystemIsMaintaining",
    ret: 250
  },
  254: {
    // msg: "订单申诉中",
    get msg() {
      return intl.get(254);
    },
    errCode: "SystemIsMaintaining",
    ret: 254
  },
  260: {
    // msg: "系统维护中",
    get msg() {
      return intl.get(260);
    },
    errCode: "AppShouldUpdate",
    ret: 260
  },
  402: {
    // msg: '取消次数过多'
    get msg() {
      return intl.get(402)
    },
    errCode: "ORDER_OVER_MAXORMIN",
    ret: 403
  },
  403: {
    // msg: '订单超过最大或最小限制'
    get msg() {
      return intl.get(403)
    },
    errCode: "ORDER_OVER_MAXORMIN",
    ret: 403
  },
  414: {
    get msg() {
      return intl.get(414);
    },
    errCode: "ORDER_INFO_ERROR",
    ret: 414
  },
  424: {
    // msg: "未补充信息此收款方式",
    get msg() {
      return intl.get(424);
    },
    errCode: "SALE_PAYMENT_LACK",
    ret: 424
  },
  425: {
    // msg: "广告中含有未执行完成的订单",
    get msg() {
      return intl.get(425);
    },
    errCode: "SALE_HASORDER_UNDONE",
    ret: 425
  },
  427: {
    // msg: "广告状态不匹配，请刷新后重试。",
    get msg() {
      return intl.get(427);
    },
    errCode: "SALE_HASORDER_UNDONE",
    ret: 427
  },

  601: {
    // msg: "密码错误",
    get msg() {
      return intl.get(601);
    },
    errCode: "PWD_ERROR",
    ret: 601
  },
  602: {
    // msg: "数据库错误",
    get msg() {
      return intl.get(602);
    },
    errCode: "DB_ERROR",
    ret: 602
  },
  603: {
    // msg: "请求参数错误",
    get msg() {
      return intl.get(603);
    },
    errCode: "PARAM_ERROR",
    ret: 603
  },
  604: {
    // msg: "无此用户",
    get msg() {
      return intl.get(604);
    },
    errCode: "USER_NO_EXIST",
    ret: 604
  },
  605: {
    // msg: "用户服务系统访问失败",
    get msg() {
      return intl.get(605);
    },
    errCode: "USER_SYS_ERROR",
    ret: 605
  },
  606: {
    // msg: "已发送，未超时3分钟",
    get msg() {
      return intl.get(606);
    },
    errCode: "CODE_NOT_EXPIRE",
    ret: 606
  },
  607: {
    // msg: "验证码已过期",
    get msg() {
      return intl.get(607);
    },
    errCode: "CODE_NOT_EXPIRE",
    ret: 607
  },
  608: {
    // msg: "验证码错误",
    get msg() {
      return intl.get(608);
    },
    errCode: "CODE_NOT_EXPIRE",
    ret: 608
  },
  609: {
    // msg: "操作类型错误",
    get msg() {
      return intl.get(609);
    },
    errCode: "CODE_NOT_EXPIRE",
    ret: 609
  },
  610: {
    // msg: "与原密码相同",
    get msg() {
      return intl.get(610);
    },
    errCode: "CODE_NOT_EXPIRE",
    ret: 610
  },
  611: {
    get msg() {
      return intl.get('1')
    },
    errCode: 'UNKOWN_ERROR',
    ret: 611
  },
  612: {
    // msg: "与原密码相同",
    get msg() {
      return intl.get(612, {number: this.ft % 60 ? parseInt(this.ft / 60) + 1 : parseInt(this.ft / 60)});
    },
    errCode: "FREEZE_PASSWORD",
    ret: 612
  },
  613: {
    // msg: "未登录",
    get msg() {
      return intl.get(613);
    },
    errCode: "UN_LOGIN",
    ret: 613
  },
  616: {
    // msg: "未设置密码",
    get msg() {
      return intl.get(616);
    },
    ret: 616,
    errCode: "NO_SET_PASSWORD"
  },
  617: {
    // msg: "用户未实名认证",
    get msg() {
      return intl.get(617);
    },
    errCode: "NO_VERIFIED",
    ret: 617
  },
  619: {
    // msg: "图形验证码错误",
    get msg() {
      return intl.get(619);
    },
    errCode: "NO_PICTURECODE",
    ret: 619
  },
  620: {
    // msg: "与资金密码相同",
    get msg() {
      return intl.get(620);
    },
    errCode: "NO_PICTURECODE",
    ret: 620
  },
  621: {
    // msg: "与登陆密码相同",
    get msg() {
      return intl.get(621);
    },
    errCode: "NO_PICTURECODE",
    ret: 621
  },
  623: {
    // msg: "与登陆密码相同",
    get msg() {
      return intl.get(623);
    },
    errCode: "NO_PICTURECODE",
    ret: 623
  },
  624: {
    // msg: "验证码输入错误次数过多，处于禁止输入时间内",
    get msg() {
      return intl.get(624);
    },
    errCode: "CODE_EXCESSIVE",
    ret: 624
  },
  625: {
    // msg: "谷歌验证码输入错误次数过多，处于禁止输入时间内",
    get msg() {
      return intl.get(625);
    },
    errCode: "GCODE_EXCESSIVE",
    ret: 625
  },
  626: {
    // msg: "用户被禁止",
    get msg() {
      return intl.get(626);
    },
    errCode: "GCODE_EXCESSIVE",
    ret: 626
  },
  627: {
    // msg: "不是管理员",
    get msg() {
      return intl.get(627);
    },
    errCode: "GCODE_EXCESSIVE",
    ret: 627
  },
  628: {
    // msg: "未设置登陆密码",
    get msg() {
      return intl.get(628);
    },
    errCode: "NO_LOGIN_PASSWORD",
    ret: 628
  },
  629: {
    // msg: "用户状态异常",
    get msg() {
      return intl.get(629);
    },
    errCode: "USER_EXCEPTION",
    ret: 629
  },
  630: {
    // msg: "登录错误次数过多，封号状态",
    get msg() {
      if (this.wt === 5) {
        return intl.get('630-1', {number: this.ft % 60 ? parseInt(this.ft / 60) + 1 : parseInt(this.ft / 60)});
      }
      if (this.wt === 6) {
        return intl.get('630-2', {number: this.ft % 3600 ? parseInt(this.ft / 3600) + 1 : parseInt(this.ft / 3600)});
      }
      if (this.wt >= 7) {
        if (this.ft === 518400) {
          return intl.get('630-4')
        }
        return intl.get('630-3', {number: this.ft % 86400 ? parseInt(this.ft / 86400) + 1 : parseInt(this.ft / 86400)});
      }
    },
    errCode: "FREEZE_ACCOUNT",
    ret: 630
  },
  631: {
    // msg: "密码错误",
    get msg() {
      if (!this.wt) {
        return intl.get(601);
      }
      if (this.wt < 4) {
        return intl.get(601);
      }
      if (this.wt === 4) {
        return intl.get('631-1');
      }
    },
    errCode: "LOGIN_PWD_ERROR",
    ret: 631
  },
  632: {
    // msg: "账号被封时，验证登录提示",
    get msg() {
      return intl.get(632);
    },
    errCode: "FREEZE_ACCOUNT_VERIFY_TIP",
    ret: 632
  },
  633: {
    // msg: "对方账户异常, 操作已取消",
    get msg() {
      return intl.get(633);
    },
    errCode: "ACCOUNT_ABNORMAL",
    ret: 633
  },
  635: {
    //msg: '您获取验证码过于频繁，请稍后再试。'
    get msg() {
      return intl.get(635)
    },
    errCode: "GETCODE_FREQUENTLY",
    ret: 635
  },
  636: {
    get msg() {
      return intl.get(636)
    },
    errCode: "INTERNAL_WITHDRAWALS_NOT_ALLOWED",
    ret: 636
  },
  637: {
    // msg: "ip频繁",
    get msg() {
      return intl.get(637);
    },
    errCode: "ErrCodeUnknown",
    ret: 637
  },
  638: {
    // msg: "云盾拦截",
    get msg() {
      return intl.get(638);
    },
    errCode: "ErrCodeUnknown",
    ret: 638
  },
  639: {
    // msg: "图片上传失败，请重试",
    get msg() {
      return intl.get(639);
    },
    errCode: "ErrCodeUnknown",
    ret: 639
  },
  640: {
    // msg: "限制支付条件",
    get msg() {
      return intl.get(640);
    },
    errCode: "ErrCodeUnknown",
  },
  641: {
    // msg: "关闭",
    get msg() {
      return intl.get(641);
    },
    errCode: "ErrCodeUnknown",
  },
  704: {
    // msg: "24小时内修改过资金密码,存在安全保护墙",
    get msg() {
      return intl.get(704);
    },
    errCode: "ALTER_IN_24H",
    ret: 704
  },
  705: {
    // msg: "可用数量不足",
    get msg() {
      return intl.get(705);
    },
    errCode: "NO_ENOUGH",
    ret: 705
  },
  706: {
    // msg: "小于最小提币限额",
    get msg() {
      return intl.get(706);
    },
    errCode: "LESS_MIN_WITHDRAW",
    ret: 706
  },
  707: {
    // msg: "不支持提币操作",
    get msg() {
      return intl.get(707);
    },
    errCode: "NO_SUPPORT_WITHDRAW",
    ret: 707
  },
  708: {
    // msg: "提币超过当日额度",
    get msg() {
      return intl.get(708);
    },
    errCode: "OUT_LIMIT",
    ret: 708
  },
  709: {
    // msg: "提币：查询不到from地址",
    get msg() {
      return intl.get(709);
    },
    errCode: "NO_FROM",
    ret: 709
  },
  710: {
    // msg: "提币：查询不到to地址",
    get msg() {
      return intl.get(710);
    },
    errCode: "NO_TO",
    ret: 710
  },
  711: {
    // msg: "cws错误",
    get msg() {
      return intl.get(711);
    },
    errCode: "CWS_ERROR",
    ret: 711
  },
  712: {
    // msg: "提币地址格式错误",
    get msg() {
      return intl.get(712);
    },
    errCode: "ERROR_ADDRESS",
    ret: 712
  },
  713: {
    // msg: "提币地址地址已存在",
    get msg() {
      return intl.get(713);
    },
    errCode: "ERROR_ADDRESS_EXIST",
    ret: 713
  },
  714: {
    // msg: "不能转账给自己",
    get msg() {
      return intl.get(714);
    },
    errCode: "ERROR_ADDRESS_EXIST",
    ret: 714
  },
  715: {
    // msg: "不能转账给自己",
    get msg() {
      return intl.get(715);
    },
    errCode: "ERROR_ADDRESS_EXIST",
    ret: 715
  },
  716: {
    // msg: "不能转账给自己",
    get msg() {
      return intl.get(716);
    },
    errCode: "ERROR_ADDRESS_EXIST",
    ret: 716
  },
  717: {
    // msg: "不能转账给自己",
    get msg() {
      return intl.get(717);
    },
    errCode: "ERROR_ADDRESS_EXIST",
    ret: 717
  },
  718: {
    // msg: "不能转账给自己",
    get msg() {
      return intl.get(718);
    },
    errCode: "ERROR_ADDRESS_EXIST",
    ret: 718
  },
  719: {
    // msg: "不能转账给自己",
    get msg() {
      return intl.get(719);
    },
    errCode: "ERROR_ADDRESS_EXIST",
    ret: 719
  },
  720: {
    // msg: "不能转账给自己",
    get msg() {
      return intl.get(720);
    },
    errCode: "ERROR_ADDRESS_EXIST",
    ret: 720
  },
  721: {
    // msg: "不能转账给自己",
    get msg() {
      return intl.get(721);
    },
    errCode: "ERROR_ADDRESS_EXIST",
    ret: 721
  },
  1001: {
    // msg: "连接被禁止",
    get msg() {
      return intl.get(1001);
    },
    errCode: "CODE_NOT_EXPIRE",
    ret: 1001
  },
  1002: {
    // msg: "连接时传入的Token不合法",
    get msg() {
      return intl.get(1002);
    },
    errCode: "CODE_NOT_EXPIRE",
    ret: 1002
  },
  1404: {
    //NotFound
    get msg() {
      return intl.get(1404)
    },
    errCode: 'RPC_STATUS_NOT_FOUND',
    ret: 1404
  },
  1410: {
    //获取资产列表出错
    get msg() {
      return intl.get(1410)
    },
    errCode: 'RPC_STATUS_ORDER_GET_ASSET_LIST_ERROR',
    ret: 1410
  },
  1411: {
    //获某个取资出错
    get msg() {
      return intl.get(1411)
    },
    errCode: 'RPC_STATUS_ORDER_GET_ASSET_ERROR',
    ret: 1411
  },
  1412: {
    //资产不足 不能提交订单
    get msg() {
      return intl.get(1412)
    },
    errCode: 'RPC_STATUS_ORDER_ASSET_NOT_ENOUGH_ERROR',
    ret: 1412
  },
  1413: {
    // 锁定资产失败
    get msg() {
      return intl.get(1413)
    },
    errCode: 'RPC_STATUS_ORDER_LOCK_ASSET_ERROR',
    ret: 1413
  },
  1414: {
    // 取消订单时缺少订单ID
    get msg() {
      return intl.get(1414)
    },
    errCode: 'RPC_STATUS_ORDER_CANCEL_NO_ORDERID',
    ret: 1414
  },
  1415: {
    // 取消订单操作不合法
    get msg() {
      return intl.get(1415)
    },
    errCode: 'RPC_STATUS_ORDER_CANCEL_OPERATION_ILLEGAL',
    ret: 1415
  },
  1416: {
    // 市价溢出
    get msg() {
      return intl.get(1416)
    },
    ret: 1416,
    errCode: 'RPC_STATUS_ORDER_MARKET_TRADE_UNSUITABLE'
  },
  1417: {
    // 没有最新成交价或成交价为0 没有成交的订单
    get msg() {
      return intl.get(1417)
    },
    errCode: 'RPC_STATUS_ORDER_MARKET_LAST_PRICE_NOT_EXISTS',
    ret: 1417
  },
  1418: {
    // 挂单量小于最小交易量
    get msg() {
      return intl.get(1418)
    },
    errCode: 'RPC_STATUS_ORDER_VOLUME_LESS_MINER_FEE',
    ret: 1418
  },
  1420: {
    // 当前交易对不支持交易
    get msg() {
      return intl.get(1420)
    },
    ret: 1420,
    errCode: 'RPC_STATUS_ORDER_DEAL_FORBIDDEN'
  },
  1421: {
    // 价格精度超出限制
    get msg() {
      return intl.get(1421)
    },
    ret: 1421,
    errCode: 'RPC_STATUS_ORDER_PRICE_LIMIT_OVERFLOW'
  },
  1422: {
    // 数量精度超出限制
    get msg() {
      return intl.get(1422)
    },
    ret: 1422,
    errCode: 'RPC_STATUS_ORDER_DEAL_FORBIDDEN'
  },
  1423: {
    // 禁止用户交易
    get msg() {
      return intl.get(1423)
    },
    errCode: 'RPC_STATUS_ORDER_USER_DEAL_FORBIDDEN',
    ret: 1423
  },
  1425: {
    get msg() {
      return intl.get(1425)
    },
    ret: 1425
  },
  1426: {
    get msg() {
      return intl.get(1426)
    },
    ret: 1426
  },
  1430: {
    get msg() {
      return intl.get(1430)
    },
    errCode: 'FUND',
    ret: 1430
  },
  1431: {
    get msg() {
      return intl.get(1431)
    },
    errCode: 'FUND',
    ret: 1431
  },
  1434: {
    get msg() {
      return intl.get(1434)
    },
    errCode: 'FUND',
    ret: 1434
  },
  1435: {
    get msg() {
      return intl.get(1435)
    },
    errCode: 'FUND',
    ret: 1435
  },
  1440: {
    get msg() {
      return intl.get(1440)
    },
    errCode: 'FUND',
    ret: 1440
  },
  1441: {
    get msg() {
      return intl.get(1441)
    },
    errCode: 'FUND',
    ret: 1441
  },
  1442: {
    get msg() {
      return intl.get(1442)
    },
    errCode: 'FUND',
    ret: 1442
  },
  1443: {
    get msg() {
      return intl.get(1443)
    },
    errCode: 'FUND',
    ret: 1443
  },
  1444: {
    get msg() {
      return intl.get(1444)
    },
    errCode: 'FUND',
    ret: 1444
  },
  1445: {
    get msg() {
      return intl.get(1445)
    },
    errCode: 'FUND',
    ret: 1445
  },
  1500: {
    // 服务器内部错误
    get msg() {
      return intl.get(1500)
    },
    errCode: 'RPC_STATUS_INTERNAL_SERVER_ERROR',
    ret: 1500
  },
  1501: {
    // 订单服务暂不可用
    get msg() {
      return intl.get(1501)
    },
    errCode: 'RPC_STATUS_ORDER_SERVICE_NOT_AVAILABLE',
    ret: 1501
  },
  2001: {
    // msg: "谷歌验证失败",
    get msg() {
      return intl.get(2001);
    },
    errCode: "RPC_STATUS_ORDER_VOLUME_LIMIT_OVERFLOW",
    ret: 2001
  },
  // ErrVerifyCanNotBeNull    = 2011 //验证方式不能为空
  // ErrEmailNotBind          = 2012 //邮箱未绑定
  // ErrPhoneNotBind          = 2013 //手机未绑定
  // ErrGoogleNotBind         = 2014 //Google验证未绑定
  2002: {
    // msg: "谷歌验证未开启",
    get msg() {
      return intl.get(2002);
    },
    errCode: "CODE_NOT_EXPIRE",
    ret: 2002
  },
  2008: {
    // msg: "需要谷歌验证码",
    get msg() {
      return intl.get(2008);
    },
    errCode: "CODE_NOT_EXPIRE",
    ret: 2008
  },
  2009: {
    // msg: "需要手机验证码",
    get msg() {
      return intl.get(2009);
    },
    errCode: "CODE_NOT_EXPIRE",
    ret: 2009
  },
  2010: {
    // msg: "谷歌验证未开启",
    get msg() {
      return intl.get(2010);
    },
    errCode: "CODE_NOT_EXPIRE",
    ret: 2010
  },
  2011: {
    // msg: "//验证方式不能为空",
    get msg() {
      return intl.get(2011);
    },
    errCode: "ErrVerifyCanNotBeNull",
    ret: 2011
  },
  2012: {
    // msg: "邮箱未绑定",
    get msg() {
      return intl.get(2012);
    },
    errCode: "ErrEmailNotBind",
    ret: 2012
  },
  2013: {
    // msg: "手机未绑定",
    get msg() {
      return intl.get(2013);
    },
    errCode: "ErrPhoneNotBind",
    ret: 2013
  },
  2014: {
    // msg: "Google验证未绑定",
    get msg() {
      return intl.get(2014);
    },
    errCode: "ErrGoogleNotBind",
    ret: 2014
  },
  2200: {
    // msg: "找不到活动",
    get msg() {
      return intl.get(2200);
    },
    errCode: "CODE_NOT_ACTIVE",
    ret: 2200
  },
  2201: {
    // msg: "您已经被邀请过",
    get msg() {
      return intl.get(2201);
    },
    errCode: "AWARD_DRAWED",
    ret: 2201
  },
  2400: {
    get msg() {
      return intl.get(2400);
    },
    errCode: "AWARD_DRAWED",
    ret: 2400
  },
  2401: {
    get msg() {
      return intl.get(2401);
    },
    errCode: "AWARD_DRAWED",
    ret: 2401
  },
  2402: {
    get msg() {
      return intl.get(2402);
    },
    errCode: "AWARD_DRAWED",
    ret: 2402
  },
  2600: {
    // msg: "奖励已经领取完毕，敬请期待下次活动",
    get msg() {
      return intl.get(2600);
    },
    errCode: "ERROR_ACTIVIY_OVER",
    ret: 2600
  },
  2601: {
    // msg: "奖励已经领取完毕，敬请期待下次活动",
    get msg() {
      return intl.get(2601);
    },
    errCode: "ERROR_ACTIVIY_OVER",
    ret: 2601
  },
  2602: {
    get msg() {
      return intl.get(2602);
    },
    errCode: "ERROR_ACTIVIY_OVER",
    ret: 2602
  },
  40001: {
    get msg() {
      return intl.get(40001);
    },
    errCode: "ERROR_NO_STORE",
    ret: 40001
  }
};

// PWD_ERROR = 601 //密码错误
// DB_ERROR = 602 // 数据库错误
// PARAM_ERROR = 603 // 请求参数错误
// USER_NO_EXIST = 604 // 无此用户
// USER_SYS_ERROR = 605 // 用户服务系统访问失败
// JSON_ERROR = 606 // json转化错误
// CODE_NOT_EXPIRE = 606 // 已发送，未超时3分钟
// CODE_EXPIRE = 607 // 验证码已过期
// CODE_WRONG = 608 // 验证码错误
// OP_TYPE_ERROR = 609 // 操作类型错误
// PWD_SAME = 610 // 与原密码相同
//
// // 公共错误
// ErrCodeNone = 0    // 正确
// ErrCodeUnknown = 1    // 未知错误
// ErrCodeConnectForbidden = 1001 // 连接被禁止
// ErrCodeConnectTokenInvalid = 1002 // 连接时传入的Token不合法
//
// // 业务逻辑错误
// ErrCodeGoogleAuthFailed = 2001 // 谷歌验证失败
// ErrCodeGoogleAuthDisable = 2002 // 谷歌验证未开启

/**
 * 数据显示问题
 * 主要是跟排序有关
 * 如果前端不负责显示，则排序出问题
 *
 * 所以，
 * 前后端同时处理精度问题
 *
 * 此处，也可能会使显示与实际不同
 */
