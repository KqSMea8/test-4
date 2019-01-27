import React, {Component} from 'react';
import ExchangeViewBase from "@/components/ExchangeViewBase";
import FundBody from './FundBody.jsx'

export default class FundRisk extends ExchangeViewBase{
  constructor(props){
    super(props);
    this.common ={
      base: this.intl.get('tlb-safeTheory'),
      rateController: this.intl.get('tlb-safeGet'),
      safe: this.intl.get('tlb-safeEnsure'),
      BTC: '比特币',
    }
  }
  render(){
    const ulItems = [
      {title: this.intl.get('tlb-safeEnsureTitle1'), content: this.intl.get('tlb-safeEnsureCon1', {manager: this.props.manager})},
      {title: this.intl.get('tlb-safeEnsureTitle2'), content: this.intl.get('tlb-safeEnsureCon2', {manager: this.props.manager})},
      {title: this.intl.get('tlb-safeEnsureTitle3'), content: this.intl.get('tlb-safeEnsureCon3')},
      {title: this.intl.get('tlb-safeEnsureTitle4'), content: this.intl.get('tlb-safeEnsureCon4')},
    ];
    let coinCN = this.common[this.props.fund];
    return(
        <div className='fund-detail-risk'>
          <FundBody>
            <FundBody.title content={this.common.base}/>
            <div className="fund-risk-base">{this.intl.get('tlb-safeTheoryCon')}</div>
          </FundBody>
          <FundBody>
            <FundBody.title content={this.common.rateController}/>
            <div className='fund-risk-controll'>
              <p>{this.intl.get('tlb-safeGetCon1')}</p>
              <p>{this.intl.get('tlb-safeGetConBtc')}</p>
              <p>{this.intl.get('tlb-safeGetConUsdt')}</p>
              <p>{this.intl.get('tlb-safeGetCon2')}</p>
              <p>{this.intl.get('tlb-safeGetCon3')}</p>
            </div>
          </FundBody>
          <FundBody>
            <FundBody.title content={this.common.safe}/>
            <FundBody.ul ulItems={ulItems}/>
          </FundBody>
        </div>
    )
  }
}