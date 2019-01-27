import React, { Component } from 'react'
import ExchangeViewBase from '@/components/ExchangeViewBase.jsx'
import PropTypes from "prop-types";
import { COMMON_CHECKBOX_SELECT, COMMON_CHECKBOX_NORMAL } from '@/config/ImageConfig';

export default class PayWay extends ExchangeViewBase {
  static propTypes = {
    payWay:PropTypes.number.isRequired,
    changePayWay:PropTypes.func.isRequired,
  };
  constructor(props) {
    super(props)
    this.state={
      titleList: [
        {
          title: this.intl.get('otc-pay-bank1'),
          valueArr: [4,5,6,7],
          weight: 4
        },
        {
          title: this.intl.get('otc-pay-al'),
          valueArr: [1,3,5,7],
          weight: 1
        },
        {
          title: this.intl.get('otc-pay-wechat1'),
          valueArr: [2,3,6,7],
          weight: 2
        },
      ]
    }
  }
  changePayWay = (v)=>{
    if(v.valueArr.includes(this.props.payWay)) {
      this.props.changePayWay(this.props.payWay - v.weight);
      return;
    }
    this.props.changePayWay(this.props.payWay + v.weight);
  }


  render() {
    const {payWay} = this.props;
    return (
      <div className='adForm-content-item adForm-content-required adForm-content-payWay clearfix'>
        <h3>{this.intl.get('otc-trade')}</h3>
        <div className="adForm-content-main clearfix">
          <ul className='clearfix'>
            {
              this.state.titleList.map((v,i)=><li key={i} onClick={()=>{this.changePayWay(v)}}>
                {<img src={COMMON_CHECKBOX_SELECT} className={`${!v.valueArr.includes(payWay) ? 'none' : ''}`} alt=""/>}
                {<img src={COMMON_CHECKBOX_NORMAL} className={`${v.valueArr.includes(payWay) ? 'none' : ''}`} alt=""/>}
                {v.title}
              </li>)
            }
          </ul>
        </div>
      </div>
    )
  }
}
