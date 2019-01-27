
import Util from "@/core/libs/GlobalUtil";
import Crypto from "@/core/libs/Crypto"

import DealStore from './DealStore'

export default class DealController {
  constructor() {
    this.store = new DealStore();
    this.RSAencrypt = Crypto;
  }
  
  setView(view) {
    this.view = view
  }
  get initState() {
    return (this.store && Util.deepCopy(this.store.state)) || {};
  }
  setPairMsg(value) {
    this.store.state.setPairMsg = value;
    this.store.state.priceDeal = value.prices.price;
    this.store.state.priceHigh = value.highestPrice;
    this.store.state.priceLow = value.lowestPrice;
    this.store.state.priceYest = Number(value.prices.price.div(1 + value.rise));
    this.store.state.turnover = value.turnover;
    this.view && this.view.setState({
      tradePairMsg: value
    });
  }
  
  // 更新最新成交价
  updateLastDeal(value, type = true, flag = true) {
    let priceDeal = value.orders[0].price;
    if (!type && (!flag || this.store.state.priceDeal === priceDeal))
      return
    let preValue = this.store.state.setPairMsg;
    let preLow = this.store.state.priceLow;
    let preHigh = this.store.state.priceHigh;
    let preYest = this.store.state.priceYest;
    let rise = Number((priceDeal - preYest).div(preYest));
    let turnover = Number(Number(preValue.turnover).plus(Number(value.turnover)));
    preValue.prices.price = priceDeal;
    preValue.rise = rise;
    preValue.updown = priceDeal - this.store.state.priceDeal;
    preValue.lowestPrice = value.lower < preLow ? value.lower : preLow;
    preValue.highestPrice = value.higher > preHigh ? value.higher : preHigh;
    preValue.turnover = turnover;
    this.view.setState({
      tradePairMsg: preValue
    })
    this.TradeOrderListController && this.TradeOrderListController.getDealPrice(
        {
          price: priceDeal,
          updown: priceDeal - this.store.state.priceDeal
        }
    )
  }
  
  setPriceFlag() {
    this.view.setState(
        {
          inputBuyFlag: false,
          inputSellFlag: false
        }
    )
  }
  
  tradePairHandle(pair, prices, flag) {
    let pairArr = pair.split('/'),
        coin = pairArr[0],
        market = pairArr[1];
    this.view.setState(
        {
          NumUnit: coin,
          Market: market,
          Coin: coin,
          PriceUnit: ['CNY', 'USD'].includes(this.view.state.PriceUnit) && this.view.state.PriceUnit || market,
          priceBank: {
            CNY: Number(prices.priceCN * prices.price).toFixedUp(2),
            USD: Number(prices.priceEN * prices.price).toFixedUp(2)
          },
          dealBank: prices,
        }
    );
    if (!['CNY', 'USD'].includes(this.view.state.PriceUnit) && flag === 3) {
      //初始以及切换交易对的时候不需要初始化以及设置计价方式
      // this.TradeMarketController.setUnitsType(market);
      // this.userOrderController.setUnitsType(market);
      // this.TradeRecentController.setUnitsType(market);
      // this.TradeOrderListController.setUnitsType(market);
      this.store.state.PriceUnit = market;
    }
    this.store.state.prices = prices;
    flag === 3 && (this.store.state.buyNumFlag = false);
    flag === 3 && this.setPriceInit(prices, flag);
    flag === 3 && this.view.setState(
        {
          buyPointer: 0,
          sellPointer: 0,
        });
    flag === 3 && (this.store.state.changeMaxFlag = true);
    flag === 3 && (this.userOrderController.setInitUnit(market, coin));
    flag === 3 && (this.TradeRecentController.setInitUnit(market, coin));
    flag === 3 && (this.TradeOrderListController.setInitUnit(market, coin));
    this.store.state.NumUnit = coin;
    flag === 3 && this.coinMinTradeHandle(coin);//最小交易量的处理
  }

//点击挂盘价格后处理
  orderHandle(prices) {
    let checkNum = this.store.state.volumeAccuracy;
    this.store.changeMaxFlag = false;
    this.view.setState({
      prices,
      inputBuyFlag: false,
      inputSellFlag: false,
      priceBank: {
        CNY: Number(prices.priceCN * prices.price).toFixedUp(2),
        USD: Number(prices.priceEN * prices.price).toFixedUp(2)
      },
      buyPointer: 0,
      sellPointer: 0,
      dealBank: prices,
    });
    this.store.state.prices = prices;
    this.store.state.buyMax = (this.store.state.buyWallet && prices.price) ? Number(Number(this.store.state.buyWallet).div(prices.price)).maxHandle(checkNum) : 0;
    this.setPriceInit(prices);
  }
  
