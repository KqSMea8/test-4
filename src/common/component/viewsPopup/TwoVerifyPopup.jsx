import React, { Component } from 'react';

import exchangeViewBase from "@/components/ExchangeViewBase";
import Button from '@/common/baseComponent/Button/index.jsx'
import Input from '@/common/baseComponent/Input/index.jsx'
import "./viewsPopup.styl"
import { ASSET_CLOSED } from '@/config/ImageConfig';
// destroy 组件销毁时执行的方法
// onClose 关闭弹窗
// type 验证类型1 邮件 3 短信 2 谷歌验证
// getVerify 获取验证码
// onConfirm 确认时的操作
// verifyNum 倒计时位置文案
// resetCode 错误码重置
// errCode 错误码
// errState 错误码文案


export default class TwoVerifyPopup extends exchangeViewBase {
  constructor(props) {
    super(props);
    this.verifyState={
      1: this.intl.get('asset-input-twoVerify1'),
      2: this.intl.get('asset-input-twoVerify2'),
      3: this.intl.get('asset-input-twoVerify3'),
    }
    this.verifyText = [
      this.intl.get('user-verifyEmail'),this.intl.get('user-popGoole'),this.intl.get('user-verifyPhone'),
    ]
    this.state = {
      value: ''
    }
  }
  componentWillUnmount() {
    this.props.destroy && this.props.destroy();
  }
  googleInput = (value)=>{
    if(!/^[0-9]*$/.test(value)) return;
    this.inputHandle(value)
  }

  inputHandle = (value)=>{
    this.setState({ value }); this.props.resetCode && this.props.resetCode();
  }
  render() {
    let { onClose, type, getVerify, verifyNum, onConfirm, errCode, errState} = this.props;
    return (
      <div className="view-popup-wrap">
        <div className="view-info">
          <img src={ASSET_CLOSED} alt="" className="close-popup" onClick={() => { onClose && onClose() }} />
          <h2 className="verify-h2">{this.intl.get('twoStep')}</h2>
          <p>{this.verifyText[type - 1]}</p>
          <div className="clearfix verify-input">
            <div className="err-parent">
              <Input
                className={`${type !== 1 && type !== 3 ? 'long' : ''} ${[607, 608, 2001].includes(errCode) ? 'error' : ''}`}
                placeholder={this.verifyState[type]}
                maxlength={6}
                value={this.state.value}
                onInput={type !== 2 ? this.inputHandle : this.googleInput}
              />
              {[607, 608, 2001].includes(errCode) && this.state.value && <em className="err-children">{[607, 608, 2001].includes(errCode) ? errState : ''}</em>}
            </div>
            {(type === 1 || type === 3) && <Button
              type="base"
              title={(typeof verifyNum === "number" && ((verifyNum === 0 && this.intl.get("sendAgain")) || `${verifyNum}s`)) || verifyNum}
              className={`verify-btn ${(typeof verifyNum === 'number' && verifyNum !== 0) ? 'disabled-btn' : ''}`}
              onClick={() => { getVerify && getVerify() }}
            />}
          </div>
          <Button title={this.intl.get('asset-submit')} disable={this.state.value === ''} type="base" className="set-btn" onClick={() => { onConfirm && onConfirm(this.state.value); }} />

        </div>
      </div>)
  }
}
