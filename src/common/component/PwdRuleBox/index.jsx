/*
  type 提示类型 0 资金密码 1 登录密码
 */

import React, {Component} from "react";
import ExchangeViewBase from "../../../components/ExchangeViewBase";

export default class PwdRuleBox extends ExchangeViewBase {
  constructor(props) {
    super(props);
    this.state = {
      strengthText: [this.intl.get("pwd-strength-low"), this.intl.get("pwd-strength-middle"), this.intl.get("pwd-strength-high")],
      strengthBg: ['low-bg', 'middle-bg', 'high-bg']
    };
  }

  render() {
    let {type} = this.props;
    type = type === 0 ? 0 : 1;
    return (
      <ol className="pwd-rule-wrap">
        <li>{type ? this.intl.get("pwdRule1") : this.intl.get("pwdRule4")}</li>
        <li>{this.intl.get("pwdRule2")}</li>
        {type && <li>{this.intl.get("pwdRule3")}</li> || null}
      </ol>
    );
  }
}


