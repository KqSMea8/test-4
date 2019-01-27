import React, {Component} from 'react';
import ExchangeViewBase from "@/components/ExchangeViewBase";
import FundBody from './FundBody.jsx'

export default class FundProduct extends ExchangeViewBase {
  constructor(props) {
    super(props);
    this.common = {
      fundLimit: this.intl.get('tlb-productLimit'),
      tradeRule: this.intl.get('tlb-productRule'),
      fundIntro: this.intl.get('tlb-productIntro'),
      manager: this.intl.get('tlb-manager'),
      timeLine: [
        this.intl.get('tlb-productTimeBuy'),
        this.intl.get('tlb-productTimeCome'),
        this.intl.get('tlb-productTimeGet'),
        this.intl.get('tlb-productTimeTake')
      ],
      BTC: this.props.controller.configController.language === 'en-US' ? "bitcoin" : "比特币",
      USD: "USD",
      CNY: "CNY",
      USDT: "USDT"
    }
  }

  render() {
    let coinCN = this.common[this.props.fund],
        language = this.props.controller.configController.language;
    return (
      <div className='fund-detail-product'>
        <FundBody>
          <FundBody.title content={this.common.fundLimit}/>
          <div className='product-intro'>
            <hr className={`${language === 'en-US' ? 'en-hr' : ''} product-intro-hr`}/>
            <ul className={language === 'en-US' ? 'en-ul' : ''}>
              {this.common.timeLine.map((v, index) => {
                if (index === 1) {
                  return <li key={index}><span>{language === 'en-US' ? this.props.profitTime.toDate('yyyy-MM-dd') : this.props.profitTime.toDate('MM-dd').replace('-', this.intl.get('month')) + this.intl.get('Su')}</span><span>{v}</span></li>
                }
                if (index === 2) {
                  return <li key={index}><span>{language === 'en-US' ? this.props.redeemTime.toDate('yyyy-MM-dd') : this.props.redeemTime.toDate('MM-dd').replace('-', this.intl.get('month')) + this.intl.get('Su')}</span><span>{v}</span></li>
                }
                return <li key={index}>{v}</li>
              })}
            </ul>
          </div>
        </FundBody>
        <FundBody>
          <FundBody.title content={this.common.tradeRule}/>
          <table>
            <tbody>
            <tr>
              <td>{this.intl.get('tlb-productBuy')}</td>
              <td>{this.intl.get('tlb-productBuyLive')}</td>
            </tr>
            <tr>
              <td>{this.intl.get('tlb-productProfit')}</td>
              <td>{this.intl.get('tlb-productProfitTime', {
                start: language === 'en-US' ? this.props.profitTime.toDate('yyyy-MM-dd') : this.props.profitTime.toDate('MM-dd').replace('-', this.intl.get('month')) + this.intl.get('Su'),
                get: language === 'en-US' ? this.props.redeemTime.toDate('yyyy-MM-dd') : this.props.redeemTime.toDate('MM-dd').replace('-', this.intl.get('month')) + this.intl.get('Su')
              })}</td>
            </tr>
            <tr>
              <td>{this.intl.get('tlb-productTake')}</td>
              <td>{this.intl.get('tlb-productTakeLive')}</td>
            </tr>
            </tbody>
          </table>
        </FundBody>
        <FundBody>
          <FundBody.title content={this.common.fundIntro}/>
          <div className='fund-product-intro'>
            <ul>
              <li>{this.intl.get('tlb-productPolicy', {coinCN})}</li>
              <li>{this.intl.get('tlb-productManager', {manager: this.props.manager})}</li>
              <li>{this.intl.get('tlb-productStatus')}</li>
              <li>{this.intl.get('tlb-productType')}</li>
              <li>{this.intl.get('tlb-productTarget', {name: this.props.fund})}</li>
              <li>{this.intl.get('tlb-productProfitRule')}</li>
            </ul>
          </div>
        </FundBody>
        <FundBody>
          <FundBody.title content={this.common.manager}/>
          <div className='fund-manager-intro'>
            <p>{this.intl.get('tlb-productIntro1')}</p>
            <p>{this.intl.get('tlb-productIntro2')}</p>
          </div>
        </FundBody>
      </div>
    )
  }
}