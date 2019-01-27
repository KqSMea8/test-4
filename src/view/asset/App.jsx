import React, { Component } from "react";
import Asset from './component/Asset'
import AssetController from "@/class/asset/AssetController";
import MarketController from "@/class/market/MarketController";
import ActivityController from "@/class/activity/ActivityController";

let assetController,
    configController,
    userController,
    marketController,
    activityController,
    popupController;

export default class AssetCon extends Component {
  constructor(props) {
    super(props);

    assetController = new AssetController();
    marketController = new MarketController();
    activityController = new ActivityController();
    configController = props.configController;
    userController = props.userController;
    popupController = props.popupController;

    assetController.configController = configController;
    assetController.userController = userController;
    assetController.marketController = marketController;
    assetController.activityController = activityController;
    assetController.popupController = popupController;

    activityController.configController = configController;
    activityController.userController = userController;
  }

  
  render() {
    return (
        <Asset
            controller={assetController}
        />
    );
  }
}
