export default {
  /**
   * 使用方法
   *  1.在ProxyConfig配置好相关参数
   *  2.直接this.WebSocket.XXX生成链接，返回promise 为true
   *      注：若需要参数，this.WebSocket.XXX（params）
   *  3.调用this.WebSocket.XXX.get方法获得连接或连接组
   *  4.调用this.WebSocket.getAll返回所有连接
   *  this.emit
   */
  useWebSocket: true,  // 是否开启websocket
  /**
   * name:连接标识，名称
   * url:连接路径
   * size:连接数量，可选，默认为1
   */
  webSocketList: [
    {
      name: 'general', url: '/sub', optionList: {
        global: {
          connect: {v: 1, o: 0, s: 0, resOp: 1, loggerInfo: '握手'},//握手
          heartBreak: {v: 1, o: 2, s: 0, resOp: 3, loggerInfo: '心跳',},//心跳
          joinRoom: {v: 1, o: 4, s: 0, resOp: 5, history: true, loggerInfo: '加入房间',passSort: true,
            historyFunc: (arr, value) => (!arr.length && arr.push({f: "", t: value.t}),
              value.f && arr.map(v=>v.t).includes(value.f) && arr.splice(arr.findIndex(v=>v.t === value.f), 1),
              value.t && !arr.map(v=>v.t).includes(value.t) && arr.push({f: "", t: value.t}), arr)
             },//加入房间
        },
        market: {
          recommendCurrency: {v: 1, o: 108, s: 0, resOp: 108, loggerInfo: '推荐币种'},//推荐币种
          marketPair: {v: 1, o: 107, s: 0, resOp: 107, loggerInfo: '涨跌幅'},//涨跌幅数据更新
          collectArr: {v: 1, o: 109, s: 0, resOp: 109, loggerInfo: '收藏'},//收藏
          bankArr: {v:1, o: 112, s: 0, resOp: 112, loggerInfo: '汇率'}//汇率更新
        },
        userOrder: {
          tradeKline: { v: 1, o: 104, s: 0, resOp: 104, loggerInfo: 'K线'}, //K线更新
          tradeDepth: {v: 1, o: 105, s: 0, resOp: 105, loggerInfo: '深度数据'},//深度更新
          orderUpdate: {v: 1, o: 103, s: 0, resOp: 103, loggerInfo: '订单数据', needSeq:true, passSort: true},//订单跟新
          userOrderUpdate: {v: 1, o: 102, s: 0, resOp: 102, loggerInfo: '个人订单数据',needSeq:true ,passSort: true},//个人订单跟新
          otcChatSend: {v: 1, o: 150, s: 0, resOp: 150, loggerInfo: '发送聊天消息'},
        },
        login: {
          login: {v: 1, o: 10, s: 0, resOp: 11, loggerInfo: '登录'},//登录
          loginOut: {v: 1, o: 12, s: 0, resOp: 13, loggerInfo: '退出登录'},//退出登录
          loginOther: {v: 1, o: 120, s: 0, resOp: 120, loggerInfo: '别处登录'},//退出登录
          loginSeverErr: {v: 1, o: 121, s: 0, resOp: 121, loggerInfo: '服务器维护'}//服务器维护
        },
        asset: {
          userAssetUpdate: { v: 1, o: 110, s: 0, resOp: 110, loggerInfo: '用户资产'}//用户资产更新
        },
        notice: {
          userNoticeUpdata: {v: 1, o: 111, s: 0, resOp: 111, loggerInfo: '用户通知消息'}, // 用户通知消息更新
          otcChatReply: {v: 1, o: 151, s: 0, resOp: 151, loggerInfo: '接收聊天消息',needSeq:true ,passSort: true},
        }
      }
    },

  ],
}



