import ExchangeStoreBase from '../ExchangeStoreBase'

export default class DealStore extends ExchangeStoreBase {
  constructor() {
    super('deal');
    this.state = {
      PriceUnit: '',
      NumUnit: '',
      UnitControl: '',
      prices: {},
      priceBank: {
        CNY: 0,
        USD: 0
      },
      priceInit: 0,
      coinMinTrade: [],
      coinMin: 0,
      priceBuyValueCN: 0,
      priceBuyValueEN: 0,
      priceSellValueEN: 0,
      priceSellValueCN: 0,
      setPairMsg: {},
      priceDeal: 0,
      priceHigh: 0,
      priceLow: 0,
      priceYest: 0,
      priceTurn: 0,
      inputBuyFlag: false,
      interval: 0,
      changeMaxFlag: true, //改变最大数量开关
      dbPreOrder: false, //下单连点保护开关
      dbPreOrderF: false, //间隔连点保护开关
      dbPreOrderD: false, //法币连点保护开关
      buyMax: 0,
      sellMax: 0,
      marketBuyMax: 0,
      marketSellMax: 0,
      marketChangePrice: 0
    }
  }

  setController(ctl) {
    this.controller = ctl
  }

  async dealTrade(params) {
    this.state.changeMaxFlag = false;// 下单关闭改变最大数量开关
    let result = await this.Proxy.dealExchange(
        {
          token: params.token,
          ot: params.orderType,
          pt: params.priceType,//0限价  1市价
          p: params.price,//价格
          c: params.count,//数量
          id: params.tradePairId,//交易对id
          na: params.tradePairName,//交易对name
          fp: params.funpass,//资金密码
          in: params.interval,// 0:每次都需要密码 1:2小时内不需要 2:每次都不需要
          put: params.priceUnit//计价单位  0数字币  1人民币 2美元
        }
    );
    return result
  }

  //设置可用额度
  setWallet(buyWallet, sellWallet) {
    this.state.buyWallet = buyWallet
    this.state.sellWallet = sellWallet
  }

  async getCoinMinTrade() {
    let result = await this.Proxy.getCoinMinTrade();
    let resultAf = result.map(v => {
      return {
        "coinId": v.id,
        "coinName": v.n,
        "minTrade": v.mt
      }
    })
    this.state.coinMinTrade = resultAf;
    return resultAf
  }

  // 是否可充币
  async getCharge() {
    let result = await this.Proxy.getCharge();
    this.state.getCharge = result;
    return result
  }
}