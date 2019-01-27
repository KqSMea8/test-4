import React, { Component } from 'react'
import ExchangeViewBase from '@/components/ExchangeViewBase.jsx'
import RangeSlider from '@/common/baseComponent/RangeSlider'
import Input from '@/common/baseComponent/Input'
import AmountInput from '@/common/component/AmountInput'
import Regular from "@/core/libs/Regular";
import PropTypes from "prop-types";
import { YIWEN_ACTIVE_LIGHT } from '@/config/ImageConfig';

export default class SetFloat extends ExchangeViewBase {
  static propTypes = {
    premium: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    marketPrice: PropTypes.number.isRequired,
    changePremium: PropTypes.func.isRequired,
    changePrice: PropTypes.func.isRequired,
    legal: PropTypes.string.isRequired,
    type: PropTypes.number.isRequired,
    lowPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    highPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    changeLowPrice: PropTypes.func.isRequired,
    changeHighPrice: PropTypes.func.isRequired,

  };
  constructor(props) {
    super(props)
    this.state={
      max: 70,
      min: -70,
      amount: props.premium
    }
  }


  componentDidUpdate(prevProps, prevState) {
    if(prevProps.premium !== this.props.premium) {
      this.setState({amount: this.props.premium})
    }
  }


  tipFormatter=(value)=>{
    return value;
  }
  add=()=>{
    let premium = Number(Number(this.props.premium).plus(0.01)) > this.state.max ? this.state.max : Number(Number(this.props.premium).plus(0.01));
    this.props.changePrice(Number(this.props.marketPrice.multi(1 .plus(premium.div(100)))).format({ number: "legal", style:{decimalLength: 2} }));
    this.props.changePremium(premium);
  }

  minus=()=>{
    let premium = Number(Number(this.props.premium).minus(0.01)) <  this.state.min ? this.state.min : Number(Number(this.props.premium).minus(0.01));
    this.props.changePrice(Number(this.props.marketPrice.multi(1 .plus(premium.div(100)))).format({ number: "legal", style:{decimalLength: 2} }));
    this.props.changePremium(premium);
  }
  changeAmount=(value)=>{
    if(value === "-" || value === "") this.setState({amount: value});
    if (!Regular("regNumber2", value.toString()) && value !== "") return;
    if(Number(value) === 0 && !value.includes('.') && value !== "" && value !== "-0") value = '0'
    // // value === '-' && (value = 0)
    Number(value) > this.state.max && (value = this.state.max);
    Number(value) < this.state.min && (value = this.state.min)
    this.props.changePremium(value);
    this.props.changePrice(Number(this.props.marketPrice.multi(1 .plus(Number(value).div(100)))).format({ number: "legal", style:{decimalLength: 2} }));
  }
  onChange=(value)=>{
    this.props.changePrice(Number(this.props.marketPrice.multi(1 .plus(Number(value).div(100)))).format({ number: "legal", style:{decimalLength: 2} }));
    this.props.changePremium(value)
  }
  render() {
    const {premium, legal, marketPrice, type, lowPrice, highPrice, changeLowPrice, changeHighPrice} = this.props;
    return (
      <div className='adForm-content-item adForm-content-required adForm-content-SetFloat clearfix'>
        <h3>{this.intl.get('otc-publish-setFloat')}</h3>
        <div className="adForm-content-main clearfix">
          <h5>
            {this.intl.get('otc-publish-floatTip')}
            <img src={YIWEN_ACTIVE_LIGHT} alt=""/>
          </h5>
          <div className="range clearfix">
            <span>-70</span>
            <span>70</span>
            <RangeSlider
              max={this.state.max}
              min={this.state.min}
              step={0.01}
              value={Number(premium)}
              onChange={this.onChange}
              tipFormatter={this.tipFormatter}
            />
            <p>{this.intl.get('otc-publish-floatEquation', {price:marketPrice, legal: legal, premium: Number(1 .plus(Number(premium).div(100)))})}</p>
          </div>
          <div className="amount">
            <AmountInput
              value={this.state.amount}
              add={this.add}
              minus={this.minus}
              onInput={this.changeAmount}
            />
          </div>
          <div className="boundary">
            {!type && <Input
              value={highPrice || ''}
              onInput={changeHighPrice}
              placeholder={this.intl.get('otc-publish-setHigh')}
            /> || ''}
           { type && <Input
              value={lowPrice || ''}
              onInput={changeLowPrice}
              placeholder={this.intl.get('otc-publish-setLow')}
           /> || ''}
          </div>
        </div>
      </div>
    )
  }
}
