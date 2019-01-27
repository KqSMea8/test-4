import React from 'react';
import ExchangeViewBase from '@/components/ExchangeViewBase';
import { TLB_STEP1, TLB_STEP2, TLB_STEP3, TLB_STEP4 } from '@/config/ImageConfig';

export default class FundTop extends ExchangeViewBase {
  constructor(props) {
    super(props);
    this.stepList=[
      {
        src: TLB_STEP1,
        title: this.intl.get('tlb-stepTitle1'),
        con: this.intl.get('tlb-stepCon1')
      },
      {
        src: TLB_STEP2,
        title: this.intl.get('tlb-stepTitle2'),
        con: this.intl.get('tlb-stepCon2')
      },
      {
        src: TLB_STEP3,
        title: this.intl.get('tlb-stepTitle3'),
        con: this.intl.get('tlb-stepCon3')
      },
      {
        src: TLB_STEP4,
        title: this.intl.get('tlb-stepTitle4'),
        con: this.intl.get('tlb-stepCon4')
      },
    ];
    this.state = {

    };
  }

  render() {
    let lang = this.props.controller.configController.language;
    return (
      <div className='fund-top-wrap'>
        <div className="fund-banner-title">
          <h1>{this.intl.get('tlb')}</h1>
          <p>{this.intl.get('tlb-introduce')}</p>
        </div>
        <div className="fund-step">
          <ul className={`${lang === 'en-US' ? 'en-ul' : ''} clearfix`}>
            {this.stepList.map((v, index) => (
              <li key={index} className="clearfix">
                <img src={v.src} alt=""/>
                <p>
                  <span>{v.title}</span>
                  <b>{v.con}</b>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
