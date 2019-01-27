import React, {Component} from "react";
import ExchangeViewBase from "@/components/ExchangeViewBase";
import FundOrderTitle from '../../../../common/OtcOrderTitle'

export default class FundConfirmStep extends ExchangeViewBase{

  constructor(){
    super();
    this.content = [
      this.intl.get('fund-step1'),
      this.intl.get('fund-step2'),
      this.intl.get('fund-step3')
    ]
  }
  render(){
    return(
      <div className="fund-confirm-step">
        <FundOrderTitle
          content={this.intl.get('fund-step-title')}
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