import React, { Component } from "react";
import intl from "react-intl-universal";
import {
  Route,
  NavLink,
  Redirect,
  Switch
} from 'react-router-dom'

import Level from './priceChild/Level.jsx' // vip等级
import Score from './priceChild/Score.jsx' // 增长积分
import TradeFee from './priceChild/TradeFee.jsx' // 交易手续费
import WithdrawFee from './priceChild/WithdrawFee.jsx' // 提现手续费
import "../style/index.styl"

export default class Help extends Component {
  constructor(props) {
    super(props);
    this.intl = intl;
    this.controller = props.controller;
  }

  componentDidMount(){
    // this.props.sendStatis({
    //   event: 'homeBottomNav',//操作代码
    //   type: 'rate',//tab
    // })
  }

  render() {
    let match = this.props.match;
    let language = this.props.controller.configController.language

    const level = () => {
      return <Level controller={this.controller}/>;
    };
    const score = () => {
      return <Score controller={this.controller}/>;
    };
    const tradeFee = () => {
      return <TradeFee controller={this.controller}/>;
    };
    const withdrawFee = () => {
      return <WithdrawFee controller={this.controller}/>;
    };

    return (
      <div className="clearfix price-wrap">
        <ul className={`${language === 'zh-CN' ? '' : 'nav-en'} price-nav fl`}>
          {/*<li><NavLink activeClassName="active" to={`${match.url}/level`} >{this.intl.get("price-vip")}</NavLink></li>*/}
          <li><NavLink activeClassName="active" to={`/pricing/tradeFee`}>{this.intl.get("help-trade-fee")}</NavLink></li>
          {/*<li><NavLink activeClassName="active" to={`${match.url}/score`}>{this.intl.get("price-score")}</NavLink></li>*/}
          <li><NavLink activeClassName="active" to={`/pricing/withdrawFee`}>{this.intl.get("price-withdraw-fee")}</NavLink></li>
        </ul>
        <div className="price-content fl">
          <Switch>
            {/*<Route path={`${match.url}/level`} component={level} />*/}
            {/*<Route path={`${match.url}/score`} component={score} />*/}
            <Route path={`/pricing/tradeFee`} component={tradeFee} />
            <Route path={`/pricing/withdrawFee`} component={withdrawFee} />
            <Redirect to={`/pricing/tradeFee`} />
          </Switch>
        </div>
      </div>
    );
  }
}
