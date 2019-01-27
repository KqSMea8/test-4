import React, {Component} from "react";
import intl from "react-intl-universal";
import TotalAsset from "../../../common/TotalAsset";
import Wallets from "./component/Wallets";

export default class Balance extends Component {
  constructor(props) {
    super(props);
    this.name = "balance";
    this.intl = intl;
    let {controller} = props;
    //绑定view
    controller.setView(this);
    this.state = {
      unit: this.intl.get("cny"),
    };
    let {totalAsset, wallet} = controller.initState;
    //初始化数据，数据来源即store里面的state
    this.state = Object.assign(this.state, {totalAsset, wallet});
    //绑定方法
    this.getAssets = controller.getAssets.bind(controller);
    // 获取Qbt
    this.getQbt = controller.getMyQbt.bind(controller);
    // 获取Qb信息
    this.getQb = controller.marketController.getQb.bind(
      controller.marketController
    );
  }

  async componentDidMount() {
    // this.props.sendStatis({
    //   event: 'assetsPV',//操作代码
    //   type: 'balance',//tab
    // })
    await this.getAssets();
    let qbt = await this.getQbt();
    let info = qbt && await this.getQb();
    if (qbt && this.state.wallet) {
      qbt.coinIcon = info.d ? info.d.lu : "";
      // this.state.wallet.unshift(qbt);
      this.setState(Object.assign({wallet: this.state.wallet, qbInfo: qbt}));
    }
  }

  changeUnit = (unit) => {
    this.setState({unit})
  };

  render() {
    return (
      <div className="balance">
        <TotalAsset
          totalAsset={this.state.totalAsset}
          controller={this.props.controller}
          unit={this.state.unit}
          changeUnit={this.changeUnit}
        />
        <Wallets
          wallet={this.state.wallet}
          qbInfo={this.state.qbInfo}
          history={this.props.history}
          unit={this.state.unit}
          controller={this.props.controller}
        />
      </div>
    );
  }
}
