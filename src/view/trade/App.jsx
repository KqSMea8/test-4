import React, { Component } from "react";
import Trade from './component/Trade'
import UserOrderListController from "@/class/orderList/userOrderList/UserOrderListController";
import KlineController from "@/class/kline/KlineController";

let configController,
    assetController,
    userController,
    // activityController,
    marketController,
    userOrderController,
    klineController,
    TradeDealController,
    popupController;

export default class LoginCon extends Component {
  constructor(props) {
    super(props);
    configController = props.configController;
    assetController = props.assetController;
    userController = props.userController;
    marketController = props.marketController;
    userOrderController = new UserOrderListController();
    klineController = new KlineController();
    popupController = props.popupController;
    TradeDealController = props.tradeDealController;
    
    userOrderController.userController = userController; //订单管理获取用户id
    userOrderController.marketController = marketController;
    userOrderController.configController = configController;
  
    klineController.configController = configController;
  
    userController.configController = configController;
  
    // assetController.configController = configController;
    // assetController.userController = userController;
    // assetController.marketController = marketController;
    // assetController.popupController = popupController;
  
    marketController.userController = userController;
    marketController.configController = configController;
    marketController.assetController = assetController;
    marketController.TradeDealController = TradeDealController;
  
    TradeDealController.configController = configController;
    TradeDealController.marketController = marketController;
  }
  
  
  render() {
    return (
        <Trade
            marketController={marketController}
            userOrderController={userOrderController}
            assetController={assetController}
            klineController={klineController}
            userController={userController}
            TradeDealController={TradeDealController}
        />
    );
  }
}
