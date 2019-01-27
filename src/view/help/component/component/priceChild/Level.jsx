import React, { Component } from "react";
import intl from "react-intl-universal";

export default class Level extends Component {
  constructor(props) {
    super(props);
    this.intl = intl
  }

  componentDidMount() {
    // this.props.sendStatis({
    //   event: 'pircingPV',//操作代码
    //   type: 'level',//tab
    // })
  }

  getLevel() {
    return {
      table: {
        thead: [this.intl.get('help-level'), this.intl.get('help-require-points')],
        tbody: [
          {
            grade: `VIP0`,
            score: `0`,
          },
          {
            grade: `VIP1`,
            score: `10000`
          },
          {
            grade: `VIP2`,
            score: `50000`
          },
          {
            grade: `VIP3`,
            score: `100000`
          },
          {
            grade: `VIP4`,
            score: `200000`
          },
          {
            grade: `VIP5`,
            score: `500000`
          },
          {
            grade: `MVIP`,
            score: this.intl.get('help-fee-services')
          }
        ]
      },
      gradeInfo: [
        this.intl.get('help-vip-forver'),
        this.intl.get('help-points-accumulation'),
        this.intl.get('help-adjust'),
        // this.intl.get('help-usd-withdrawal'),
      ]
    };
  }

  render() {
    let { table, gradeInfo } = this.getLevel();
    return(
      <div>
        <div className="price-title">
          <span>{`${this.intl.get('help-fees')}-${this.intl.get('price-levelPoint')}`}</span>
          {/*<b>{this.intl.get('price-levelPoint')}</b>*/}
        </div>
        <table className="level-standard">
          <thead>
            <tr>
              {table.thead.map((v, index) => <th key={index}>{v}</th>)}
            </tr>
          </thead>
          <tbody>
          {table.tbody.map((v, index) => <tr key={index}>
            <td>{v.grade}</td>
            <td>{v.score}</td>
            {v.fee && <td rowSpan="7">{v.fee}</td>}
            {v.fast && <td rowSpan="7">{v.fast}</td>}
          </tr>)}
          </tbody>
        </table>
        <ul className="level-gradeInfo">
          {gradeInfo.map((v, index) => <li key={index}>{v}</li>)}
        </ul>
      </div>
    );
  }
}
