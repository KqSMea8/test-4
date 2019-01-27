import React, {Component} from "react";
import ExchangeViewBase from "@/components/ExchangeViewBase";
import FundOrderTitle from '../../../../common/OtcOrderTitle'

export default class FundConfirmNotice extends ExchangeViewBase{

  constructor(){
    super();
    this.content = [
      this.intl.get('fund-notice1'),
      this.intl.get('fund-notice2'),
      this.intl.getHTML('fund-notice3')
    ]
  }
  render(){
    return(
      <div className="fund-confirm-notice">
        <FundOrderTitle
          content={this.intl.get('fund-notice-title')}
        />
        <ol>
          {this.content.map((v, index) => (
            <li key={index}>{v}</li>
          ))}
        </ol>
      </div>
    )
  }
}