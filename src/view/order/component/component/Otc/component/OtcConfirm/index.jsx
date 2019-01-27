import React, {Component} from "react";
import ExchangeViewBase from "@/components/ExchangeViewBase";
import ExchangeInfo from '../common/ExchangeInfo'
import Faq from '../common/Faq'
import OtcOrderPrice from './component/OtcOrderPrice'
import OtcOrderTitle from '../../../common/OtcOrderTitle'
import OtcOrderItem from '../common/OtcOrderItem'
import SafePass from '@/common/component/SafePass/index'
import {getQueryFromPath, goOrderPath, formatQueryToPath} from '@/config/UrlConfig'
import './stylus/index.styl'
import PropTypes from "prop-types";

export default class OrderConfirm extends ExchangeViewBase {
  constructor() {
    super();
    this.state = {
      errText: '',
      safePassFlag: false,
      asset: 0,
      orderType: 1,
      currencyNum: '',
      digitalValue: '',
      errorState: 0,
      price: 4000,
      bussinessInfo: {
        name: '梅林的胡子',
        exchangeNumber: 432,
        rate: 0.99,
        fee: 0
      },
      orderItems: {},
      currency: '',
      dbFlag: false
    };
    this.type = {
      buy: 0,
      sell: 1,
    };
    // this.dbFlag = false;
    this.orderType = [this.intl.get('order-otc-buy'), this.intl.get('order-otc-sell')];
    this.currencyNumInput = this.currencyNumInput.bind(this);
    this.digitalValueInput = this.digitalValueInput.bind(this);
    this.sellAll = this.sellAll.bind(this);
  }
  
  async componentDidMount() {
    let trader = JSON.parse(getQueryFromPath('trader'));
    // let type = getQueryFromPath('type');
    let id = JSON.parse(getQueryFromPath('id'));
    let asset;
    this.props.controller.otcController.changeKey('trader', trader);
    let bussinessInfo = await this.props.controller.otcController.traderInfo();
    let orderItems = await this.props.controller.otcSaleDetail(id);
    // console.log('bussinessInfo', bussinessInfo,'orderItems', orderItems, 2 - orderItems.type)
    if (orderItems.type === 2) {
      asset = await this.props.controller.assetController.getOtcCurrencyAmount(orderItems.currency.toUpperCase() || '');
    }
    this.setState({
      orderType: orderItems.type - 1,
      bussinessInfo,
      price: Number(orderItems.price).maxHandle(2),
      orderItems,
      mode: orderItems.mode,
      asset: asset ? asset.currencyAmount.availableCount : null,
      currency: orderItems.currency.toUpperCase()
    });
  }
  
  currencyNumInput(e) {
    const price = this.state.price;
    let value = e;
    let limitNum = value.split('.');
    if (limitNum.length > 2)
      return;
    if (value === '.')
      return;
    limitNum[1] = limitNum[1] || '';
    if (!((/^[0-9]*$/).test(limitNum[0]) && (/^[0-9]*$/).test(limitNum[1])))
      return;
    if (limitNum[1].length > 6)
      return;
    if (value > this.state.asset && this.state.orderType === 1)
      return
    let digitalValue = Number(price.multi(value || 0)).maxHandle(2);
    this.setState(
        {
          currencyNum: value,
          digitalValue
        }
    )
    if (digitalValue < this.state.orderItems.min || digitalValue > this.state.orderItems.max) {
      this.setState({
        errorState: 1
      })
      return
    }
    this.setState({
      errorState: 0
    })
  }
  
  digitalValueInput(e) {
    const price = this.state.price;
    let value = e;
    let limitNum = value.split('.');
    if (limitNum.length > 2)
      return;
    if (value === '.')
      return;
    limitNum[1] = limitNum[1] || '';
    if (!((/^[0-9]*$/).test(limitNum[0]) && (/^[0-9]*$/).test(limitNum[1])))
      return;
    if (limitNum[1].length > 2)
      return;
    let currencyNum = Number(Number(value).div(price)).maxHandle(6);
    if (currencyNum > this.state.asset && this.state.orderType === 1)
      return
    this.setState(
        {
          currencyNum,
          digitalValue: value
        }
    )
    if (value < this.state.orderItems.min || value > this.state.orderItems.max) {
      this.setState({
        errorState: 1
      })
      return
    }
    this.setState({
      errorState: 0
    })
  }
  
