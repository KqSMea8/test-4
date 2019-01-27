/*
  flag 密码级别
 */

import React, {Component} from "react";
import ExchangeViewBase from "../../../components/ExchangeViewBase";

export default class PwdStrengthLine extends ExchangeViewBase {
  constructor(props) {
    super(props);
    this.state = {
      strengthText: [this.intl.get("pwd-strength-low"), this.intl.get("pwd-strength-middle"), this.intl.get("pwd-strength-high")],
      strengthBg: ['low-bg', 'middle-bg', 'high-bg']
    };
  }

  render() {
    let {flag} = this.props
    return (
      <div className={`${flag ? this.state.strengthBg[flag-1] : ''} pwd-strength-wrap`}>
        <span></span>
        <span></span>
        <span></span>
        <b>{this.state.strengthText[flag-1]}</b>
      </div>
    );
  }
}
