import OrderListStore from '../OrderListStore'

export default class UserOrderListStore extends OrderListStore {
  constructor() {
    super('userOrder', 'general');
    this.state = {
      otcOrderContent: [],
      currentOrder: [],
      historyOrder: [],
      orderListArray: [],
      currentArray: [],
      historyArray: [],
      dealArray: [],
      orderDetail: {},
      tradePairId: 0,
      hideOther: false,
      orderItemsType: 0,
      proOrderData:[],
      otcOrderId: '',
      chatItems:[],//聊天内容
      chatPage: 0,
      oid: 0
    };
    this.WebSocket.general.on('otcChatSend', data => {
      this.controller.updateChatItems(data)
    });
    this.WebSocket.general.on('userOrderUpdate', data => {
      let dataAf = {
        "tradePairId": data.id,
        "orderType": data.ot,//订单类型 0买单 1卖单
        "priceType": data.pt,//市价限价 0限价 1市价
        "orderId": data.oi,
        "orderTime": data.t,
        "tradePairName": data.na,
        "orderStatus": data.ost,
        "price": data.p,//数字币价格
        "count": data.c,//交易量
        "dealDoneCount": data.ddc,//已成交量
        "priceCN": data.pc,//人民币价格
        "priceEN": data.pe,//美元价格
        "avgPrice": data.ap,//成交均价
        "avgPriceCN": data.apc,
        "avgPriceEN": data.ape,
        "undealCount": Number(Number(data.c).minus(data.ddc)) ,//未成交量
        "turnover": data.to,//成交额
        "turnoverCN": data.toc,
        "turnoverEN": data.toe,
        "fee": data.fee,//手续费,
        "seq": data.seq
      }
      window.location.href.includes('/trade') && this.controller.updateUserOrderPro(dataAf)
    })
  }

  wsOrderList() {
    this.WebSocket.general.on('userOrderUpdate', data => {
    })
  }
  
  //套利宝订单
  async getFundOrder(params) {
    return await this.Proxy.fundOrderList({...params, token: this.controller.userController.userToken})
  }
  
  //套利宝标记订单
  async markFundOrder(params) {
    return await this.Proxy.fundOrderMark({...params, token: this.controller.userController.userToken})
  }

  async getCurrentOrder(params) {
    let currentList = await this.Proxy.currentOrder(
        {
          token: this.controller.userController.userToken,
          tpd: params.idArray,
          tpn: 'xxx',
          ot: params.orderType,
        }
    );
    let currentListAf = currentList && currentList.ol && currentList.ol.map(v => {
      return {
        "tradePairId": v.id,
        "tradePairName": v.na,
        "orderType": v.ot, //0买 1卖
        "priceType": v.pt, //0限价 1市价
        "orderId": v.oi,
        "undealCount": v.uc || Number(Number(v.c).minus(v.ddc)),
        "orderTime": v.t,
        "orderStatus": v.ost,//订单状态 0未成交 1部分成交 2全部成交 3已撤单 4撤单中 5已结束(市价单独有的。市价买单没买到任何东西时) 6部分成交(市价单没买够) 7部分成交(限价单部分成交后撤单)
        "price": v.p,
        "count": v.c,//总的量
        "dealDoneCount": v.ddc,//已完成的量
        "priceCN": v.pc,
        "priceEN": v.pe,
        "avgPrice": v.ap,//平均价格
        "avgPriceCN": v.apc,
        "avgPriceEN": v.ape,
        "fee": v.fee//手续费
      }
    });
    this.state.currentOrder = currentList && currentListAf || [];
    return currentList && currentListAf || []
  };

  async getHistoryOrder(params) {
    let historyList = await this.Proxy.historyOrder(
        {
          token: this.controller.userController.userToken,
          tpd: params.idArray,
          ot: params.orderType,
          ost: params.orderStatus,
          st: params.startTime,
          et: params.endTime,
          p: params.page,
          s: params.pageSize
        }
    );
    let historyListAf = {
      orderList: historyList && historyList.ol && historyList.ol.map(v => {
        return {
          "tradePairId": v.id,
          "tradePairName": v.na,
          "orderType": v.ot,//订单类型 0买  1卖
          "priceType": v.pt,//价格类型 0限价  1市价
          "orderId": v.oi,
          "orderTime": v.t,
          "orderStatus": v.ost,//订单状态 0未成交 1部分成交 2全部成交 3已撤单 4撤单中 5已结束(市价单独有的。市价买单没买到任何东西时) 6部分成交(市价单没买够) 7部分成交(限价单部分成交后撤单)
          "price": v.p,
          "count": v.c,//总量
          "dealDoneCount": v.ddc,//已成交的量
          "priceCN": v.pc,
          "priceEN": v.pe,
          "avgPrice": v.ap,//均价
          "avgPriceCN": v.apc,
          "avgPriceEN": v.ape,
          "undealCount": v.uc,//未成交的量
          "turnover": v.to,//成交额
          "turnoverCN": v.toc,
          "turnoverEN": v.toe,
          "fee": v.fee//手续费
        }
      }),
      "page":historyList && Object.keys(historyList).indexOf('p') !== -1 && historyList.p || 0,
      "totalCount":historyList && Object.keys(historyList).indexOf('c') !== -1 && historyList.c || 0
    };
    this.state.historyOrder = historyListAf;
    return historyListAf
  }

