import ExchangeViewBase from '@/components/ExchangeViewBase'
import React, {Component} from "react";
import SelectButton from "@/common/baseComponent/SelectButton/index";
import {
  TRADE_PRO_ALL,
  TRADE_PRO_ALL_SELECT,
  TRADE_PRO_BUY,
  TRADE_PRO_BUY_SELECT,
  TRADE_PRO_SELL,
  TRADE_PRO_SELL_SELECT
} from '@/config/ImageConfig'
// import '../stylus/tradeLive.styl'

export default class LiveTrade extends ExchangeViewBase {
  constructor(props) {
    super(props);
    this.state = {
      depthArray: [], // 深度数组
      depthSelected: '', // 深度下拉选中
      userTagArr: [], //用户挂单数组
      sellMid: 0, //中位数
      buyMid: 0, //中位数
      changeFlag: true, //数据变动开关
      titleSelect: 'all', // tab选中
      newPrice: 0,
      prices: {}, // 实时变动汇率
      unitsType: '', // 计价方式选中
      language: props.controller.configController.language === 'en-US' ? 0 : 1,
      // tab切换数组选项
      tradeLiveItem: [{
        name: this.intl.get('trade-bs'),
        type: 'all',
        img: TRADE_PRO_ALL,
        imgSelect: TRADE_PRO_ALL_SELECT
      },
        {
          name: this.intl.get('buy'),
          type: 'buy',
          img: TRADE_PRO_BUY,
          imgSelect: TRADE_PRO_BUY_SELECT
        },
        {
          name: this.intl.get('sell'),
          type: 'sell',
          img: TRADE_PRO_SELL,
          imgSelect: TRADE_PRO_SELL_SELECT
        }]
    };
    const {controller} = this.props;
    //绑定view
    controller.setView(this);
    //初始化数据，数据来源即store里面的state
    this.state = Object.assign(this.state, controller.initState);
    this.liveTradeListHandle = controller.liveTradeListHandle.bind(controller);
    this.orderListSelect = controller.orderListSelect.bind(controller);
    // this.getNewPrice = controller.getNewPrice.bind(controller)
    this.clearRoom = controller.clearRoom.bind(controller);
    this.changeLiveTitleSelect = controller.changeLiveTitleSelect.bind(controller);
    this.depthSelect = controller.depthSelect.bind(controller)
  }
  
  componentWillMount() {
  
  }
  
  componentDidMount() {
  }
  
  componentDidUpdate() {
    if (this.state.titleSelect === 'sell' && this.refs['trade-pro-sell-show'].clientHeight - this.refs['trade-pro-sell'].clientHeight > 0) {
      this.refs['trade-pro-sell-show'].style.cssText = `position:'relative';bottom:${(this.refs['trade-pro-sell-show'].clientHeight - this.refs['trade-pro-sell'].clientHeight) + 'px'} `
      return
    }
    this.refs['trade-pro-sell-show'].style.cssText = ''
  }
  
  componentWillUnmount() {
    this.clearRoom()
  }
  
