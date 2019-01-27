import React, {Component} from 'react'
import ExchangeViewBase from "@/components/ExchangeViewBase.jsx"
import PayWay from "@/common/component/PayWay/index.jsx"
import Button from "@/common/baseComponent/Button/index.jsx"
import {resolveOrderPath} from '@/config/UrlConfig'
import PropTypes from "prop-types";

export default class Bussiness extends ExchangeViewBase {
  static defaultProps = {
    adType: 'buy',
  };
  static propTypes = {
    adType: PropTypes.string.isRequired,
    adList: PropTypes.array.isRequired,
    changeAdType: PropTypes.func.isRequired
  };
  
  constructor() {
    super();
    this.adType = [
      {name: this.intl.get('otc-bussiness-buy'), type: 'buy'},
      {name: this.intl.get('otc-bussiness-sell'), type: 'sell'},
    ];
    this.tableHeader = [
      this.intl.get('otc-currency'),
      this.intl.get('amount'),
      this.intl.get('otc-limit'),
      this.intl.get('otc-price'),
      this.intl.get('otc-pay'),
      this.intl.get('option'),
    ];
  }
  render() {
    const {
      adType,
      adList,
      changeAdType,
      enterConfirm
    } = this.props;
    return (
        <div className='bussiness-ad'>
          <div className='bussiness-ad-type'>
            {
              this.adType.map((v, index) => (
                  <div
                      className={`ad-type-items ${adType === v.type ? 'ad-type-select' : ''}`}
                      key={index}
                      onClick={changeAdType.bind(this, v.type)}
                  >
                    {v.name}
                  </div>
              ))
            }
          </div>
          <table>
            <thead>
            <tr>
              {this.tableHeader.map((v, index) => (
                  <td key={index}>
                    {v}
                  </td>
              ))}
            </tr>
            </thead>
            <tbody>
            {adList.map((v, index) => (
                <tr key={index}>
                  <td>
                    <img src={v.icon} alt=""/>
                    <span>{v.currency.toUpperCase()}</span>
                  </td>
                  <td>
                    {v.tradeable}
                  </td>
                  <td>
                    {v.min}~{v.max} {v.money.toUpperCase()}
                  </td>
                  <td>
                    {v.price} {v.money.toUpperCase()}
                  </td>
                  <td>
                    <PayWay payWayStatus={v.payments}/>
                  </td>
                  <td>
                    <Button
                        title={`${adType === 'buy' ? this.intl.get('otc-buy') : this.intl.get('otc-sell')}${v.currency}`}
                        onClick={() => {enterConfirm(v)}}
                    />
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
    )
  }
}