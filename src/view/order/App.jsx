import React, { Component } from "react";
import Order from './component/Order'
import UserOrderListController from "@/class/orderList/userOrderList/UserOrderListController";
import MarketController from "@/class/market/MarketController";
import OtcController from "@/class/otc/OtcController"
import AssetController from "@/class/asset/AssetController"

let userOrderController,
    configController,
    userController,
    noticeController,
    otcController,
    assetController,
    popupController,
    marketController;

export default class OrderCon extends Component {
  constructor(props) {
    super(props);
    
    configController = props.configController;
    popupController = props.popupController;
    noticeController = props.noticeController;
    userController = props.userController;
    userOrderController = new UserOrderListController();
    marketController = new MarketController();
    otcController = new OtcController();
    assetController = new AssetController();

    userOrderController.configController = configController;
    userOrderController.userController = userController;
    userOrderController.marketController = marketController;
    userOrderController.otcController = otcController;
    userOrderController.assetController = assetController;
    userOrderController.popupController = popupController;
    assetController.userController = userController;
    noticeController.userOrderController = userOrderController;
  }


  render() {
    return (
      <Order
        controller={userOrderController}
      />
    );
  }
}
