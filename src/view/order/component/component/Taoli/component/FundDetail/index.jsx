import React, {Component} from "react";
import ExchangeViewBase from "@/components/ExchangeViewBase";
import Nav from '../../../Nav'
import OrderFundCon from './component/OrderFund'
import "./style/index.styl"

import {
  resolveOrderPath
} from "@/config/UrlConfig"


export default class OrderFund extends ExchangeViewBase {
  constructor(props) {
    super(props);
    this.state = {
      pairIdMsg: {}
    };
    // const {controller} = this.props;
    //绑定view
    // controller.setView(this);
    //初始化数据，数据来源即store里面的state
    // this.state = Object.assign(this.state, controller.initState);
  }

  async componentDidMount() {

  }

  render() {
    // const {match} = this.props;
    return (
      <div className="qb clearfix">
        <Nav/>
        <div className='order-content fr'>
          <OrderFundCon controller={this.props.controller} pairIdMsg={this.state.pairIdMsg}/>
        </div>
      </div>
    )
  }
}
