import React, {Component} from 'react';
import ExchangeViewBase from '@/components/ExchangeViewBase'

import Button from '@/common/baseComponent/Button'

import {AsyncAll, Regular} from '@/core'
import DetectOS from '@/class/lib/Os'
import Browser from '@/class/lib/Browser'

export default class DeviceInfo extends ExchangeViewBase {
  constructor(props) {
    super(props);
    this.outOther = this.props.controller.outOther.bind(this.props.controller); // 退出其他设备
  }

  render() {
    const {currentLogin, controller} = this.props;
    let language = controller.configController.language;
    return (
      <div className="login-device model-div clearfix">
        <h2>{this.intl.get("user-current")}</h2>
        <div className="fl">
          <p>{this.intl.get("user-currentTitle")}</p>
          <table>
            <thead>
            <tr>
              <th>{this.intl.get("time")}</th>
              <th>{this.intl.get("equipment")}</th>
              <th>{this.intl.get("ip")}</th>
              <th>{this.intl.get("place")}</th>
              <th>{this.intl.get("user-isCurrent")}</th>
            </tr>
            </thead>
            <tbody>
            {currentLogin && currentLogin.length ? currentLogin.map((v, index) => (
              <tr key={index}>
                <td>{v.loginTime && v.loginTime.toDate('yyyy-MM-dd HH:mm:ss')}</td>
                <td>{v.device}</td>
                <td>{v.ip}</td>
                <td>{language === 'zh-CN' ? `${v.ipLocation.countryCN} - ${v.ipLocation.provinceCN}` : `${v.ipLocation.countryEN} - ${v.ipLocation.provinceEN}`}</td>
                <td>{`${v.isMe ? this.intl.get("yes") : this.intl.get("no")}`}</td>
              </tr>)) : (<tr className="nothing-text">
              <td colSpan="5">{this.intl.get("user-none")}</td>
            </tr>)
            }
            </tbody>
          </table>
          <Button title={this.intl.get("user-out")}
                  className="login-device-btn"
                  onClick={() => this.outOther(DetectOS(), Browser())}
          />
        </div>
      </div>
    );
  }
}