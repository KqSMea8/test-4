import React, { Component } from "react";
import intl from "react-intl-universal";

export default class Score extends Component {
  constructor(props) {
    super(props);
    this.intl = intl
  }

  componentDidMount() {
    // this.props.sendStatis({
    //   event: 'pircingPV',//操作代码
    //   type: 'score',//tab
    // })
  }

  getScore() {
    return {
      scoreTable: {
        thead: [this.intl.get('action'), this.intl.get('points'), this.intl.get('explanation')],
        tbody: [
          {
            op: this.intl.get('login'),
            score: `+2`,
            info: this.intl.get('help-per-day')
          },
          {
            op: `BTC ${this.intl.get('deposit')}`,
            score: `+(${this.intl.get('help-usd-equivalent')}*0.01)`,
            info: this.intl.get('help-rounded-up')
          },
          // {
          //   op: this.intl.get('help-improv'),
          //   score: `+100`,
          //   info: this.intl.get('help-idea-accepted')
          // },
          {
            op: this.intl.get('help-verification'),
            score: `+500`,
            info: this.intl.get('help-real-name')
          },
          {
            op: this.intl.get('help-email-auth'),
            score: `+100`,
            info: this.intl.get('help-email-verify')
          },
          {
            op: this.intl.get('help-google-auth'),
            score: `+1000`,
            info: this.intl.get('help-google-verify')
          },
          {
            op: this.intl.get('help-phone-bind'),
            score: `+1000`,
            info: this.intl.get('help-phone-award')
          },
          {
            op: this.intl.get('help-chargebtc-first'),
            score: `+2000`,
            info: this.intl.get('help-chargebtc-award')
          }
        ]
      }
    };
  }

  render() {
    let { scoreTable } = this.getScore();
    return(
      <div>
        <div className="price-title">
          <span>{`${this.intl.get('help-fees')}-${this.intl.get('help-earn-points')}`}</span>
          {/*<b>{this.intl.get('help-earn-points')}</b>*/}
        </div>
        <table>
          <thead>
          <tr>
            {scoreTable.thead.map((v, index) => (
              <th key={index}>{v}</th>
            ))}
          </tr>
          </thead>
          <tbody>
          {scoreTable.tbody.map((v, index) => <tr key={index}>
            <td>{v.op}</td>
            <td>{v.score}</td>
            <td>{v.info}</td>
          </tr>)}
          </tbody>
        </table>
      </div>
    );
  }
}
