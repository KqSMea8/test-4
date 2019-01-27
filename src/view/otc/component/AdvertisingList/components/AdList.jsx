import React, { Component } from "react";
import ExchangeViewBase from "@/components/ExchangeViewBase.jsx"
import PropTypes from "prop-types"
import PayWay from "@/common/component/PayWay/index.jsx"
import Button from "@/common/baseComponent/Button/index.jsx"
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Redirect,
  Switch
} from "react-router-dom";
import {resolveOrderPath, goOrderPath, resolveOtcPath, formatQueryToPath} from "@/config/UrlConfig"


export default class AdList extends ExchangeViewBase{
  static defaultProps = {
    digital: 'CNY'
    // adList: [
    //   {
    //     imgUrl: '',
    //     name: '人性的光辉',
    //     exchangeNumber: 439,
    //     favorRate: 0.99,
    //     number: 1.0372,
    //     lowValue: 2000,
    //     highValue: 20001,
    //     price: 44890,
    //     payWay:4,
    //     currency: 'BTC',
    //     digital: 'CNY'
    //   },
    //   {
    //     imgUrl: '',
    //     name: '人性的光辉',
    //     exchangeNumber: 439,
    //     favorRate: 0.99,
    //     number: 1.0372,
    //     lowValue: 2000,
    //     highValue: 20001,
    //     price: 44890,
    //     payWay:7,
    //     currency: 'BTC',
    //     digital: 'CNY'
    //   }
    // ],
  };
  static propTypes = {
    // adList: PropTypes.object.isRequired,
    adCurrencyActiveType: PropTypes.string.isRequired,
  };
  constructor(){
    super();
    this.tableHeader = [
    `${this.intl.get('otc-bussiness')}(${this.intl.get('otc-exchange-number')}/${this.intl.get('otc-favor-rate')})`,
        this.intl.get('amount'),
        this.intl.get('otc-limit'),
        this.intl.get('otc-price'),
        this.intl.get('otc-pay'),
        this.intl.get('option'),
    ];
    this.adType = {
      buy: this.intl.get('otc-buy'),
      sell: this.intl.get('otc-sell')
    }
  }
  render(){
    const {
      adList,
      adCurrencyActiveType,
      digital,
      enterConfirm
    } = this.props;
    return(
        <div className='ad-list-table' style={{
          minHeight: `${window.innerHeight - 2.1 * 100 - 105 - 40 -58}px`,
        }}>
          {adList.sales ? (
              <table>
                <thead>
                <tr>
                  {this.tableHeader.map((v, index) =>
                      (
                          <td key={index}>
                            {v}
                          </td>
                      )
                  )}
                </tr>
                </thead>
                <tbody>
                {adList.sales && adList.sales.map((v, index) => (
                    <tr key={index} className={Number(v.tradeable.multi(v.price) < v.min) ? 'ad-list-tr-none' : ''}>
                      <td><NavLink to={formatQueryToPath('/bussiness', {trader: v.sid})}>{v.trader} ({v.trade || 0} | {v.trade ? Number(v.rate / v.trade).toPercent(false) : '100%'})</NavLink></td>
                      <td>{Number(v.tradeable).maxHandle(6)} {v.currency.toUpperCase()}</td>
                      <td>{v.min}-{v.max} {digital}</td>
                      <td>{Number(v.price).maxHandle(2)} {digital}</td>
                      <td>
                        <PayWay payWayStatus={v.payments}/>
                      </td>
                      <td>
                        <Button
                            title={`${this.adType[adCurrencyActiveType]}${v.currency.toUpperCase()}`}
                            onClick={enterConfirm.bind(this, v)}
                        />
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
          ) : (
              <div className={'ad-list-none'}>
                {this.intl.get('noDate')}
              </div>
          )}
        
        </div>
    )
  }
}