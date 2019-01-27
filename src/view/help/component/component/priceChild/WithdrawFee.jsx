import React, { Component } from "react";
import intl from "react-intl-universal";

export default class WithdrawFee extends Component {
  constructor(props) {
    super(props);
    this.intl = intl;
    this.state = {
      result : [],
    };
    this.controller = props.controller
  }

  async componentDidMount(){
    let result = await this.controller.getAllCoin();
    this.setState({
      result
    })
    // 访问统计量
    // this.props.sendStatis({
    //   event: 'pircingPV',//操作代码
    //   type: 'withdrawFee',//tab
    // })
  }

  getLevel() {
    return {
      table: {
        thead: [this.intl.get('help-currency'), this.intl.get('help-withdraw-num'), this.intl.get('help-withdraw-fee')]
      },
      gradeInfo: [
        this.intl.get('help-vip-forver'),
        this.intl.get('help-points-accumulation'),
        this.intl.get('help-adjust'),
        this.intl.get('help-usd-withdrawal'),
      ]
    };
  }

  render() {
    let { table } = this.getLevel();
    return(
      <div>
        <div className="price-title">
          <span>{`${this.intl.get('help-fees')}-${this.intl.get('price-withdraw-fee')}`}</span>
        </div>
        <ul className="gradeInfo">
          <li>{`${this.intl.get('charge')}: ${this.intl.get('help-price-withdraw-free')}`}</li>
          <li>{`${this.intl.get('asset-withdraw')}: ${this.intl.get('help-price-withdraw-adjust')}`}</li>
        </ul>
        <table className="withdraw-table">
          <thead>
            <tr>
              {table.thead.map((v, index) => <th key={index}>{v}</th>)}
            </tr>
          </thead>
          <tbody>
            {this.state.result.map((v, index) => <tr key={index}>
              <td>
                <img src={v.coinImg} alt="" />
                <span>{v.coin && v.coin.toUpperCase()}</span>
                <b> {v.coinFull}</b>
              </td>
              <td>{v.num}</td>
              <td>{v.fee > 0 ? v.fee : "-"}</td>
            </tr>)}
          </tbody>
        </table>
      </div>
    );
  }
}
