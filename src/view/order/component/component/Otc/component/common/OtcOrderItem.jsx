import React, {Component} from "react";
import ExchangeViewBase from "@/components/ExchangeViewBase";
import PropTypes from "prop-types"
import PayWay from "@/common/component/PayWay/index.jsx"
import Button from "@/common/baseComponent/Button/index"
import {
  OTC_EXCHANGE_B,
} from '@/config/ImageConfig'

export default class OtcOrderItem extends ExchangeViewBase {
  static defaultProps = {
    orderType: 0,
    confirmType: 0,
    orderItems: {
      floatPriceH: 20000,
      floatPriceL: 2000,
      exchangeLimitH: 20001,
      exchangeLimitL: 2000,
      payWayStatus: 7,
      payLimit: '10分钟',
      exchangeAmount: 0.0017,
      exchangeValue: 1000,
      price: 40000,
      status: 0
    },
    digital: 'CNY',
    currency: 'BTC',
    currencyNum: 0.2,
    digitalValue: 4000,
    submitFlag: false,
  };
  static propTypes = {
    confirmType: PropTypes.number.isRequired,
    orderItems: PropTypes.object.isRequired,
  };

  constructor() {
    super();
    this.state = {
      radioStatus: false
    };
    this.tableHead = [
      [this.intl.get('order-price-sf'), this.intl.get('order-exchange-limit'), this.intl.get('order-exchange-pay'), this.intl.get('order-pay-limit')],
      [this.intl.get('order-exchange-amount'), this.intl.get('order-exchange-price'), this.intl.get('order-price-s'), this.intl.get('order-exchange-pay'), this.intl.get('state')]
    ];
    this.orderStatus = {
      1: this.intl.get('fund-order-already'),
      2: this.intl.get('fund-order-already'),
      3: this.intl.get('fund-order-already'),
      4: this.intl.get('fund-order-already'),
      5: this.intl.get('fund-order-already'),
    };
    this.submitText = [this.intl.get('otc-order-rb'), this.intl.get('otc-order-rs')]
  }

  changeRadioStatus() {
    this.setState(
      {
        radioStatus: !this.state.radioStatus
      }
    )
  }

  render() {
    const {
      confirmType,
      orderItems,
      digital,
      currency,
      currencyNum,
      digitalValue,
      orderType,
      submitFlag,
      otcOrderConfirm,
        dbFlag
    } = this.props;
    if (orderItems.mode === 1) {
      this.tableHead[0][0] = this.intl.get('order-price-s')
    }
    return (
      <div className='otc-order-item'>
        <table>
          <thead>
          <tr>
            {this.tableHead[confirmType].map((v, index) => (
              <td key={index}>
                {v}
              </td>
            ))}
          </tr>
          </thead>
          <tbody>
          {confirmType ?
            (<tr>
                <td>
                  {`${Number(orderItems.amountc).maxHandle(6)} ${currency}`}
                </td>
                <td>
                  {`${Number(orderItems.amountm).maxHandle(2)} ${digital}`}
                </td>
                <td>
                  {`${Number(orderItems.price).maxHandle(2)} ${digital}`}
                </td>
                <td>
                  <PayWay payWayStatus={orderItems.payment}/>
                </td>
                <td>
                  {this.orderStatus[orderItems.state]}
                </td>
              </tr>
            ) :
            (<tr>
              <td>
                {`${Number(orderItems.price).maxHandle(2)} ${digital}`}
              </td>
              <td>
                {`${Number(orderItems.min).maxHandle(2)}-${Number(orderItems.max).maxHandle(2)} ${digital}`}
              </td>
              <td>
                <PayWay payWayStatus={orderItems.payments}/>
              </td>
              <td>
                {orderItems.limit}{this.intl.get('order-minute')}
              </td>
            </tr>)
          }
          </tbody>
        </table>
        <div className='otc-order-confirm clearfix'>
          <div className={`otc-order-value ${!orderType ? 'order-confirm-reverse' : ''}`}>
            <div>{confirmType ? <span>{this.intl.get('order-exchange')}</span> : null}
              <span
                className='exchange-value'>{confirmType ? Number(orderItems.amountc).maxHandle(6) : Number(currencyNum).maxHandle(6)}<em>{currency}</em></span>
            </div>
            <img src={OTC_EXCHANGE_B} alt=""/>
            <div>
              {confirmType ? <span>{this.intl.get('order-total')}</span> : null}
              <span
                className='exchange-value'>{confirmType ? Number(orderItems.amountm).maxHandle(2) : Number(digitalValue).maxHandle(2)}<em>{digital}</em></span>
            </div>

          </div>
          {
            confirmType ? null :
              (<div>
                <p>
                  <em className={this.state.radioStatus ? 'radio-select' : ''}
                      onClick={this.changeRadioStatus.bind(this)}
                  ></em>
                  {this.intl.get('order-confirm-ensure')}</p>
                <Button
                  title={this.submitText[orderType]}
                  className={`otc-order-button ${(this.state.radioStatus && !submitFlag && !dbFlag) ? '' : 'button-disable'}`}
                  disable={!(this.state.radioStatus && !submitFlag && !dbFlag)}
                  onClick={otcOrderConfirm.bind(this)}
                />
              </div>)
          }
        </div>
      </div>
    )
  }
}