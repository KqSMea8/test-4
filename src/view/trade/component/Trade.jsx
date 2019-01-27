import React, {Component} from 'react';
import exchangeViewBase from "@/components/ExchangeViewBase";
// import TradeMarket from './children/TradeMarket.jsx'
import LiveTrade from './component/LiveTrade.jsx'
import RecentTrade from './component/RecentTrade.jsx'
// import TradePairDeal from './children/TradePairDeal.jsx'
import TradePlan from './component/TradePlan.jsx'
// import TradeNotice from './children/TradeNotice.jsx'
import ReactKline from './kline/index'
import ReactKDepth from './depth/index'

// import MarketController from '../../class/market/MarketController'
import OrderListController from '@/class/orderList/OrderListController'
import TradeOrderController from '@/class/orderList/tradeOrderList/TradeOrderListController'
// import UserOrderListController from '../../class/orderList/userOrderList/UserOrderListController'
// import NoticeController from "@/class/notice/NoticeController";
import DealController from '@/class/deal/DealController'
// import UserController from '../../class/user/UserController'
// import KlineController from '../../class/kline/KlineController'
import KdepthController from '@/class/kdepth/KdepthController'

import './style/tradePro.styl'
import UserOrder from "./component/UserOrder";
import ConfigController from "@/class/config/ConfigController";
import Translate from "@/core/libs/Translate";
import {ChangeFontSize} from "@/core";
import TradeLang from '../lang'

let TradeMarketController,
  TradeOrderListController,
  TradeRecentController,
  userOrderController,
  // noticeController,
  // TradeDealController,
  // TradeUserListController,
  TradePlanController,
  userController,
  configController,
  assetController,
  // klineController,
  kdepthController,
  TradePairDealController

// const userOrderItems = []
class Trade extends exchangeViewBase {
  constructor(props) {
    super(props)

    TradeMarketController = props.marketController; //市场
    TradeOrderListController = new TradeOrderController();//挂单列表
    TradeRecentController = new OrderListController('recentOrder');//近期交易
    userOrderController = props.userOrderController;//用户订单
    // noticeController = new NoticeController(); //资讯
    // TradeDealController = new DealController(); //市场上交易信息
    TradePairDealController = props.TradeDealController; // 交易盘信息(最新成交)
    TradePlanController = new DealController();//交易
    userController = props.userController; //用户
    assetController = props.assetController; //用户
    configController = new ConfigController(); // 基础设置
    // klineController = new KlineController();
    kdepthController = new KdepthController();
    TradeMarketController.klineController = props.klineController;
    kdepthController.configController = configController;
    // TradeDealController.configController = configController;

    // TradeMarketController.klineController = klineController;

    //近期交易同市场及交易盘信息
    TradeRecentController.TradePairDealController = TradePairDealController;
    // TradeUserListController = new UserOrderListController();
    // userController = new UserController()

    // TradeMarketController.TradeDealController = TradeDealController;
    TradeMarketController.TradePlanController = TradePlanController;
    TradeMarketController.TradeRecentController = TradeRecentController;
    TradeMarketController.TradeOrderListController = TradeOrderListController;

    TradeOrderListController.TradeMarketController = TradeMarketController;
    TradeOrderListController.TradePlanController = TradePlanController;
    TradeOrderListController.kdepthController = kdepthController;
    TradeOrderListController.configController = configController;

    TradeRecentController.userController = userController;
    TradeRecentController.TradeMarketController = TradeMarketController;
    TradePairDealController.TradeOrderListController = TradeOrderListController;


    //id处理的两种方式:
    TradeMarketController.userOrderController = userOrderController;
    userOrderController.TradeMarketController = TradeMarketController;
    userOrderController.TradeOrderListController = TradeOrderListController;

    TradePlanController.userController = userController;
    TradePlanController.TradeMarketController = TradeMarketController;
    TradePlanController.TradeRecentController = TradeRecentController;
    TradePlanController.userOrderController = userOrderController;
    TradePlanController.TradeOrderListController = TradeOrderListController;
    TradePlanController.configController = configController;

    // noticeController.configController = configController;

    // noticeController.userController = userController;
    assetController.TradePlanController = TradePlanController;
    // 父子实例
    userOrderController.TradeRecentController = TradeRecentController;
    // userOrderController.noticeController = noticeController // 调用notice里的高度方法

    this.changeHeight = this.changeHeight.bind(this)

    this.state = {
      curChart: "kline",
      tradeHeight: 0,
    }
  }

  switchChart(name) {
    this.setState({curChart: name});
  }

  componentWillUnmount() {
    TradeMarketController.klineController = null;
    // TradeMarketController.TradeDealController = null;
    TradeMarketController.TradePlanController = null;
    TradeMarketController.TradeRecentController = null;
    TradeMarketController.TradeOrderListController = null;
    TradeMarketController.userOrderController = null;
  }

  async componentDidMount() {
    TradeMarketController.marketDataHandle();
    this.changeHeight();
    let resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
    window.addEventListener(resizeEvt, this.changeHeight, false)
    ChangeFontSize(1440 * 0.8, 1440 * 2)
    // TradePairDealController.configController.sendStatis(
    //     {
    //       event: 'exchangePV',//操作代码
    //       type: 'exchange',//tab
    //     }
    // )
  }
  changeHeight(){
    let tradeHeight = window.innerHeight;
    tradeHeight -= 50;
    // this.Logger.error(tradeHeight)
    this.setState(
        {
          tradeHeight
        },()=>{
          ChangeFontSize(1440 * 0.8, 1440 * 2)
        }
    )
  }
  render() {
    return <div id="trade_pro" style={{height: this.state.tradeHeight, minHeight: '630px'}}>
      <div className='trade-left'>
        <div className='trade-left-top trade-chart'>
          <div className="k-menu">
            <button className={this.state.curChart === "kline" ? "active" : ""}
              onClick={this.switchChart.bind(this, "kline")}>
              {this.intl.get("kline")}
            </button>
            <button className={this.state.curChart === "depth" ? "active" : ""}
              onClick={this.switchChart.bind(this, "depth")}>
              {this.intl.get("depth")}
            </button>
          </div>
          <ReactKline show={this.state.curChart === "kline"} controller={TradeMarketController.klineController}/>
          <ReactKDepth show={this.state.curChart === "depth"} controller={kdepthController}/>
        </div>
        <div className='trade-left-bottom'>
            <div className="trade-order">
              <UserOrder controller={userOrderController} assetController={assetController}/>
            </div>
        </div>
      </div>
      <div className='trade-right'>
        <div className='trade-right-top'>
          <div className='trade-pro-live'>
            <LiveTrade controller={TradeOrderListController}/>
          </div>
          <div className='trade-pro-recent'>
              <RecentTrade controller={TradeRecentController}/>
          </div>
        </div>
        <div className='trade-right-bottom'>
          <div className='trade-pro-plan'>
            <TradePlan controller={TradePlanController} history={this.props.history}/>
          </div>
        </div>
      </div>
    </div>
  }
}

export default Translate(Trade, TradeLang)