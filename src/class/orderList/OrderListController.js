
import Util from "@/core/libs/GlobalUtil";
import Sleep from "@/core/libs/Sleep";
import Loop from "@/core/loop";
import OrderListStore from './OrderListStore'

export default class OrderListController {
  constructor(name) {
    this.store = new OrderListStore('userOrder', 'general');
    this.store.setController(this);
    this.Loop = Loop;
    this.Sleep = Sleep;
    if (name !== 'recentOrder')
      return
    this.Loop.dealMarket.clear();
    this.Loop.dealMarket.set(async () => {
      await this.Sleep(500);
      if (!this.store.state.lastDealArr)
        return
      this.lastDealUpdate();
      this.TradePairDealController && this.TradePairDealController.updateLastDeal(this.store.state.valueAft);
      this.changeRenderRecent(this.store.state.recentTradeListArr)
    });
    this.Loop.dealMarket.start()
  };

  setView(view) {
    this.view = view;
  }
  get initState() {
    return (this.store && Util.deepCopy(this.store.state)) || {};
  }


  /*
  * 更改计价单位, 触发数据处理渲染方法
  * */
  setUnitsType(v) {
    this.view.setState({
      unitsType: v
    });
    this.store.state.unitsType = v;
    // let recentTradeListArr = this.view.state.recentTradeListArr;
    let recentTradeListArr = this.store.state.recentTradeListArr;
    this.view.name === 'recentTrade' && this.changeRenderRecent(recentTradeListArr)
  }

// 设置初始状态的计价单位
  setInitUnit(market, coin) {
    this.view.setState({
      market,
      coin
    })
  }

  /*
  http请求近期交易市场数据,对最新数据同成交进行比对处理,消除10S内成交价不一致误差
  * */
  async getRecentOrder(id) {
    this.changeRenderRecent([])
    let recentTradeListArr = await this.store.getRecentOrder(id);
    let data = {
      turnover: 0,
      lower: recentTradeListArr.length && recentTradeListArr[0].price || 0,
      high: recentTradeListArr.length && recentTradeListArr[0].price || 0,
      orders: [{price: recentTradeListArr.length && recentTradeListArr[0].price || 0}]
    };
    let flag = recentTradeListArr.length ? true : false;
    this.TradePairDealController && (id === this.store.state.tradePairId) &&this.TradePairDealController.updateLastDeal(data, false, flag);
    (id === this.store.state.tradePairId) && this.changeRenderRecent(recentTradeListArr)
  }

  /*
  初始化选中交易对id, 进行http请求以及进入交易对103房间
  */
  setTradePairId(id, tradePairName) {
    this.store.state.tradePairId = id;
    this.getRecentOrder(id)
    this.emitRecentOrderWs(this.store.room, tradePairName)
  }

  //清除房间
  clearRoom() {
    this.emitRecentOrderWs(this.store.room, '')
  }

  //进入房间
  emitRecentOrderWs(from, to) {
    this.store.emitRecentOrderWs(from, to);
  }

  /*
    ws数据定时排序拼接处理
    */
  lastDealUpdate() {
    let recentTradeListArrS = this.store.state.recentTradeListArrS,//近期交易储存数组
        valueArr = this.store.state.lastDealArrS,//ws返回数据存储数组
        turnover = 0,
        higher = 0,
        lower = 0,
        tempArr = [];// 临时储存数组
    valueArr = valueArr.sort((a, b) => (b.seq > a.seq || Math.abs(b.seq - a.seq) > Math.pow(2, 30)) && 1 || -1);
    // 成交额进行累加,判断最大值最小值
    tempArr = valueArr.map((v) => {
      turnover += Number(Number(v.orders[0].volume).multi(v.orders[0].price));
      higher = Math.max(higher, v.orders[0].price);
      lower = lower ? Math.min(lower, v.orders[0].price) : v.orders[0].price;
      return v.orders[0]
    });
    recentTradeListArrS = tempArr.length <= 50 ? recentTradeListArrS.slice(0, 50 - tempArr.length) : [];
    this.store.state.valueAft = Object.assign(valueArr[0], {turnover, higher, lower});
    this.store.state.recentTradeListArr = tempArr.concat(recentTradeListArrS);
    this.store.state.lastDealArr = 0

  }

  // 设置交易对名称
  setPairName(value) {
    this.store.state.tradePairName = value;
  }

  // 设置价格及数量精度(共用)
  setAccuracy(priceAccuracy, volumeAccuracy) {
    this.view && this.view.setState(
        {
          priceAccuracy,
          volumeAccuracy
        },
    );
    this.store.state.volumeAccuracy = volumeAccuracy;
    this.store.state.priceAccuracy = priceAccuracy;
  }

  get accuracy() {
    return {
      volumeAccuracy: this.store.state.volumeAccuracy,
      priceAccuracy: this.store.state.priceAccuracy,
    }
  }

  // 存储设置汇率
  setBank(value) {
    this.store.state.bank = {
      cny: value.priceCN,
      usd: value.priceEN
    }
    this.view && this.view.setState(
        {
          recentBank: {
            cny: value.priceCN,
            usd: value.priceEN
          }
        }
    );
  }

  //改变数据渲染的数组(计价方式切换,数据来源切换)
  changeRenderRecent(initData) {
    let unitsType = this.store.state.unitsType,
        recentBank = this.store.state.bank,
        rate = 1,
        formatType = {number: 'digital', style: {decimalLength: this.accuracy.priceAccuracy}};
    if (unitsType === 'CNY' || unitsType === 'USD') {
      rate = recentBank[unitsType.toLowerCase()];
      formatType = {number: 'legal', style: {name: unitsType.toLowerCase()}};
    }
    this.store.state.recentTradeListArr = initData && initData.map(v => {
      v.priceR = Number(v.price * rate).format(formatType);
      v.volumeR = Number(v.volume).formatFixNumberForAmount(this.accuracy.volumeAccuracy, false);
      return v
    });
    this.view && this.view.setState({recentTradeListArr: this.store.state.recentTradeListArr})
  }
}