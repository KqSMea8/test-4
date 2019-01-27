import ExchangeViewBase from '@/components/ExchangeViewBase'
import React, {Component} from "react";
import {resolveHelpPath} from '@/config/UrlConfig'

export default class TradePairDeal extends ExchangeViewBase {
  constructor(props) {
    super(props);
    this.state = {
      tradePairMsg: {}
    }
    const {controller} = this.props;
    //绑定view
    controller.setView(this);
    //初始化数据，数据来源即store里面的state
    this.state = Object.assign(this.state, controller.initState);
    this.revealMark = this.revealMark.bind(this)
  }
  
  
  revealMark(e) { // 显示市场弹窗
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    this.props.onMarketChange()
  }
  
  componentWillMount() {
  
  }
  
  componentDidMount() {
  
  }
  
  render() {
    return (
        <div style={{overflow: 'hidden'}} id='trade_pro_pair'>
          <div className='trade-pair-deal-title'>
            <div className='trade-pair-deal-info'>
              <b onClick={e => this.revealMark(e)}
                 className={this.props.status ? 'market-b' : ''}>{`${this.state.tradePairMsg.tradePair && this.state.tradePairMsg.tradePair.toUpperCase() || '--'}`}</b>
              <a href={resolveHelpPath('/currency', {currency: this.state.tradePairMsg.coinName})} target='_blank'>
                {this.intl.get('market-currencyInfo')}
              </a>
            </div>
            <div className='trade-pair-deal-items trade-pro-price'>
              <span
                  className={`${this.state.tradePairMsg.updown && (this.state.tradePairMsg.updown > 0 && "market-up" || "market-down")} trade-pair-deal-price`}>{this.state.tradePairMsg.prices && Number(this.state.tradePairMsg.prices.price).format({
                number: 'digital',
                style: {decimalLength: this.state.tradePairMsg.priceAccuracy}
              })}</span>
              ≈
              <span>{this.state.tradePairMsg.prices && (this.props.controller.configController.language === 'zh-CN' ? (Number(this.state.tradePairMsg.prices.priceCN * this.state.tradePairMsg.prices.price).format({
                number: 'legal',
                style: {name: 'cny'}
              })) : (Number(this.state.tradePairMsg.prices.priceEN * this.state.tradePairMsg.prices.price).format({number: 'legal', style: {name: 'usd'}})))}</span>
            </div>
            <div className='trade-pair-deal-items'>
              <p>{this.intl.get('deal-trade-rise')}</p>
              <span className={`${ (this.state.tradePairMsg.rise >= 0 && "market-up" || "market-down")}`}>
              {Number(this.state.tradePairMsg.rise || 0).toPercent()}
            </span>
            </div>
            <div className='trade-pair-deal-items'>
              <p>{this.intl.get('deal-trade-high')}</p>
              <span>
              {this.state.tradePairMsg.highestPrice && this.state.tradePairMsg.highestPrice.format({number: 'digital', style: {decimalLength: this.state.tradePairMsg.priceAccuracy}}) || '--'}
            </span>
            </div>
            <div className='trade-pair-deal-items'>
              <p>{this.intl.get('deal-trade-low')}</p>
              <span>
              {this.state.tradePairMsg.lowestPrice && this.state.tradePairMsg.lowestPrice.format({number: 'digital', style: {decimalLength: this.state.tradePairMsg.priceAccuracy}}) || '--'}
            </span>
            </div>
            <div className='trade-pair-deal-items'>
              <p>{this.intl.get('deal-trade-turnover')}</p>
              <span>{this.state.tradePairMsg.turnover && Number(this.state.tradePairMsg.turnover).formatTurnover() || '--'}</span>
              <span>{this.state.tradePairMsg.turnover && this.state.tradePairMsg.marketName || null}</span>
            </div>
          </div>
        </div>
    )
  }
}