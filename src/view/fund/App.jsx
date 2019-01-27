import React, { Component } from "react";
import Fund from './component/Fund'
// import UserOrderListController from "@/class/orderList/userOrderList/UserOrderListController";
import FundController from "@/class/fund/FundController";
import AssetController from "@/class/asset/AssetController";
import MarketController from "@/class/market/MarketController";


let fundController,
    assetController,
    userController,
    popupController,
    marketController,
    configController;

export default class FundCon extends Component {
  constructor(props) {
    super(props);
    configController = props.configController;
    popupController = props.popupController;
    userController = props.userController;
    fundController = new FundController();
    assetController = new AssetController();
    marketController = new MarketController();

    fundController.configController = configController;
  
    fundController.configController = configController;
    fundController.userController = userController;
    fundController.assetController = assetController;
    fundController.popupController = popupController;
    
    assetController.fundController = fundController;
    assetController.userController = userController;
    assetController.marketController = marketController;
  }


  render() {
    return (
      <Fund
        controller={fundController}
      />
    );
  }
}
