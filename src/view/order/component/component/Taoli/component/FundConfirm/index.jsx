import React, {Component} from "react";
import ExchangeViewBase from "@/components/ExchangeViewBase";
import ConfirmTime from "./component/FundConfirmTime"
import ConfirmNotice from "./component/FundConfirmNotice"
import ConfirmCon from "./component/FundConfirmCon"
import ConfirmStep from "./component/FundConfirmStep"
import {getQueryFromPath} from '@/config/UrlConfig'
import {AsyncAll} from '@/core'
import Sleep from '@/core/libs/Sleep';

import './style/index.styl'

import {
  resolveOrderPath,
  goOrderPath
} from "@/config/UrlConfig"


export default class FundConfirm extends ExchangeViewBase {
  constructor(props) {
    super(props);
    this.state = {
      orderId: getQueryFromPath('id'),
      flag: Number(getQueryFromPath('flag'))
    };
    const {controller} = this.props;
    this.getFundCard = controller.getFundCard.bind(controller);
    this.getFundOrderInfo = controller.getFundOrderInfo.bind(controller);
  }

  componentWillMount() {

  }

  async componentDidMount() {
    // 请求初始数据
    let result = await AsyncAll([
      this.getFundCard(this.state.flag),
      this.getFundOrderInfo(JSON.parse(this.state.orderId))
    ]);
    if (result[1].status === 3) {
      this.props.controller.popupController.setState({
        isShow: true,
        type: 'tip3',
        msg: this.intl.get('order-canceled'),
        autoClose: true
      });
      await Sleep(1000);
      this.props.history.push('/fund/detail/cancel');
      return
    }
    this.setState(Object.assign(this.state, ...result));
  }

  render() {
    const {controller, history} = this.props;
    return (
      <div className="fund-confirm">
        <ConfirmTime
          ExpireAt = {this.state.expireSeconds}
          orderId = {this.state.orderId}
          history={history}/>
        <div className="clearfix">
          <ConfirmNotice />
          <div className="fund-confirm-right">
            <ConfirmCon
                propsState = {this.state}
                controller={controller}
                history={history}/>
            <ConfirmStep />
          </div>
        </div>
      </div>
    )
  }
}
