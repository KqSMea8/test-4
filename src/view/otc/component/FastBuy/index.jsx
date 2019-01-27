import React, {Component} from 'react'
import ExchangeViewBase from "@/components/ExchangeViewBase.jsx"
import Input from "@/common/baseComponent/Input/index.jsx"
import SelectButton from "@/common/baseComponent/SelectButton/index.jsx"
import Button from "@/common/baseComponent/Button/index.jsx"
import './stylus/index.styl'
import {goOrderPath} from "@/config/UrlConfig";
import {OTC_PAY_ALIPAY_B, OTC_PAY_WECHAT_B, OTC_PAY_BANK_B, OTC_EXCHANGE_W} from '@/config/ImageConfig';

export default class FastBuy extends ExchangeViewBase {
  constructor() {
    super();
    this.state = {
      price: 6.68,
      currency: 'USDT',
      currencyArr: ['USDT', 'BTC', 'BCH'],
      digital: 'CNY',
      digitalArr: ['CNY', 'USD'],
      inputPrice: '',
      inputAmount: '',
      alCheck: true,
      wechatCheck: true,
      bankCheck: true,
      inputFlag: true,
      limitFlag: false
    };
    this.payItems = [
      {
        name: this.intl.get('otc-pay-al'),
        src: OTC_PAY_ALIPAY_B,
        status: 'alCheck'
      },
      {
        name: this.intl.get('otc-pay-wechat'),
        src: OTC_PAY_WECHAT_B,
        status: 'wechatCheck'
      },
      {
        name: this.intl.get('otc-pay-bank'),
        src: OTC_PAY_BANK_B,
        status: 'bankCheck'
      },
    ];
    this.payments = 7;
    this.payWay = {
      alCheck: 1,
      wechatCheck: 2,
      bankCheck: 4
    }
  }

  async componentDidMount() {
    let currencyArray = await this.props.controller.canDealCoins();
    let currency = currencyArray[0];
    let currencyArr = currencyArray.map(v => v.toUpperCase());
    await this.props.controller.getPriceList();
    let priceList = this.props.controller.store.state.priceList;
    this.setState({
      currency,
      currencyArr,
      price: Number(priceList[currency].cny).maxHandle(2)
    })
  }

  payItemsSelect(v) {
    const payKey = v.status;
    if (this.state[payKey]) {
      this.payments = this.payments - this.payWay[payKey]
    }
    else {
      this.payments = this.payments + this.payWay[payKey]
    }
    this.setState(
      {
        [payKey]: !this.state[payKey]
      }
    )
  }

  currencyChange(value) {
    let priceList = this.props.controller.store.state.priceList;
    let currency = value.toLowerCase();
    this.setState({
      currency: value,
      price: Number(priceList[currency].cny).maxHandle(2),
      inputAmount: '',
      inputPrice: '',
      inputFlag: true,
      limitFlag: false
    })
  }

  digInput(e) {
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
    let currencyNum = (value <= 10000 && value > 0) ? Number(Number(value).div(price)).maxHandle(6) : '';
    let limitFlag = (value <= 10000 && value > 0) ? true : false;
    this.setState(
      {
        inputAmount: currencyNum,
        inputPrice: value,
        limitFlag,
        inputFlag: value ? limitFlag : true
      }
    )
  }

  curInput(e) {
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
    let digitalValue = Number(price.multi(value || 0)).maxHandle(2);
    let limitFlag = (digitalValue <= 10000 && digitalValue > 0) ? true : false;
    this.setState(
      {
        inputAmount: value,
        inputPrice: digitalValue,
        limitFlag,
        inputFlag: digitalValue ? limitFlag : true
      }
    )
  }

  async quickBuy() {
    let currency,
      payment,
      amountmc,
      userToken = this.props.controller.userController.userToken;
    currency = this.state.currency.toLowerCase();
    payment = this.payments;
    amountmc = Number(this.state.inputPrice);
    if (!userToken) {
      this.props.controller.popupController.setState({
        isShow: true,
        type: 'tip3',
        msg: this.intl.get('otc-login-tip'),
        autoClose: true
      });
      return
    }
    if (payment === 0) {
      this.props.controller.popupController.setState({
        isShow: true,
        type: 'tip3',
        msg: this.intl.get('otc-fast-buy-select'),
      });
      return
    }
    let result = await this.props.controller.quickBuy(currency, payment, amountmc);
    if (!result) {
      this.props.controller.popupController.setState({
        isShow: true,
        type: 'tip3',
        msg: this.intl.get('otc-fast-buy-no'),
      });
      return
    }
    goOrderPath('/otc/confirm', {id: result[0].id, trader: result[0].sid})
  }

  render() {
    const height = window.innerHeight - 210;
    return (
      <div className='otc-fast-buy'
           style={{height: `${height < 600 ? 600 : height}px`}}>
        <div className='otc-fast-title'>
          {this.intl.get('otc-fast-title')}
        </div>
        <p className='otc-fast-price'>
          <span>{this.intl.get('otc-fast-price')}:</span>
          <span>{this.state.price}</span>
          <span>{this.state.digital.toUpperCase()}</span> /
          <span>{this.state.currency.toUpperCase()}</span>
        </p>
        <div className='otc-fast-filter'>
          <Input
            placeholder={this.intl.get('otc-fast-input-price')}
            className='fast-buy-input'
            onInput={this.digInput.bind(this)}
            value={this.state.inputPrice}
          />
          <div className={"fast-buy-select fast-buy-dig"}>
            {this.state.digital.toUpperCase()}
          </div>
          {/*<SelectButton*/}
          {/*title={this.state.digital}*/}
          {/*type="main"*/}
          {/*className="fast-buy-select"*/}
          {/*// onSelect={paySelect.bind(this)}*/}
          {/*valueArr={this.state.digitalArr}*/}
          {/*/>*/}
          <img src={OTC_EXCHANGE_W} alt=""/>
          <Input
            placeholder={this.intl.get('otc-fast-input-amount')}
            className='fast-buy-input'
            onInput={this.curInput.bind(this)}
            value={this.state.inputAmount}
          />
          <SelectButton
            title={this.state.currency.toUpperCase()}
            type="main"
            className="fast-buy-select"
            onSelect={this.currencyChange.bind(this)}
            valueArr={this.state.currencyArr}
          />
          <Button
            title={this.intl.get('otc-fast-buy')}
            className='fast-buy-submit'
            disable={!this.state.limitFlag}
            onClick={this.quickBuy.bind(this)}
          />
        </div>
        {this.state.inputFlag ? null : <h3>{this.intl.get('otc-fast-buy-more')}</h3>}
        <div className='otc-fast-pay'>
          <p className='otc-pay-title'>{this.intl.get('otc-fast-pay-title')}</p>
          <div className='otc-pay-way'>
            {this.payItems.map((v, index) =>
              (
                <div className='otc-pay-item' key={index} onClick={this.payItemsSelect.bind(this, v)}>
                  <em className={this.state[v.status] ? 'otc-pay-check' : ''}></em>
                  <img src={v.src} alt=""/>
                  <span>{v.name}</span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    )
  }
}