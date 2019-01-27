import React, { Component } from "react";
import intl from "react-intl-universal";
import TotalAsset from "../../../common/TotalAsset";
import Wallets from "./components/OtcWallets";
import {AsyncAll} from '@/core'

export default class Balance extends Component {
  constructor(props) {
    super(props);
    this.name = "balance";
    this.intl = intl;
    let { controller } = props;
    //绑定view
    controller.setView(this);
    this.state = {
      unit: this.intl.get("cny"),
      walletList: [],
      wallet:[]
    };
    let { otcTotalAsset, otcWallet } = controller.initState;
    //初始化数据，数据来源即store里面的state
    this.state = Object.assign(this.state, { otcTotalAsset, otcWallet });
    //绑定方法
    this.getOtcAssets = controller.getOtcAssets.bind(controller);
    this.getTotalAsset = controller.getAssets.bind(controller);
    this.transfer = controller.transfer.bind(controller);
  }

  async componentDidMount() {
    // this.props.sendStatis({
    //   event: 'assetsPV',//操作代码
    //   type: 'balance',//tab
    // })
    let result = await AsyncAll([this.getOtcAssets(), this.getTotalAsset(true)]);
    this.setState(Object.assign({}, ...result))
  }

  changeUnit = (unit)=>{
    this.setState({unit})
  };

  updateAssets = async ()=>{
    let result = await AsyncAll([this.getOtcAssets(), this.getTotalAsset()]);
    this.setState(Object.assign({}, ...result))
  };

  render() {
    return (
      <div className="balance">
        <TotalAsset
          origin='otc'
          totalAsset={this.state.otcTotalAsset}
          controller={this.props.controller}
          unit={this.state.unit}
          changeUnit={this.changeUnit}
        />
        <Wallets
          wallet={this.state.otcWallet}
          exchangeWallet={this.state.wallet}
          controller={this.props.controller}
          unit={this.state.unit}
          history={this.props.history}
          transfer={this.transfer}
          updateAssets={this.updateAssets}
        />
      </div>
    );
  }
}
