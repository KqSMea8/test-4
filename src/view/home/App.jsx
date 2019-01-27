import React, { Component } from "react";
import ActivityController from "@/class/activity/ActivityController";
import MarketController from "@/class/market/MarketController";
import Home from './component/Home'

let configController,
    assetController,
    userController,
    loginController,
    noticeController,
    activityController,
    marketController,
    popupController,
    TradeDealController;

export default class HomeCon extends Component {
  constructor(props) {
    super(props);
    configController = props.configController;
    userController = props.userController;
    loginController = props.loginController;
    noticeController = props.noticeController;
    popupController = props.popupController;
    activityController = new ActivityController();
    marketController = new MarketController("market");

    userController.activityController = activityController;
    
    activityController.configController = configController;
    activityController.userController = userController;

    loginController.activityController = activityController;
    
    marketController.userController = userController;
    marketController.configController = configController;
    marketController.assetController = assetController;
    marketController.TradeDealController = TradeDealController;

  }
  
  render() {
    return (
        <Home
          marketController={marketController}
          activityController={activityController}
          noticeController={noticeController}
          userController={userController}
          loginController={loginController}
        />
    );
  }
}
