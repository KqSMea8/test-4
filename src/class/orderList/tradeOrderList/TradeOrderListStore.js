import OrderListStore from '../OrderListStore'

export default class TradeOrderListStore extends OrderListStore {
  constructor() {
    super('userOrder', 'general');
    this.state = {
      depthType: 0,
      tradePair: '',
      userPriceList: [],
      changeFlag: true,
      room: '',
      titleSelect: 'all',
      liveTradeList: {
        buy: [
          {
            id: 0,
            "price": 1025.22,
            "priceCN": 1111.22,
            "priceEN": 1222.22,
            "currDepth": 123444.34,
            "turnover": 1111
          }, {
            id: 1,
            "price": 1024.22,
            "priceCN": 1023.22,
            "priceEN": 1023.22,
            "currDepth": 123444.34,
            "turnover": 1111
          }, {
            id: 2,
            "price": 1023.22,
            "priceCN": 1023.22,
            "priceEN": 1023.22,
            "currDepth": 123444.34,
            "turnover": 1111
          }
        ],
        sell: [
          {
            id: 3,
            "price": 4,
            "priceCN": 2,
            "priceEN": 1,
            "currDepth": 123444.34,
            "turnover": 1111
          }, {
            id: 4,
            "price": 1024.22,
            "priceCN": 1023.22,
            "priceEN": 1023.22,
            "currDepth": 123444.34,
            "turnover": 1111
          }, {
            id: 5,
            "price": 1023.22,
            "priceCN": 1023.22,
            "priceEN": 1023.22,
            "currDepth": 123444.34,
            "turnover": 1111
          }
        ],
      },
      liveBuyArray: [],
      liveSellArray: [],
      recentTradeList: [
        {
          "tradePairId": 1,
          "tradePairName": "ETH/BTC",
          "dealTime": 947586000,
          "price": 0.122789,
          "volume": 3.178,
          "orderType": 0 //订单类型0买 1卖
        },
        {
          "tradePairId": 1,
          "tradePairName": "ETH/BTC",
          "dealTime": 947586000,
          "price": 0.132789,
          "volume": 23.178,
          "orderType": 0
        },
        {
          "tradePairId": 1,
          "tradePairName": "ETH/BTC",
          "dealTime": 947586000,
          "price": 0.142789,
          "volume": 13.178,
          "orderType": 0
        }
      ]
    }
    this.WebSocket.general.on('joinRoom', data => {
    });
    this.WebSocket.general.on('tradeDepth', data => {
      let dataAf = {
        "tradePairName": data.n,
        "time": data.t,
        "levle": data.lv,
        "buy": data.b && data.b.map(v => {
          return {
            "price": v.p,
            "amount": v.a
          }
        }) || [],
        "sell": data.s && data.s.map(v => {
          return {
            "price": v.p,
            "amount": v.a
          }
        }) || [],
      };
      this.controller.liveTradeListHandle(dataAf)
      this.controller.kdepthController && this.controller.kdepthController.setData(dataAf);
    })
  }
  
  emitTradeOrderWs(f, t) {
    this.WebSocket.general.emit('joinRoom', {f, t});
  }
  
  //深度数据的请求
  async getDepth() {
    let orderListArray = await this.Proxy.getDepth(
        {
          n: this.state.tradePairName,
          lv: this.state.depthType //深度 可传6,5,4,3
        }
    );
    let orderListArrayAf = orderListArray && {
      "tradePairName": orderListArray.n,
      "time": orderListArray.t,
      "levle": orderListArray.lv,
      "buy": orderListArray.b && orderListArray.b.map(v => {
        return {
          "price": v.p,
          "amount": v.a
        }
      }) || [],
      "sell": orderListArray.s && orderListArray.s.map(v => {
        return {
          "price": v.p,
          "amount": v.a
        }
      }) || [],
    };
    this.state.liveTrade = orderListArrayAf;
    this.controller.kdepthController && this.controller.kdepthController.setData(orderListArrayAf);
    return orderListArrayAf
  }
  
  getWebSocketData() {
    this.WebSocket.general.on('tradeDepth', data => {
    })
  }
}