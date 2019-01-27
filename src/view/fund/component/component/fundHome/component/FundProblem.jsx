import React from 'react';
import ExchangeViewBase from '@/components/ExchangeViewBase';
import { TLB_WECHAT } from '@/config/ImageConfig';

// problem项
const ProblemItem = (props) => (
  <div className="problem-item">
    <h5 className={`${props.lang === 'en-US' ? 'problem-question-en' : ''} problem-question`}>{props.que}</h5>
    <p className={`${props.lang === 'en-US' ? 'problem-answer-en' : ''} problem-answer`}>{props.ans}</p>
    {!props.ans && props.children}
  </div>
);

export default class FundProblem extends ExchangeViewBase {
  constructor(props) {
    super(props);
    this.problemList = [
      {
        que: this.intl.get("tlb-que1"),
        ans: this.intl.get("tlb-ans1")
      },
      {
        que: this.intl.get("tlb-que2"),
        ans: this.intl.get("tlb-ans2")
      },
      {
        que: this.intl.get("tlb-que3"),
        ans: this.intl.get("tlb-ans3")
      },
      {
        que: this.intl.get("tlb-que4"),
        ans: null,
        table: true
      },
      {
        que: this.intl.get("tlb-que5"),
        ans: this.intl.getHTML("tlb-ans5")
      },
    ];
    this.state = {};
  }

  renderAns4 = () => {
    let fundFee = this.props.fundList.map(v=>{
      return {name: v.name, subscribe: '0%', redeem: `${v.redeemRate * 100}%`}
    })
    return (
      <table>
        <thead>
        <tr>
          <th>{this.intl.get("tlb-fund")}</th>
          <th>{this.intl.get("tlb-subscribe")}</th>
          <th>{this.intl.get("tlb-redeem")}</th>
        </tr>
        </thead>
        <tbody>
        {fundFee.map((v, index) => <tr key={index}>
            <td>{v.name}</td>
            <td>{v.subscribe}</td>
            <td>{v.redeem}</td>
          </tr>
        )}
        </tbody>
      </table>
    )
  }

  render() {
    const {lang, fundList} = this.props;
    return (
      <div className='fund-problem-wrap'>
        <div className="problem">
          <ol>
            <li className="problem-title">
              <span>{this.intl.get("tlb-queTitle")}</span>
              <b>{this.intl.get("tlb-queRemind")}</b>
            </li>
            {/*<li className="kefu">*/}
              {/*<i>联系客服</i>*/}
              {/*<div>*/}
                {/*<img src={TLB_WECHAT} alt=""/>*/}
              {/*</div>*/}
            {/*</li>*/}
          </ol>
          <div className="problem-list">
            {this.problemList.map((v, index) => (
              <ProblemItem que={v.que} ans={v.ans} key={index} lang={lang}>
                {v.table && this.renderAns4()}
              </ProblemItem>
            ))}
          </div>
        </div>
      </div>
    );
  }
}


