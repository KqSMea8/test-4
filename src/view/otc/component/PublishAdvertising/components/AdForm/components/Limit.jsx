import React, { Component } from 'react'
import ExchangeViewBase from '@/components/ExchangeViewBase.jsx'
import Input from "@/common/baseComponent/Input"
import Regular from "@/core/libs/Regular";
import PropTypes from "prop-types";

export default class Limit extends ExchangeViewBase {
  static propTypes = {
    limitPrice:PropTypes.array.isRequired,
    changeLimitPrice: PropTypes.func.isRequired,
  };
  constructor(props) {
    super(props)
    this.state={
      titleList: [
        {
          title: this.intl.get('otc-publish-limitLow'),
          explain: this.intl.get('otc-publish-limitLow-exp')
        },
        {
          title: this.intl.get('otc-publish-limitHigh'),
          explain: this.intl.get('otc-publish-limitHigh-exp')
        },
      ]
    }
  }

  changeLowPrice = (value)=>{
    if (!Regular("regLegal", value.toString()) && value !== "") return;
    this.props.changeLimitPrice([value, this.props.limitPrice[1]])
  }
  changeHighPrice = (value)=>{
    if (!Regular("regLegal", value.toString()) && value !== "") return;
    this.props.changeLimitPrice([this.props.limitPrice[0], value])
  }


  render() {
    const {limitPrice} = this.props;
    return (
      <div className='adForm-content-item adForm-content-required adForm-content-limitPrice clearfix'>
        <h3>{this.intl.get('otc-publish-limitPrice')}</h3>
        <div className="adForm-content-main clearfix">
          <ul className='clearfix'>
            {
              this.state.titleList.map((v,i)=><li key={i}>
                <h4>{v.title} <span>{v.explain}</span></h4>
                <Input
                  value={limitPrice[i] || ''}
                  onInput={!i ? this.changeLowPrice : this.changeHighPrice}
                />
              </li>)
            }
          </ul>
        </div>
      </div>
    )
  }
}
