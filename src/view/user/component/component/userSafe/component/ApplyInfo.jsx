import React, {Component} from 'react';
import ExchangeViewBase from '@/components/ExchangeViewBase'
import Button from '@/common/baseComponent/Button'
import Input from '@/common/baseComponent/Input'


import {AsyncAll, Regular} from '@/core'

export default class ApplyInfo extends ExchangeViewBase {
  constructor(props) {
    super(props);
    this.state = {
      nameValue: ''
    }
  }

  changeName(value) { // 当前密码输入框
    this.setState({nameValue: value.trim()});
  }

  render() {
    const {otcApplyStore} = this.props;
    return (
      <div className="apply-data model-div clearfix">
        <h2>{this.intl.get("user-apply-title")}</h2>
        <div className="apple-btn-group fl clearfix">
          <Input
            placeholder={this.intl.get("user-apply-input")}
            value={this.state.nameValue}
            onInput={value => this.changeName(value)}
            maxlength="15"/>
          <Button
            title={this.intl.get("user-apply-btn")}
            onClick={state => otcApplyStore && otcApplyStore(this.state.nameValue)}
            className={this.state.nameValue ? 'active' : ''}/>
        </div>
      </div>
    );
  }
}