  // 数字币计价 初始值获取
  setPriceInit(v) {
    this.store.state.inputBuyFlag = false;
    this.store.state.priceInit = v.price;
    this.view.setState({
      priceInit: v.price,
      inputSellNum: 0,
      inputBuyNum: 0,
      inputBuyFlag: false
    })
  }
  
  // 设置市价交易的最大数量值
  setMarketPriceMaxNum(v) {
    let checkNum = this.store.state.volumeAccuracy;
    this.store.state.marketChangePrice = v.price;
    this.store.state.marketBuyMax = (this.store.state.buyWallet && v.price) ? Number(Number(this.store.state.buyWallet).div(v.price)).maxHandle(checkNum) : 0;
    this.store.state.marketSellMax = Number(this.store.state.sellWallet).maxHandle(checkNum);
    this.view.setState({
      marketChangePrice: v.price,
      marketBuyMax: this.store.state.buyWallet ? Number(Number(this.store.state.buyWallet).div(v.price)).maxHandle(checkNum) : 0,
      marketSellMax: Number(this.store.state.sellWallet).maxHandle(checkNum)
    })
  }
  
  changeUnit(unit, init) {
    let unitObj = {
      'CNY': 'CNY',
      'USD': 'USD',
    };
    unitObj[init] = this.view.state.Market;
    let fromValue = (this.store.state.prices.price || 1) * (this.store.state.PriceUnit === 'CNY' ? this.store.state.prices.priceCN : (this.store.state.PriceUnit === 'USD' && this.store.state.prices.priceEN || 1));
    let unitSelected = unitObj[unit];
    this.store.state.PriceUnit = unitSelected;
    this.view.setState({
      PriceUnit: unitSelected,
      UnitSelected: unit
    }, this.changePrice(unitSelected, fromValue));
    this.TradeOrderListController.setChangeFlagClose();
    this.store.state.PriceUnit = unitSelected;
    this.TradeMarketController.setUnitsType(unitSelected);
    this.userOrderController.setUnitsType(unitSelected);
    this.TradeRecentController.setUnitsType(unitSelected);
    this.TradeOrderListController.setUnitsType(unitSelected);
  }
  
  changePrice(v, fromValue) {
    let prices = this.store.state.prices,
        initPrice = prices.price,
        priceBank = {
          CNY: Number(prices.priceCN * prices.price).toFixedWithoutUp(2),
          USD: Number(prices.priceEN * prices.price).toFixedWithoutUp(2),
        }
    ;
    this.view.setState({
      priceBank,
      initPrice: prices.price
    });
    if (this.view.state.inputSellFlag || this.view.state.inputBuyFlag) {
      let toValue = (this.store.state.prices.price || 1) * (v === 'CNY' ? this.store.state.prices.priceCN : (v === 'USD' && this.store.state.prices.priceEN || 1)),
          inputSellValue, inputBuyValue;
      this.view.state.inputSellFlag && (inputSellValue = this.view.state.inputSellValue / fromValue * toValue);
      this.view.state.inputBuyFlag && (inputBuyValue = this.view.state.inputBuyValue / fromValue * toValue);
      let checkNum = this.store.state.priceAccuracy;
      let limitedValue = (v === 'CNY' || v === 'USD') ? 2 : checkNum;
      this.view.state.inputSellFlag && (inputSellValue = inputSellValue.toFixedUp(limitedValue));
      this.view.state.inputBuyFlag && (inputBuyValue = inputBuyValue.toFixedUp(limitedValue));
      this.view.setState({
        inputSellValue,
        inputBuyValue
      });
    }
  }
  
  changeMaxNum(t, v) {
    let price = Number(v);
    let changeBankPrice = this.store.state.PriceUnit === "CNY" ? (price * this.store.state.prices.price / this.store.state.prices.priceCN) : (this.store.state.PriceUnit === "USD" && (price * this.store.state.prices.price / this.store.state.prices.priceEN) || price);
    let checkNum = this.store.state.volumeAccuracy;
    this.store.state.priceInit = changeBankPrice;
    if (t === 1) {
      this.view.setState(
          {
            sellPointer: Math.floor(this.view.state.inputSellNum / this.store.state.sellWallet / 0.25)
          })
    }
    if (t === 0) {
      this.view.setState(
          {
            buyPointer: Math.floor(this.view.state.inputBuyNum / Number(Number(this.store.state.buyWallet).div(changeBankPrice)).maxHandle(checkNum) / 0.25)
          })
      this.store.state.buyMax = (this.store.state.buyWallet && changeBankPrice) ? Number(Number(this.store.state.buyWallet).div(changeBankPrice)).maxHandle(checkNum) : 0
    }
    if (this.store.state.PriceUnit === "CNY" || this.store.state.PriceUnit === "USD") {
      t === 1 && (this.view.setState({changBankPriceS: changeBankPrice}));
      t === 0 && (this.view.setState({changBankPriceB: changeBankPrice}))
    }
    // 达到最大数量后,更改价格,数量随之联动
    if (this.store.state.buyNumFlag && (t === 0)) {
      this.view.setState({
        inputBuyNum: Number(this.store.state.buyWallet.div(changeBankPrice)).maxHandle(checkNum),
        buyPointer: 4
      })
    }
    
  }
  