  //订单明细
  async getOrderDetail(id) {
    let orderDetail = await this.Proxy.orderDetail(
        {
          token: this.controller.userController.userToken,
          oi: id
        }
    );
    let orderDetailAf = {
      "orderId": orderDetail.oi,
      "orderType": orderDetail.ot,//订单类型0 买 1卖
      "tradePairId": orderDetail.id,
      "tradePairName": orderDetail.na,
      "orderStatus": orderDetail.ost,//订单状态 0未成交 1部分成交 2全部成交 3已撤单 4撤单中 5已结束(市价单独有的。市价买单没买到任何东西时) 6部分成交(市价单没买够) 7部分成交(限价单部分成交后撤单)
      "price": orderDetail.p,//价格
      "priceAvg": orderDetail.ap,// 平均成交价
      "count": orderDetail.c,//数量
      // "priceAvg": orderDetail.ap, //平均成交价
      "dealedMoney": orderDetail.dm,//已成交金额
      "doneCount": orderDetail.dc,//已成交的量
      "undoneCount": orderDetail.udc,//未成交的量
      "priceCN": orderDetail.pc,
      "priceEN": orderDetail.pe,
      "dealedMoneyCN": orderDetail.dmc,
      "dealedMoneyEN": orderDetail.dme,
      "fee": orderDetail.fee,
      "orderList": orderDetail && orderDetail.ol.length && orderDetail.ol.map(v => {
        return {
          "orderTime": v.t,
          "price": v.p,
          "priceCN": v.pc,
          "priceEN": v.pe,
          "buyer": v.br,
          "seller": v.sr,
          "volume": v.vol,
          "turnover": v.to,
          "turnoverCN": v.toc,
          "turnoverEN": v.toe
        }
      })
    }
    this.state.orderDetail = orderDetailAf;
    return orderDetailAf
  }

  //撤单操作
  async cancelOrder(orderId, opType, dealType, tradePairId) {
    let msg = await this.Proxy.cancelOrder(
        {
          token: this.controller.userController.userToken,
          id: tradePairId,
          oi: orderId,
          ot: opType, //0默认 1买单全部  2卖单全部  3所有
          d: dealType
        }
    )
    // console.log('receiveMSG', msg)
  }
  async otcSaleDetail(id){
    let result = await this.Proxy.otcSaleDetail({
      token: this.controller.userController.userToken,
      id
    })
    return result
  }
  
  async getPrice(currency){
    let result = await this.Proxy.getPrice({
      currency
    })
    return result
  }
  // 获取otc订单列表
  async otcOrderStore(obj){
    obj.token = this.controller.userController.userToken;
    let result = await this.Proxy.otcOrderStore(obj);
    this.state.otcOrderContent = result.list;
    return result
  }
  
  async otcNewOrder(obj){
    obj.token = this.controller.userController.userToken;
    let result = await this.Proxy.otcNewOrder(obj);
    return result
  }
  //获取单个订单详情
  async otcGetOrders(id){
    let result = await this.Proxy.otcGetOrders({
      token : this.controller.userController.userToken,
      id
    });
    return result
  }
  // 获取聊天列表
  async otcChat(oid){
    let result = await this.Proxy.otcChat({
      token : this.controller.userController.userToken,
      oid,
      p: this.state.chatPage,
      s: 10
    })
    return result
  }
  // 获取未读信息
  async otcUnread(){
    let result = await this.Proxy.otcUnread({
      token : this.controller.userController.userToken,
    })
    return result
  }
  // 订单标记状态
  async otcUpdateOrder(id, state, info = ''){
    let result = await this.Proxy.otcUpdateOrder({
      token : this.controller.userController.userToken,
      id,
      state,
      info
    })
    return result
  }
  // 取消订单
  async otcCancelOrder(id){
    let result = await this.Proxy.otcCancelOrder({
      token : this.controller.userController.userToken,
      id
    })
    return result
  }
  sendChatMsg(msg, mt = 0){
    this.WebSocket.general.emit('otcChatSend',{
      tk: this.controller.userController.userToken,
      a: 'chat',
      d: {
        ooi: this.state.otcOrderId,
        data: {
          m: msg
        },
        mt,
        tk: this.controller.userController.userToken,
      }
    })
  }
  //salesPaymentAccounts
  async salesPaymentAccounts(id){
    let result = await this.Proxy.salesPaymentAccounts(
        {
          token: this.controller.userController.userToken,
          id
        }
    )
    return result
  }
  // 申诉订单接口
  async otcNewAppealAdd(type, contact, info){
    let result = await this.Proxy.otcNewAppealAdd({
      token: this.controller.userController.userToken,
      id: this.state.otcOrderId,
      type,
      contact,
      info
    })
    return result
  }
  //评价
  async otcNewRate(credit){
    let result = await this.Proxy.otcNewRate({
      token: this.controller.userController.userToken,
      id: this.state.otcOrderId,
      credit
    });
    // console.log('resultttttttt')
    return result
  }
  // 设置订单消息已读
  async otcReadOderMessages(){
    let result = await this.Proxy.otcReadOderMessages({
      token: this.controller.userController.userToken,
      oid: this.state.oid
    })
    return result
  }
  async fundGatheringCard(cardType){ // 获取收款银行卡信息
    let result = await this.Proxy.fundGatheringCard({
      token: this.controller.userController.userToken,
      cardType //卡类型，1-美元，2-人民币
    });
    return result
  }

  async fundOrderInfo(orderId){ // 查询指定订单详情
    let result = await this.Proxy.fundOrderInfo({
      token: this.controller.userController.userToken,
      orderId //订单id
    });
    return result
  }
}