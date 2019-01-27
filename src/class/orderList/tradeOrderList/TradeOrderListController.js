import OrderListController from '../OrderListController.js'
import Util from "@/core/libs/GlobalUtil";
import TradeOrderListStore from './TradeOrderListStore'

export default class TradeOrderListController extends OrderListController {
  constructor() {
    super()
    this.store = new TradeOrderListStore()
    this.store.setController(this);
  }
  
  setView(view) {
    this.view = view;
  }
  get initState() {
    return (this.store && Util.deepCopy(this.store.state)) || {};
  }
  
  //ws返回数据的处理
  liveTradeListHandle(liveTradeList) {
    let liveTradeData = liveTradeList;
    let liveBuyArray = liveTradeData && liveTradeData.buy || [];
    let liveSellArray = liveTradeData && liveTradeData.sell || [];
    this.store.state.liveSellArray = liveSellArray;
    this.store.state.liveBuyArray = liveBuyArray;
    this.changeRenderLive();
  }
  
  //请求深度挂单列表数据
  async getDepth() {
    this.store.state.liveBuyArray = [];
    this.store.state.liveSellArray = [];
    this.view.setState({
      liveBuyArray: [],
      liveSellArray: [],
      prices: {},
      dealPrice: ''
    })
    let liveTradeData = await this.store.getDepth();
    // todo
    this.view.setState({
      prices: this.store.state.prices
    })
    this.store.state.liveBuyArray = liveTradeData && liveTradeData.buy || [];
    this.store.state.liveSellArray = liveTradeData && liveTradeData.sell || [];
    liveTradeData && (this.store.state.tradePair === liveTradeData.tradePairName) && this.changeRenderLive();
  }
  
  // 挂单点击选择,改变下单处价格输入框价格
  orderListSelect(v) {
    let prices = {
      price: v.price,
      priceCN: this.view.state.prices.priceCN,
      priceEN: this.view.state.prices.priceEN,
    };
    this.TradePlanController && this.TradePlanController.orderHandle(prices);
    this.setChangeFlagClose();
  }
  
  // 获取数据变动开关
  get changeFlag() {
    return this.view.state.changeFlag
  }
  
  // 设置数据变动开
  setChangeFlag() {
    this.view.setState({
      changeFlag: true
    })
  }
  
  // 设置数据变动关
  setChangeFlagClose() {
    this.view.setState({
      changeFlag: false
    })
  }
  
  // 切换交易对时重置深度选择位数,并加入对应房间
  resetDepth(value) {
    this.store.state.depthType = 0;
    let depthArray = value === 6 ? [6, 5, 4, 3] : [2, 1, 0];
    depthArray = depthArray.map(v => {
      v = v + this.view.intl.get('trade-little');
      return v
    })
    this.view.setState({
      depthSelected: depthArray[0],
      depthArray
    })
    this.joinRoom();
  }
  
  // 进入交易对对应ws房间
  joinRoom() {
    let room = `${this.store.state.tradePairName}-${this.store.state.depthType}`;
    this.emitRecentOrderWs(this.store.room, room)
    this.store.setRoom(room)
  }
  
  // 交易盘获取
  getNewPrice(v, flag) {
    this.store.state.prices = v.prices;
    this.store.state.tradePair = v.tradePair
    flag === 3 && this.getDepth()
    this.view.setState(
        {
          updown: v.updown
        }
    );
  }
  
  // 近期交易获取(有成交推送时)
  getDealPrice(v) {
    let initPrices = this.store.state.prices;
    initPrices.price = v.price;
    this.view.setState(
        {
          updown: v.updown
        }
    );
    this.changeRenderLive()
  }
  
  // 设置计价单位
  setUnitsType(v) {
    this.view.setState({
      unitsType: v
    });
    this.store.state.unitsType = v;
    this.changeRenderLive();
  }
  
  // 挂单列表买入,卖出,买卖切换
  changeLiveTitleSelect(v) {
    this.view.setState({
      titleSelect: v.type
    });
    this.store.state.titleSelect = v.type;
    this.changeRenderLive()
  }
  
  // 当前用户挂单标识储存
  setPriceList(value) {
    this.store.state.userPriceList = value;
    this.userPriceListHandle();
  }
  
  //深度合并位数切换
  depthSelect(e) {
    let accuracy = this.accuracy.priceAccuracy;
    let selected = e.charAt(0);
    this.view.setState({
      depthSelected: e
    });
    this.store.state.depthType = accuracy - selected;
    this.userPriceListHandle();
    this.joinRoom();
    this.getDepth();
  }
  
  // 用户挂单数据处理
  userPriceListHandle() {
    let userPriceList = this.store.state.userPriceList;
    let depthType = this.store.state.depthType;
    let accuracy = this.accuracy.priceAccuracy;
    let tradePairName = this.store.state.tradePairName;
    let userTagArr = userPriceList.filter(v => v.tradePairName === tradePairName).map(v => {
      if (v.type) {
        return depthType ? (v.price === v.price.toFixedWithoutUp(accuracy - depthType) ? v.price : Number(v.price.plus(Math.pow(0.1, accuracy - depthType))).toFixedWithoutUp(accuracy - depthType)) : v.price
      }
      return Number(v.price).toFixedWithoutUp(accuracy - depthType);
    });
    this.view.setState(
        {
          userTagArr
        }
    )
  }
  