  render() {
    return (
        <div className='live-trade-pro'>
          <div className='trade-live-title'>
            <div className='trade-live-title-items'>
              {this.state.tradeLiveItem.map((v, index) => {
                return (
                    <div className={`trade-pro-items-${this.state.titleSelect === v.type ? 'active' : ''} trade-pro-items`}
                         key={index} onClick={this.changeLiveTitleSelect.bind(this, v)}>
                      <img src={this.state.titleSelect === v.type ? v.imgSelect : v.img} alt=""/>
                    </div>
                )
              })}
            </div>
            <div className='trade-depth'>
              <span>{this.intl.get('trade-depth')}</span>
              <SelectButton
                  title={`${this.state.depthSelected}`}
                  type="tradePro"
                  className="select-depth"
                  valueArr={this.state.depthArray}
                  onSelect={this.depthSelect.bind(this)}/>
            </div>
          </div>
          <div className='trade-pro-table' id='trade-pro-table'>
            <div className='trade-pro-thead'>
              <span>{`${this.intl.get('price')}(${(this.state.unitsType && this.state.unitsType.toUpperCase()) || (this.state.market && this.state.market.toUpperCase())})`}</span>
              <span>{`${this.intl.get('amount')}(${(this.state.coin && this.state.coin.toUpperCase())})`}</span>
              <span>{`${this.intl.get('total')}(${(this.state.unitsType && this.state.unitsType.toUpperCase()) || (this.state.market && this.state.market.toUpperCase())})`}</span>
            </div>
            <div ref="trade-pro-sell"
                 className={`trade-pro-sell ${this.state.titleSelect === 'buy' ? 'live-pro-none' : ''} ${this.state.titleSelect === 'sell' ? 'live-pro-posi-none' : ''}`}
                 style={{'maxHeight': document.querySelector('#trade-pro-table') && (document.querySelector('#trade-pro-table').clientHeight - 61 + 'px')}}>
              <div className='trade-pro-sell-show' ref='trade-pro-sell-show'>
                {this.state.liveSellArray && this.state.liveSellArray.map((v, index) =>
                    (
                        <div key={index} onClick={this.orderListSelect.bind(this, v)} style={{cursor: 'pointer'}}
                             className='trade-pro-tbody-items'>
                          <div
                              style={{width: v.amount >= this.state.sellMid ? '299px' : `${299 * v.amount / this.state.sellMid}px`}}
                              className={`trade-pro-live-bg-sell`}>
                            <p className={`${this.state.userTagArr.indexOf(v.price) === -1 ? 'user-none' : 'user-arrow-sell'}`}></p>
                          </div>
                          <ul className="clearfix">
                            <li className="pop-parent">
                              <span className='trade-pro-sell-price'>{v.priceR}</span>
                              {v.priceR.length >= 11 && <em className="pop-trade-children rightpop-trade-children">{v.priceR}</em>}
                            </li>
                            <li>
                              <span>{v.amountR}</span>
                            </li>
                            <li>
                              <span>{v.turnover}</span>
                            </li>
                          </ul>
                        </div>
                    )
                ) || null}
              </div>
            </div>
            <div
                className={`trade-pro-live-deal ${this.state.updown && (this.state.updown > 0 && "market-pro-up" || "market-pro-down")}`}>
              {this.state.dealPrice ? this.state.dealPrice : '-'}&nbsp;{this.state.dealPrice ? (this.state.updown > 0 ? '↑' : (this.state.updown < 0 ? '↓' : '')) : ''}
              {!['usd', 'cny'].includes(this.state.unitsType.toLowerCase()) &&
              <span>&nbsp;{this.state.language ? '¥' : '$'}&nbsp;{this.state.dealPrice ? Number(this.state.dealPrice * (this.state.language ? this.state.prices.priceCN : this.state.prices.priceEN)).format({
                number: 'legal',
                style: {name: this.state.unitsType && this.state.unitsType.toLowerCase()}
              }) : ''}</span>}
            </div>
            <div className={`trade-pro-sell ${this.state.titleSelect === 'sell' ? 'live-pro-none' : ''}`}>
              <div className='trade-pro-buy-show'>
                {this.state.liveBuyArray && this.state.liveBuyArray.map((v, index) =>
                    (
                        <div key={index} onClick={this.orderListSelect.bind(this, v)} style={{cursor: 'pointer'}}
                             className='trade-pro-tbody-items'>
                          <div
                              style={{width: v.amount >= this.state.buyMid ? '299px' : `${299 * v.amount / this.state.buyMid}px`}}
                              className={`trade-pro-live-bg-buy`}>
                            <p
                                className={`${this.state.userTagArr.indexOf(v.price) === -1 ? 'user-none' : 'user-arrow-buy'}`}></p>
                          </div>
                          <ul className="clearfix">
                            <li className="pop-parent">
                              <span className='trade-pro-buy-price'>{v.priceR}</span>
                              {v.priceR.length >= 11 && <em className="pop-trade-children rightpop-trade-children">{v.priceR}</em>}
                            </li>
                            <li>
                              <span>{v.amountR}</span>
                            </li>
                            <li>
                              <span>{v.turnover}</span>
                            </li>
                          </ul>
                        </div>
                    )
                ) || null}
              </div>
            </div>
          </div>
        </div>
    )
  }
}