import React from 'react';

import ExchangeViewBase from "@/components/ExchangeViewBase";
import Button from '@/common/baseComponent/Button/index.jsx'
import Input from '@/common/baseComponent/Input/index.jsx'
import { GUANBI_HEI } from '@/config/ImageConfig';

export default class PwdLimitPopup extends ExchangeViewBase {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    }
  }

  componentDidMount() {
    this.props.errState && this.props.resetCode();
  }

  canClick() {
    if (this.props.errState) return false;
    if (this.state.value) return true; // 绑定
    return false
  }

  render() {
    let { onClose, onConfirm, resetCode, errCode, errState } = this.props;
    return (
      <div className='pwd-limit-wrp'>
        <div className='pwd-limit-con'>
          <div className='title-wrap'>
            <div className="title-wrap clearfix">
              <img src={GUANBI_HEI} alt="" className="close-popup" onClick={() => { onClose && onClose()}}/>
              <h1 className="pop-title">{this.intl.get('user-deal-identify')}</h1>
            </div>
          </div>
          <ul>
            <li>{this.intl.get('user-deal-inputpwdplease')}</li>
            <li>{this.intl.get('fundPass')}</li>
            <li className="err-parent">
              <Input oriType="password"
                     placeholder={this.intl.get('user-deal-pass-empty')}
                     autocomplete="off"
                     disabled={errCode === 612 ? true : false}
                     onInput={(value) => { this.setState({ value }); resetCode && resetCode()}}
                     autoFocus
              />
              {[601, 612].includes(errCode) && this.state.value && <em className="err-children">{errState}</em>}
            </li>
            <li>
              <Button
                title={this.intl.get('user-submit')}
                onClick={() => { onConfirm && onConfirm(this.state.value);}}
                disable={this.canClick() ? false : true}
                className={`${this.canClick() ? 'can-click' : ''}`}
              />
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
