import React from 'react';
import ExchangeViewBase from '@/components/ExchangeViewBase';

import Progress from '@/common/component/Progress/index.jsx'

import {
  formatQueryToPath,
  goAssetPath,
} from "@/config/UrlConfig"

import {
  TLB_BG_BTC,
  TLB_BG_CNY,
  TLB_BG_USD
} from '@/config/ImageConfig';

export default class FundContent extends ExchangeViewBase {
  constructor(props) {
    super(props);
    this.riskLevelList = [this.intl.get('tlb-riskLevelLow'), this.intl.get('tlb-riskLevelLow'), this.intl.get('tlb-riskLevelLow')]; // 风险等级
    this.earnStartList = [this.intl.get('tlb-earnStartNow'), this.intl.get('tlb-earnStartNext')]; // 起息日期
    this.imgList = { // 背景图片
      BTC: TLB_BG_BTC,
      CNY: TLB_BG_CNY,
      USD: TLB_BG_USD,
      USDT: TLB_BG_USD
    };
    this.state = {

    };
    const {controller} = props;
    //绑定view
    controller.setView(this);
    //初始化数据，数据来源即store里面的state
    this.state = Object.assign(this.state, controller.initState);
  }

  async componentDidMount() {
    // let result = await this.initData(0);
    // let flagList = result && result.fundList.filter(item => {return item.isOpen === this.props.flag}).sort((a,b) => a.id-b.id);
    // // let unopenList = result && result.fundList.filter(item => {return item.isOpen === 1});
    // // let flagList = this.props.flag && unopenList || openList;
    // this.setState(Object.assign(this.state, result, {flagList}));
  }

  goDetail = (v) => {
    let operateArr = [
      () => this.props.history.push(formatQueryToPath('/detail', {id: v.id})),
      () => goAssetPath('/taolibao/balance')
    ];
    operateArr[this.props.flag]()
  };

  render() {
    const {title, subtitle, remindTitle, fundList, btnTitle} = this.props;
    let lang = this.props.controller.configController.language ;
    return (
      <div className='fund-content-wrap'>
        <div className="info-wrap">
          <div className="content-title">
            <span>{title}</span>
            <b>{subtitle}</b>
          </div>
          {fundList.map((v, index) => (
            <div key={index} className="content-wrap" style={{backgroundImage: `url(${this.imgList[v.fund]})`}}>
              <div className="content-left">
                <span className={lang === 'en-US' ? 'en-span' : ''}>{v.name}</span>
                <p className={lang === 'en-US' ? 'en-p' : ''}>{v.describe}</p>
              </div>
              <div className="content-right">
                <div className="product-title">
                  <ul className="clearfix">
                    <li className="title-li">
                      <i>{v.name}</i>
                      <em>{this.intl.get('tlb-investLimitLive')}</em>
                      <em>{this.intl.get('tlb-current')}</em>
                    </li>
                    <li className="num-li">
                      <span>{this.intl.get('tlb-investAmount')}:</span>
                      <b>{v.investNum}{this.intl.get('tlb-investNum')} ({this.intl.get('tlb-investNumEvery', {num : v.investBase, name: v.fund})})</b>
                    </li>
                  </ul>
                </div>
                <div className="product-info clearfix">
                  <p>
                    <i>{v.yields}</i><em>%</em>
                    <span>{this.intl.get('tlb-yields')}</span>
                  </p>
                  <table className={lang === 'en-US' ? 'en-table' : ''}>
                    <tbody>
                    <tr className="">
                      <td><b>{this.intl.get('tlb-manager')}：</b>{v.manager}</td>
                      <td><b>{this.intl.get('tlb-earnStart')}：</b>{this.earnStartList[v.earnStart]}</td>
                      <td><b>{this.intl.get('tlb-buyAmount')}：</b>{v.buyAmount}</td>
                    </tr>
                    <tr>
                      <td><b>{this.intl.get('tlb-riskLevel')}：</b>{this.riskLevelList[v.riskLevel]}</td>
                      <td className="percent-td clearfix">
                        <b>{this.intl.get('tlb-remainPercent')}：</b>
                        <Progress percent={v.remainPercent} position="right" width={160}/>
                      </td>
                      <td>
                        <button onClick={state => this.goDetail(v)}>{btnTitle}</button>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