  sellAll() {
    let currencyNum = this.state.asset;
    let price = this.state.price;
    let digitalValue = Number(price.multi(currencyNum || 0)).maxHandle(2);
    this.setState(
        {
          currencyNum,
          digitalValue
        }
    )
    if (digitalValue < this.state.orderItems.min || digitalValue > this.state.orderItems.max) {
      this.setState({
        errorState: 1
      })
      return
    }
    this.setState({
      errorState: 0
    })
  }
  
  async otcOrderConfirm() {
    if (this.state.orderType) {
      this.setState({safePassFlag: true})
      return
    }
    this.setState({
      dbFlag: true
    })
    this.otcNewOrder();
  }
  
  async otcNewOrder(funpass = '') {
    const orderItems = this.state.orderItems;
    let id = orderItems.id;
    let price = orderItems.price;
    let currency, money;
    money = Number(this.state.digitalValue);
    currency = Number(this.state.currencyNum);
    let result = await this.props.controller.otcNewOrder(id, price, currency, money, funpass, orderItems.type);
    this.setState({
      dbFlag: false
    })
    if (result.id === 0 || result.errCode) {
      this.props.controller.popupController.setState({
        isShow: true,
        type: 'tip2',
        msg: result.msg,
      })
      return
    }
    //todo 添加错误处理
    this.props.history.push(formatQueryToPath('/otc/content', {id: JSON.stringify(result.id)}))
  }
  
  async sellConfirm(funpass, func) {
    await this.otcNewOrder(funpass);
    func()
  }
  
  render() {
    return (
        <div className='order-otc-confirm'>
          <div className='otc-confirm-l'>
            <ExchangeInfo orderType={this.state.orderType}/>
          </div>
          <div className='otc-confirm-r'>
            <OtcOrderTitle content={this.orderType[this.state.orderType]}/>
            <OtcOrderPrice orderType={this.state.orderType}
                           currencyNumInput={this.currencyNumInput}
                           digitalValueInput={this.digitalValueInput}
                           currencyNum={this.state.currencyNum}
                           digitalValue={this.state.digitalValue}
                           price={this.state.price}
                           errorState={this.state.errorState}
                           asset={this.state.asset}
                           sellAll={this.sellAll}
                           currency={this.state.currency}
                           lang={this.props.controller.configController.language}
            />
            <div className='order-otc-bussiness'>
              <p>{this.state.bussinessInfo.name}</p>
              <p>{`${this.intl.get('order-exchange-number')}: ${this.state.bussinessInfo.trade}`}</p>
              <p>{`${this.intl.get('order-rate')}: ${this.state.bussinessInfo.trade ? (this.state.bussinessInfo.rate / this.state.bussinessInfo.trade).toPercent(false) : '100%'}`}</p>
            </div>
            <OtcOrderItem
                currencyNum={this.state.currencyNum || 0}
                digitalValue={this.state.digitalValue || 0}
                confirmType={0}
                orderType={this.state.orderType}
                orderItems={this.state.orderItems}
                submitFlag={this.state.errorState}
                otcOrderConfirm={this.otcOrderConfirm.bind(this)}
                currency={this.state.currency}
                payLimit={`10${this.intl.get('order-minute')}`}
                dbFlag={this.state.dbFlag}
                
            />
            <Faq type={this.state.orderType}/>
            {this.state.safePassFlag &&
            <SafePass
                onClose={() => {
                  this.setState({safePassFlag: false})
                }}
                onConfirm={this.sellConfirm.bind(this)}
                errText={this.state.errText}
            />}
          </div>
        </div>
    )
  }
}