  // 挂单列表渲染数据的处理
  changeRenderLive() {
    let liveSellArray = this.store.state.liveSellArray;
    let liveBuyArray = this.store.state.liveBuyArray;
    let unitsType = this.store.state.unitsType;
    let liveBank = this.store.state.prices;
    let liveTitleSelect = this.store.state.titleSelect; // buy,sell,all
    let items = {
      CNY: 'priceCN',
      USD: 'priceEN'
    };
    let formatKey = (unitsType === "CNY" || unitsType === 'USD') ? 'legal' : 'digital';
    let formatProperty = (unitsType === "CNY" || unitsType === 'USD') ? 'legal' : 'property';
    let formatObj = {
      digital: {number: 'digital', style: {decimalLength: this.accuracy.priceAccuracy}},
      legal: {number: 'legal', style: {name: unitsType && unitsType.toLowerCase()}},
      property: {number: 'property', style: {decimalLength: this.accuracy.priceAccuracy + this.accuracy.volumeAccuracy}}
    };
    let dealPrice = Number(liveBank.price && liveBank.price * (liveBank[items[unitsType]] || 1)).format(formatObj[formatKey]);
    let sellSortArray = [], buySortArray = [], sellMid = 0, buyMid = 0;
    if (liveTitleSelect === 'all') {
      liveSellArray = liveSellArray.slice(0, 50);
      liveBuyArray = liveBuyArray.slice(0, 50);
      liveSellArray = liveSellArray && liveSellArray.map(v => {
        v.priceH = Number(v.price * (liveBank[items[unitsType]] || 1));
        v.priceR = Number(v.price * (liveBank[items[unitsType]] || 1)).format(formatObj[formatKey]);
        v.amountR = Number(v.amount).formatFixNumberForAmount(this.accuracy.volumeAccuracy, false);
        v.turnover = Number(v.priceH.multi(v.amount)).format(formatObj[formatProperty]);
        sellSortArray.push(v.amount)
        return v
      });
      liveBuyArray = liveBuyArray && liveBuyArray.map(v => {
        v.priceH = Number(v.price * (liveBank[items[unitsType]] || 1));
        v.priceR = Number(v.price * (liveBank[items[unitsType]] || 1)).format(formatObj[formatKey]);
        v.amountR = Number(v.amount).formatFixNumberForAmount(this.accuracy.volumeAccuracy, false);
        v.turnover = Number(v.priceH.multi(v.amount)).format(formatObj[formatProperty]);
        buySortArray.push(v.amount)
        return Object.assign(v)
      });
      sellSortArray && sellSortArray.sort((a, b) => a > b);
      buySortArray && buySortArray.sort((a, b) => a > b);
      sellSortArray.length % 2 === 0 && (sellMid = (sellSortArray[sellSortArray.length / 2] + sellSortArray[sellSortArray.length / 2 - 1]) / 2) || (sellMid = sellSortArray[(sellSortArray.length - 1) / 2]);
      buySortArray.length % 2 === 0 && (buyMid = (buySortArray[buySortArray.length / 2] + buySortArray[buySortArray.length / 2 - 1]) / 2) || (buyMid = buySortArray[(buySortArray.length - 1) / 2]);
      liveSellArray = liveSellArray.slice(0, 15).reverse();
      liveBuyArray = liveBuyArray.slice(0, 15);
      this.view.setState({
        liveBuyArray,
        liveSellArray,
        dealPrice,
        sellMid,
        buyMid
      })
    }
    if (liveTitleSelect === 'buy') {
      liveBuyArray = liveBuyArray.slice(0, 30);
      liveBuyArray = liveBuyArray && liveBuyArray.length && liveBuyArray.map(v => {
        v.priceH = Number(v.price * (liveBank[items[unitsType]] || 1));
        v.priceR = Number(v.price * (liveBank[items[unitsType]] || 1)).format(formatObj[formatKey]);
        v.amountR = Number(v.amount).formatFixNumberForAmount(this.accuracy.volumeAccuracy, false);
        v.turnover = Number(v.priceH.multi(v.amount)).format(formatObj[formatProperty]);
        buySortArray.push(v.amount)
        return v
      });
      buySortArray.sort((a, b) => a > b);
      buySortArray.length % 2 === 0 && (buyMid = (buySortArray[buySortArray.length / 2] + buySortArray[buySortArray.length / 2 - 1]) / 2) || (buyMid = buySortArray[(buySortArray.length - 1) / 2]);
      this.view.setState({
        buyMid,
        liveBuyArray,
        liveSellArray: [],
        dealPrice
      })
    }
    if (liveTitleSelect === 'sell') {
      liveSellArray = (liveSellArray.slice(0, 30)).reverse();
      liveSellArray = liveSellArray && liveSellArray.length && liveSellArray.map(v => {
        v.priceH = Number(v.price * (liveBank[items[unitsType]] || 1));
        v.priceR = Number(v.price * (liveBank[items[unitsType]] || 1)).format(formatObj[formatKey]);
        v.amountR = Number(v.amount).formatFixNumberForAmount(this.accuracy.volumeAccuracy, false);
        v.turnover = Number(v.priceH.multi(v.amount)).format(formatObj[formatProperty]);
        sellSortArray.push(v.amount)
        return v
      });
      sellSortArray.sort((a, b) => a > b);
      sellSortArray.length % 2 === 0 && (sellMid = (sellSortArray[sellSortArray.length / 2] + sellSortArray[sellSortArray.length / 2 - 1]) / 2) || (sellMid = sellSortArray[(sellSortArray.length - 1) / 2]);
      this.view.setState({
        sellMid,
        liveSellArray,
        liveBuyArray: [],
        dealPrice
      })
    }
  }
}