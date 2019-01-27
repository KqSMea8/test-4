import React, {Component} from "react";
import ExchangeViewBase from "@/components/ExchangeViewBase";
import PropTypes from "prop-types"
import Input from '@/common/baseComponent/Input/index'
import {
  OTC_EXCHANGE_B,
  YIWEN_ACTIVE
} from '@/config/ImageConfig'

export default class OtcOrderPrice extends ExchangeViewBase {
  static defaultProps = {
    // orderType: 0,
    currency: 'BTC',
    digital: 'CNY',
    price: 40000,
    digitalValue: '',
    currencyNum: '',
    limitHighValue: 20000,
    limitLowValue: 2000,
    limitMaxNum: 2,
    asset: 24.96,
    errorState: 0,
  };
  static propTypes = {
    orderType: PropTypes.number.isRequired,
    currencyNumInput: PropTypes.func.isRequired,
    digitalValueInput: PropTypes.func.isRequired,
  };
  
  constructor() {
    super();
    this.errorMsg = {
      1: this.intl.get('order-input-limit')
    }
  }
  
  render() {
    const {
      currency,
      digital,
      price,
      orderType,
      digitalValue,
      currencyNum,
      asset,
      digitalValueInput,
      currencyNumInput,
      errorState,
      mode,
      sellAll,
        lang
    } = this.props;
    // console.log('qqqqqqq',this.props.lang)
    return (
        <div className='otc-order-price'>
          <p className='order-price-s'>{`${this.intl.get('order-current-otc')}${currency}${mode === 2 ? this.intl.get('order-price-sf') : this.intl.get('order-price-s')} (${digital}) : `}
            <span>{price}</span>
            <b className="pop-parent">
              <img src={YIWEN_ACTIVE}/>
              <em className={`pop-children uppop-children ${lang === 'en-US' ? 'pop-us-children' : ''}`}>{this.intl.get("otc-price-tip")}</em>
            </b></p>
          {orderType ?
              (<p className='order-asset'>
                {this.intl.get('order-asset-otc')}:
                <span className='order-asset-value'>
                  {asset} {currency}
                </span>
                <span className='order-sell-all' onClick={sellAll.bind(this)}>
                  {this.intl.get('order-sell-all')}
                </span>
              </p>)
              : null}
          <div className={`order-price-input ${!orderType ? 'reverse' : ''}`}>
            <div className='order-price-items'>
              <Input
                  placeholder={this.intl.get('order-amount-input')}
                  className='order-otc-input'
                  onInput={currencyNumInput.bind(this)}
                  value={currencyNum}
              />
              <span>{currency}</span>
            </div>
            <img src={OTC_EXCHANGE_B} alt=""/>
            <div className='order-price-items'>
              <Input
                  placeholder={this.intl.get('order-price-input')}
                  className='order-otc-input'
                  onInput={digitalValueInput.bind(this)}
                  value={digitalValue}
              />
              <span>{digital}</span>
            </div>
          </div>
          {errorState ? (<p className='order-otc-error'>
            {this.errorMsg[errorState]}
          </p>) : null}
        </div>
    )
  }
}