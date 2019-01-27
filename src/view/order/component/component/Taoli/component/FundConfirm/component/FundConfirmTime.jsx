import React, {Component} from "react";
import ExchangeViewBase from "@/components/ExchangeViewBase";
import OrderCountDown from '../../../../common/OrderCountDown'
import { TLB_TIME } from '@/config/ImageConfig';
import {
  formatQueryToPath
} from "@/config/UrlConfig"

export default class FundConfirmTime extends ExchangeViewBase{

  constructor(){
    super();
    this.state = {

    }
  }

  delayHandler = () => {
    this.props.history.push('/fund/detail/cancel')
  }

  render(){
    const {ExpireAt} = this.props;
    return(
      <div className="fund-confirm-time">
        <p>
          <img src={TLB_TIME} alt=""/>
          <span>
            {this.intl.get('fund-confirm-time1')}
            {ExpireAt && <OrderCountDown
              time={ExpireAt}
              delayHandler={this.delayHandler}/> || null}
            {this.intl.get('fund-confirm-time2')}
          </span>
        </p>
      </div>
    )
  }
}