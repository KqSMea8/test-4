import ExchangeViewBase from '@/components/ExchangeViewBase'
import React, {Component} from "react";
import {
  resolveLoginPath,
  resolveRegisterPath,
  goLoginPath,
  goRegisterPath
} from "@/config/UrlConfig"

const rangeItems = [{value: '0%'}, {value: '25%'}, {value: '50%'}, {value: '75%'}, {value: '100%'}];
export default class TradeDealExchange extends ExchangeViewBase {
  constructor(props) {
    super(props);
    this.state = {}
  }
  
  componentWillMount() {
  
  }
  
  componentDidMount() {
  
  }
  
  get priceValue() {
    return this.props.prices[this.props.PriceUnit === 'CNY' && 'priceCN' || (this.props.PriceUnit === 'USD' && 'priceEN' || 'price')] || 0
  }
  
  render() {
    let num = this.props.ControllerProps.dealType ? Number(this.props.sellNum) : Number(this.props.buyNum);
    let maxValue = this.props.ControllerProps.dealType ? (this.props.DealEntrustType ? this.props.marketSellMax : this.props.sellMax) : (this.props.DealEntrustType ? this.props.marketBuyMax : this.props.buyMax);
    return (
        <div className='trade-pro-deal-exchange'>
          <div className='trade-deal-asset'>
            <div className='deal-asset-wallet'>
              <em>{`${this.intl.get('deal-use')}`}</em>
              <div>
                <span>{Number(this.props.wallet).format({number: 'property'})} </span>
                <i>
                  {this.props.ControllerProps.dealType ? this.props.steadUnitN.toUpperCase() : this.props.steadUnitP.toUpperCase()}
                </i>
              </div>
            </div>
          </div>
          <div className='trader-deal-input'>
            <div className='deal-input-label'>{`${this.intl.get('price')}`}</div>
            <div className='deal-input-items'>
              <input type="text" value={this.props.DealEntrustType ? (this.intl.get('marketPrice')) : (this.props.ControllerProps.dealType ? this.props.avalue : this.props.bvalue)} name='price'
                     onChange={this.props.priceInput.bind(this, this.props.ControllerProps.dealType)} readOnly={this.props.DealEntrustType ? true : false}/>
              <div className='deal-input-unit'>
                {this.props.PriceUnit.toUpperCase() || this.props.Market.toUpperCase()}
              </div>
            </div>
          </div>
          <div className='trader-deal-input'>
            <div className='deal-input-label'>{`${this.intl.get('amount')}`}</div>
            <div className='deal-input-items'>
              <input type="text" value={this.props.ControllerProps.dealType ? this.props.sellNum : this.props.buyNum}
                     onChange={this.props.numInput.bind(this, this.props.ControllerProps.dealType, true)}/>
              <div className='deal-input-unit'>
                {this.props.NumUnit.toUpperCase()}
              </div>
            </div>
          </div>
          <div className='deal-number-range'>
            <input type="range" min='0' max={maxValue || 0} step={Number(maxValue.div(100)) || 0} className={`r-${this.props.ControllerProps.tradeType}`}
                   value={this.props.ControllerProps.dealType ? Number(this.props.sellNum) : Number(this.props.buyNum)}
                   onChange={this.props.numInput.bind(this, this.props.ControllerProps.dealType, false)} style={{
              backgroundSize: `${Number(this.props.sellNum) / maxValue} 100%`,
              zIndex: (window.navigator.userAgent.includes('Chrome') || window.navigator.userAgent.includes('Safari')) ? '80' : '999'
            }}/>
            <ul style={{
              backgroundSize: `${num ? num / (maxValue) * 279 : 0}px 100%`,
              height: (window.navigator.userAgent.includes('Chrome') || window.navigator.userAgent.includes('Safari')) ? '4px' : '0'
            }}>
              {rangeItems.map((v, index) => {
                return (
                    <li key={index} onClick={this.props.rangeItemsSelect.bind(this, this.props.ControllerProps.dealType, index)}
                        className={this.props.ControllerProps.dealType ? (index <= (this.props.sellPointer) ? 'sell-pointer' : '') : (index <= this.props.buyPointer ? 'buy-pointer' : '')}>
                    </li>
                )
              })}
            </ul>
          </div>
          <div className='deal-number-percent'>
            <ul>
              {rangeItems.map((v, index) => {
                return (
                    <li key={index}>
                      {v.value}
                    </li>
                )
              })}
            </ul>
          </div>
          <div className='trade-deal-turnover'>
            {this.props.DealEntrustType ? '' : <div className='trade-pro-marketD'><span>{`${this.intl.get('deal-trunover')}`}:</span>
              <span>
              <em>{this.props.ControllerProps.dealType ? Number(Number(this.props.sellNum).multi(this.props.avalue || 0)).format((this.props.PriceUnit === 'USD' || this.props.PriceUnit === 'CNY') ? {number: 'legal'} : {number: 'property'}) : Number(Number(this.props.buyNum).multi(this.props.bvalue || 0)).format((this.props.PriceUnit === 'USD' || this.props.PriceUnit === 'CNY') ? {number: 'legal'} : {number: 'property'})}</em>
            <i>{this.props.DealEntrustType === 0 && (this.props.PriceUnit.toUpperCase() || this.props.Market.toUpperCase())}</i>
            </span>
            </div>}
          </div>
          {this.props.isLogin ? (<div className={`trade-deal-button-${this.props.ControllerProps.tradeType}`} onClick={this.props.dealTrade.bind(this, this.props.ControllerProps.tradeType)}>
            {this.props.ControllerProps.dealType ? `${this.intl.get('sell')}` : `${this.intl.get('buy')}`}
            &nbsp;<em>{this.props.NumUnit.toUpperCase()}</em>
          </div>) : (
              <div className='trade-deal-none-login'>
                <span>{this.intl.get('deal-before')} </span>
                <a href={resolveLoginPath()}>
                  {this.intl.get('login')}
                </a>
                <em>{this.intl.get('or')} </em>
                <a href={resolveRegisterPath()}>
                  {this.intl.get('register')}
                </a>
              </div>
          )}
        </div>
    )
  }
}