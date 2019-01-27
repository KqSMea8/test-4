import React, {Component} from 'react';
import intl from "react-intl-universal";
import { NavLink } from "react-router-dom";
import {
  formatQueryToPath
} from "@/config/UrlConfig"

export default class ChargeMessage extends Component {
  constructor(props) {
    super(props);
    this.controller = this.props.controller;
    this.intl = intl;
    this.state = {
      top1: 0,
      top2: 100,
      criticalArr: [0, 100],
      content: [],
      origin: props.origin || 'exchange'
    };

    this.getChargeMessage = this.controller.getChargeMessage.bind(this.controller);
    this.getOtcChargeMessage = this.controller.getOtcChargeMessage.bind(this.controller);
  }

  async componentDidMount() {
    let result;
    if(this.state.origin === 'exchange') result = await this.controller.getChargeMessage();
    if(this.state.origin === 'otc') result = await this.controller.getOtcChargeMessage();
    if (result && result.length) {
      this.setState(
        {
          top2: Math.ceil(result.length / 2) * 100,
          content: result,
          criticalArr: Array.from(
            { length: Math.ceil(result.length / 2 + 1) },
            (item, index) => index * 100
          )
        },
        () => {
          this.controller.swiper(
            "carousel",
            this,
            "top1",
            "top2",
            this.state.criticalArr,
            10,
            3000
          );
        }
      );
    }
  }

  componentWillUnmount() {
    this.controller.swiperClear("carousel");
  }

  render() {
    return (
      <div className="asset-message-wrap" style={{ display: this.state.content.length ? 'block' : 'none'}}>
        <div className="asset-message-bg">
          <div className="asset-message">
            <p className="asset-message-title">{this.intl.get("message")}：</p>
            <ul className="clearfix" style={{ top: this.state.top1 + "%" }}>
              {this.state.content.map((v, i) => (
                <li key={i}>
                  <NavLink to={{ pathname: `${formatQueryToPath('/' + this.state.origin + '/dashboard', {type: 1})}`}}>
                    【{this.intl.get("deposit")}】{v.orderTime.toDate()} {v.count}{" "}
                    {v.coinName.toUpperCase()} {this.intl.get("asset-confirming")}({`${
                      v.doneCount || 0
                      }/${v.verifyCount}`})
                  </NavLink>
                </li>
              ))}
            </ul>
            <ul className="clearfix" style={{ top: this.state.top2 + "%" }}>
              {this.state.content.map((v, i) => (
                <li key={i}>
                  <NavLink to={{ pathname: `${formatQueryToPath('/' + this.state.origin + '/dashboard', {type: 1})}`}}>
                    【{this.intl.get("deposit")}】{v.orderTime.toDate()} {v.count}{" "}
                    {v.coinName.toUpperCase()} {this.intl.get("asset-confirming")}({`${
                      v.doneCount
                      }/${v.verifyCount}`})
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}