  async dealTrade(orderType) {
    let funPwdInterval = this.view.state.fundPwdInterval;
    let numLimit = this.store.state.volumeAccuracy;
    let priceLimit = this.store.state.priceAccuracy;
    let sellPriceValue = (this.view.state.PriceUnit === 'CNY' || this.view.state.PriceUnit === 'USD') ? (this.view.state.dealSurePriceD.toFixedUp(priceLimit)) : (this.view.state.inputSellFlag ? (this.view.state.inputSellValue) : (this.view.state.priceBank[this.view.state.PriceUnit] || this.view.state.priceInit));
    let buyPriceValue = (this.view.state.PriceUnit === 'CNY' || this.view.state.PriceUnit === 'USD') ? (this.view.state.dealSurePriceD.toFixedUp(priceLimit)) : (this.view.state.inputBuyFlag ? (this.view.state.inputBuyValue) : (this.view.state.priceBank[this.view.state.PriceUnit] || this.view.state.priceInit));
    let emptyCharge = this.view.state.setPass;
    let params = {
      token: this.userController.userToken,
      "orderType": orderType === 'buy' ? 0 : 1,//0买 1 卖
      "priceType": this.view.state.DealEntrustType,//0限价  1市价
      "price": this.view.state.DealEntrustType ? 0 : Number(orderType === 'buy' ? buyPriceValue : sellPriceValue),//价格
      "count": Number(orderType === 'buy' ? this.view.state.inputBuyNum : this.view.state.inputSellNum),//数量
      "tradePairId": this.TradeMarketController.tradePair.tradePairId,
      "tradePairName": this.TradeMarketController.tradePair.tradePairName,
      "funpass": funPwdInterval ? '' : this.RSAencrypt(this.view.state.funpass),//资金密码
      "interval": funPwdInterval,// 0:每次都需要密码 1:2小时内不需要 2:每次都不需要
      // "priceUnit": this.view.state.PriceUnit === 'CNY' && 1 || (this.view.state.PriceUnit === 'USD' && 2 || 0)//计价单位  0数字币  1人民币 2美元
      "priceUnit": 0
    };
    // 判断数量精度
    let limitNum = params.count.toString().split('.');
    let limitPrice = params.price.toString().split('.')
    limitNum[1] = limitNum[1] || '';
    limitPrice[1] = limitPrice[1] || '';
    let regN = new RegExp(`^[0-9]{0,${numLimit}}$`);
    let regP = new RegExp(`^[0-9]{0,${priceLimit}}$`);
    let flagN = regN.test(limitNum[1]);
    let flagP = regP.test(limitPrice[1]);
    if (!(flagN && flagP)) {
      this.store.state.dbPreOrder = false;
      this.store.state.dbPreOrderD = false;
      this.store.state.dbPreOrderF = false;
      this.view.setState(
          {
            dealPopMsg: this.view.intl.get('deal-num-err'),
            dealPassType: 'passive',// 弹窗类型倾向
            dealPass: true,// 下单弹窗
          }
      );
      return
    }
    if (params.interval === 0 && emptyCharge === '') {
      this.store.state.dbPreOrderF = false;
      this.view.setState(
          {
            dealPopMsg: this.view.intl.get("deal-pass-empty"),
            dealPassType: 'passive',// 弹窗类型倾向
            dealPass: true,// 下单弹窗
          }
      )
      return
    }
    let result = await this.store.dealTrade(params);
    this.store.state.dbPreOrder = false;
    this.store.state.dbPreOrderD = false;
    this.store.state.dbPreOrderF = false;
    this.view.setState({
      dealSurePop: false
    });
    if (result.id) {
      this.view.setState(
          {
            dealPopMsg: this.view.intl.get("orderSuccess"),
            dealPassType: 'positi',// 弹窗类型倾向
            dealPass: true,// 下单弹窗
            pwdPop: false,
            setPass: '',
            inputSellNum: 0, // 数量清空
            inputBuyNum: 0,
            buyPointer: 0,
            sellPointer: 0,
          }
      );
      return
    }
    if (result) {
      this.view.setState(
          {
            dealPopMsg: result.msg,
            dealPassType: 'passive',// 弹窗类型倾向
            dealPass: true,// 下单弹窗
            funpassBuy: '',
            funpassSell: '',
          }
      )
    }
    // RPC_STATUS_NOT_FOUND                          = 1404 // NotFound
    // RPC_STATUS_ORDER_GET_ASSET_LIST_ERROR         = 1410 // 获取资产列表出错
    // RPC_STATUS_ORDER_GET_ASSET_ERROR              = 1411 // 获某个取资出错
    // RPC_STATUS_ORDER_ASSET_NOT_ENOUGH_ERROR       = 1412 // 资产不足 不等提交订单
    // RPC_STATUS_ORDER_LOCK_ASSET_ERROR             = 1413 // 锁定资产失败
    // RPC_STATUS_ORDER_CANCEL_NO_ORDERID            = 1414 // 取消订单时缺少订单ID
    // RPC_STATUS_ORDER_CANCEL_OPERATION_ILLEGAL     = 1415 // 取消订单操作不合法
    // RPC_STATUS_ORDER_MARKET_TRADE_UNSUITABLE      = 1416 // 当前挂单不适合市价交易，建议限价交易
    // RPC_STATUS_ORDER_MARKET_LAST_PRICE_NOT_EXISTS = 1417 // 没有最新成交价或成交价为0 没有成交的订单
    // RPC_STATUS_ORDER_VOLUME_LESS_MINER_FEE        = 1418 // 挂单量小于最小交易量
    // RPC_STATUS_ORDER_DEAL_FORBIDDEN               = 1420 // 该币种禁止在所有市场进行交易
    // RPC_STATUS_ORDER_PRICE_LIMIT_OVERFLOW         = 1421 // 价格精度超出限制
    // RPC_STATUS_ORDER_VOLUME_LIMIT_OVERFLOW        = 1422 // 数量精度超出限制
    // RPC_STATUS_ORDER_USER_DEAL_FORBIDDEN    = 1423 // 禁止用户交易
    //
    // RPC_STATUS_INTERNAL_SERVER_ERROR              = 1500 // 服务器内部错误
    // RPC_STATUS_ORDER_SERVICE_NOT_AVAILABLE     = 1501 // 订单服务暂不可用
    // }
    // await this.store.dealTrade(v);
  }
  
