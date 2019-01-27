import React, {Component} from 'react';
import ExchangeViewBase from '@/components/ExchangeViewBase'


import {AsyncAll, Regular} from '@/core'

export default class TimeInfo extends ExchangeViewBase {
  constructor(props) {
    super(props);
  }

  render() {
    const {userInfo, changeSetPopup} = this.props;
    return (
      <div className="time model-div clearfix">
        <h2>{this.intl.get("user-otherSet")}</h2>
        <ul className="fl time-ul">
          <li>{this.intl.get("user-time")}</li>
          <li className="clearfix">
            <Input
              type="select"
              readOnly={true}
              valueArr={this.state.timeAddrList.map(item => item)}
              onSelect={value => {
                this.setState({timeAddr: value});
              }}
              value={this.state.timeAddr}
            />
            <Button title={this.intl.get("save")} className="time-btn"/>
          </li>
        </ul>
      </div>
    );
  }
}