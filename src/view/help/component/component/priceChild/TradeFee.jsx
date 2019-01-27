import React, { Component } from "react";
import intl from "react-intl-universal";

export default class TradeFee extends Component {
  constructor(props) {
    super(props);
    this.intl = intl
  }

  componentDidMount() {
    // this.props.sendStatis({
    //   event: 'pircingPV',//操作代码
    //   type: 'tradeFee',//tab
    // })
  }

  getTrade() {
    return {
      trade: {
        tradeInfo: [
          this.intl.get("help-tradefee-intro1"),
          this.intl.get("help-tradefee-intro2"),
          this.intl.get("help-tradefee-intro3"),
        ]
      },
    };
  }

  render() {
    let { trade } = this.getTrade();
    return(
      <div className="pircing-trade">
        <div className="price-title">
          <span>{`${this.intl.get('help-fees')}-${this.intl.get('help-trade-fee')}`}</span>
        </div>
        <ul className="pircing-trade-content">
          {trade.tradeInfo.map((v, index) => <li key={index}>{v}</li>)}
        </ul>
      </div>
    );
  }
}
