import React, {Component} from 'react';
import ExchangeViewBase from "@/components/ExchangeViewBase";
import FundBody from './FundBody.jsx'

export default class FundStable extends ExchangeViewBase{
  constructor(props){
    super(props);
    this.common ={
      stable: this.intl.get('tlb-steadyHow'),
    }
  }
  render(){
    const ulItems = [
      {title: this.intl.get('tlb-steadyTitle1'), content: this.intl.get('tlb-steadyCon1')},
      {title: this.intl.get('tlb-steadyTitle2'), content: this.intl.get('tlb-steadyCon2')},
      {title: this.intl.get('tlb-steadyTitle3'), content: this.intl.get('tlb-steadyCon3')},
    ]
    return(
        <div className='fund-detail-stable'>
          <FundBody>
            <FundBody.title content={this.common.stable}/>
            <FundBody.ul ulItems={ulItems} />
          </FundBody>
        </div>
    )
  }
}