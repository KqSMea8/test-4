import ExchangeStoreBase from '../ExchangeStoreBase'

export default class OrderListStore extends ExchangeStoreBase {
  constructor(modelName, connectName) {
    super(modelName, connectName)
    this.state = {
      recentTradeListArr: [],//近期交易市场显示数组
      recentTradeListArrS: [],//近期交易市场存储数组
      unitsType: '',//计价方式类型
      market:'',
      coin:'',
      room:'',//房间
      tradePairId: 3,//交易对id
      lastDealArr:0,//websocket判断数组
      lastDealArrS:[],//websocket存储数组
      valueAft:{},//最近成交数据
      accuracyList: {},
    }
    // ws接收市场成交记录,对数据进行处理
    this.WebSocket.general.on('orderUpdate', data => {
      let dataAf = {
        orders: data.ors.map(v => ({
            "dealTime": v.t,
            "priceR": v.p,
            "price": v.p,
            "priceCN": v.pc,
            "priceEN": v.pe,
            "volume": v.vol,
            "orderType": v.ty //0买1卖
          })),
        seq: data.seq
      }
      this.state.lastDealArrS.push(dataAf);
      this.state.lastDealArr = 1;
    })
  }

  setController(ctl) {
    this.controller = ctl
  }

  //获取房间
  get room() {
    return this.state.room
  }

  // 设置房间
  setRoom(room) {
    this.state.room = room
  }

  // 进入近期交易房间
  emitRecentOrderWs(f, t){
    this.WebSocket.general.emit('joinRoom', {f, t});
    this.setRoom(t);
  }

  // 请求近期交易数据
  async getRecentOrder(id){
    this.state.recentTradeListArr = [];
    this.state.recentTradeListArrS = [];
    let recentTradeListArr =  await this.Proxy.recentOrderMarket({id, a: 50});
    let recentTradeListArrAf = {
      orders: recentTradeListArr.ors && recentTradeListArr.ors.length && recentTradeListArr.ors.map(v => ({
          "dealTime": v.t,
          "priceR": v.p,
          "price": v.p,
          "priceCN": v.pc,
          "priceEN": v.pe,
          "volume": v.vol,
          "orderType": v.ot
        })) || []
    };
    this.state.recentTradeListArr = recentTradeListArr && recentTradeListArrAf.orders || [];
    this.state.recentTradeListArrS = recentTradeListArr && recentTradeListArrAf.orders || [];
    this.state.lastDealArr = 0;
    this.state.lastDealArrS = [];
    return this.state.recentTradeListArr
  }
}