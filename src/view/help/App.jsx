import React, { Component } from "react";
import Help from './component/Help'
import MarketController from "@/class/market/MarketController";
import AssetController from "@/class/asset/AssetController";

let assetController,
    marketController,
    configController;

export default class HelpCon extends Component {
  constructor(props) {
    super(props);

    configController = props.configController;
    assetController = new AssetController();
    marketController = new MarketController();

    assetController.configController = configController;
    assetController.marketController = marketController;
  }


  render() {
    return (
      <Help
        controller={assetController}
      />
    );
  }
}