  async getFundPwdInterval() {
    let fundPwdInterval = await this.userController.getFundPwdInterval();
    this.view.setState({
      fundPwdInterval: fundPwdInterval.mode,
      fundPwdIntervalS: fundPwdInterval.mode
    });
    this.store.state.interval = fundPwdInterval.mode;
    return fundPwdInterval.mode
  }
  
  //设置可用额度
  setWallet(sellWallet, buyWallet) {
    let checkNum = this.store.state.volumeAccuracy;
    this.store.setWallet(buyWallet, sellWallet);
    let changeMaxFlag = this.store.state.changeMaxFlag;
    let value = this.store.state.priceInit;
    this.view.setState({
      sellWallet,
      buyWallet,
    });
    this.store.state.buyMax = (this.store.state.buyWallet && value) ? Number(Number(this.store.state.buyWallet).div(value)).maxHandle(checkNum) : 0;
    this.store.state.sellMax = Number(sellWallet).maxHandle(checkNum);
    this.setMarketPriceMaxNum({price: value})
  }
  
  // 获取最小额度
  async getCoinMinTrade() {
    let result = this.store.getCoinMinTrade();
    this.view.setState(
        {coinMinTrade: result}
    )
  }
  
  coinMinTradeHandle(coin) {
    let coinMinTrade = this.store.state.coinMinTrade;
    let coinMinItem = coinMinTrade.find(v => v.coinName === coin);
    this.store.state.coinMin = coinMinItem && coinMinItem.minTrade;
    this.view.setState({
      coinMin: coinMinItem && coinMinItem.minTrade,
    })
  }
  
  setAccuracy(priceAccuracy, volumeAccuracy) {
    this.store.state.volumeAccuracy = volumeAccuracy;
    this.store.state.priceAccuracy = priceAccuracy;
  }
  
  // 是否可充币处理
  async getCharge(coin, market) {
    let result = await this.store.getCharge();
    let coinCharge = result.l.find(v => v.n === coin);
    let marketCharge = result.l.find(v => v.n === market);
    this.view.setState({
      coinChargeFlag: coinCharge && coinCharge.c,
      marketChargeFlag: marketCharge && marketCharge.c
    })
  }
}