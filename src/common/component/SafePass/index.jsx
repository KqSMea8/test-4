import React from 'react';

import ExchangeViewBase from "@/components/ExchangeViewBase";
import Button from '@/common/baseComponent/Button/index.jsx'
import Input from '@/common/baseComponent/Input/index.jsx'
import PropTypes from "prop-types";
import "./index.styl"
import { ASSET_CLOSED } from '@/config/ImageConfig';
// onClose 关闭弹窗
// onConfirm 确认时的操作
// errText 错误文案

export default class SafePass extends ExchangeViewBase {
  static propTypes = {
    errText: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      disable: false,
    }
  }

  input=(value)=>{
    this.setState({value})
  }

  beable = ()=>{
    this.setState({disable: false})
  }

  render() {
    let { onClose, onConfirm, errText} = this.props;
    return (
      <div className="safePass-wrap">
        <div className="safePass-content">
          <h3 className="safePass-content-title">
            {this.intl.get('safeVerify')}
            <img src={ASSET_CLOSED} alt="" onClick={() => { onClose && onClose() }} />
          </h3>
          <div className="password">
            <p>{this.intl.get('fundPass')}</p>
            <Input
              className={`${errText ? 'error' : ''}`}
              value={this.state.value}
              onInput={this.input}
              oriType={'password'}
              placeholder={this.intl.get('inputFundPassword')}
            />
            <span>{errText}</span>
          </div>
          <Button title={this.intl.get('ok')} type="base" disable={this.state.value === '' || this.state.disable} onClick={() => {this.setState({disable: true}); onConfirm && onConfirm(this.state.value, this.beable) }}
                  className={'safe-pass-button'}
          />
        </div>
      </div>)
  }
}
