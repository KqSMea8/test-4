import ExchangeStoreBase from "../ExchangeStoreBase";

export default class OtcStore extends ExchangeStoreBase {
  constructor() {
    super("otc", "general");
    this.state = {
      currencyArr: [],
      currency: '',
      "sale_id": 0, //若传入只返回此广告id 的广告信息
      "uid": 0,    // 不传入是所有广告 传入是某个用户的所有广告
      "type": 0,  //1出售2购买
      "price": 2,    //价格: 1降序 2升序
      "payment": 7,    // 1支付宝 2微信 4银行卡 可相加共6种组合
      "page_no": 1,  // 当前页面
      "count": 10, //每页个数
      "min": 0,   //价格区间: 最小值
      'trader': 1,
      state: 1,
      priceList: {
        BTC: {cny: 0, usd: 0}
      },//获取币种价格列表
      minPriceMap: {
        BTC: {cny: 0, usd: 0}
      },
      maxPriceMap: {
        BTC: {cny: 0, usd: 0}
      },
    };

  }

  setController(ctl) {
    this.controller = ctl
  }

// 请求广告列表
  async otcSales(currency, sale_id, uid, type, price, payment, page_no, count, min, state = 1) {
    this.state.min = min;
    this.state.payment = payment;
    this.state.sale_id = sale_id;
    this.state.type = type;
    this.state.currency = currency;
    // const {
    //   currency,
    //   sale_id,
    //   uid,
    //   type,
    //   price,
    //   payment,
    //   page_no,
    //   count,
    //   min,
    //   state
    // } = this.state;
    //
    let result = await this.Proxy.otcSales({
      currency,
      sale_id,
      uid,
      type,
      price,
      payment,
      page_no,
      count,
      min,
      state
    });
    return result
  }

// 获取交易支持币种
  async canDealCoins() {
    let result = await this.Proxy.canDealCoins({});
    return result
  }

//获取商户信息
  async traderInfo() {
    let result = await this.Proxy.traderInfo(
        {trader: this.state.trader}
    );
    let status = [];
    result.verify && status.push(0);
    result.email && status.push(1);
    result.phone && status.push(2);
    result.btverify && status.push(3);
    result.authenStatus = status;
    return result
  }

  async otcNewSale(obj) {
    obj.token = this.controller.token;
    let result = await this.Proxy.otcNewSale(obj);
    return result;
  }

  //获取币种市场价列表
  async getPriceList() {
    let result = await this.Proxy.priceList();
    if (result && result.prices) {
      this.state.priceList = result.prices;
    }
  }

  async otcApplyStore(name) {
    let result = await this.Proxy.otcApplyStore({
      "token": this.controller.token,
      "uid": this.controller.userId,
      "store_name": name
    });
    return result
  }

  //广告上下架操作
  async otcHandleSale(ids, online) {
    let result = await this.Proxy.otcHandleSale({
      token: this.controller.token,
      ids,
      online
    })
    return result
  }

  //删除广告
  async otcDelSale(id) {
    let result = await this.Proxy.otcDelSale({
      token: this.controller.token,
      id
    })
    return result
  }

  //获取所有广告最低出售价或最高收购价
  async getBoundaryPrice(type) {
    let result = await this.Proxy.boundaryPrice({type});
    if (!result || !result.length) return;
    let obj = {};
    result.forEach(v => {
      v.currency && (obj[v.currency.toUpperCase()] = {cny: v.price, usd: v.price})
    });
    this.state[`${type}PriceMap`] = obj;
  }

  // 快速购买
  async quickBuy(currency, payment, amountm) {
    let result = await this.Proxy.otcQuickBuy({
      token: this.controller.token,
      currency, payment, amountm
    })
    return result
  }

}