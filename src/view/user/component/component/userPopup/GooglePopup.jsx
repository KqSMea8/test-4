import React, {Component} from 'react';

import ExchangeViewBase from "@/components/ExchangeViewBase";
import Button from '@/common/baseComponent/Button/index.jsx'
import Input from '@/common/baseComponent/Input/index.jsx'
import QRCode from "qrcode-react";
import { GUANBI_HEI } from '@/config/ImageConfig';

export default class GooglePopup extends ExchangeViewBase {
  constructor(props) {
    super(props);
    this.state = {
      codeValue: ''
    }
  }

  changeInput(value) {
    this.setState({codeValue: value});
  }

  async componentDidMount() {

  }

  render() {
    return (
      <div className="google-wrap">
        <div className="google-info">
          <div className="title-wrap clearfix">
            <img src={GUANBI_HEI} alt="" className="close-popup" onClick={() => {this.props.onClose && this.props.onClose()}}/>
            <h1 className="pop-title">{this.intl.get("user-googleStart")}</h1>
          </div>
          <div className="clearfix">
            <ul>
              <li>1</li>
              <li>{this.intl.get("user-googleInstall")}: Google Authenticator</li>
              <li><Button title="App Store" href="https://itunes.apple.com/cn/app/google-authenticator/id388497605?mt=8" target="_blank" className="google-btn"/></li>
              <li><Button title="Google.play" href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2" target="_blank" className="google-btn"/></li>
              <li><a href="https://support.google.com/accounts/answer/1066447?hl=en" target="_blank">Google Authenticator on other devices</a></li>
            </ul>
            <ul>
              <li>2</li>
              <li>{this.intl.get("user-googleExplain1")}</li>
              <li><QRCode value={`otpauth://totp/QB.com?secret=${this.props.googleSecret || ''}`} level="M"/></li>
              <li>{this.intl.get("user-googleExplain2")} {this.props.googleSecret}</li>
            </ul>
            <ul>
              <li>3</li>
              <li>{this.intl.get("user-googleWarnings")}:</li>
              <li>
                <i>{this.intl.get("user-googleRemind1")}</i>
                <em>{this.props.googleSecret}</em>
              </li>
              <li>{this.intl.get("user-googleRemind2")}</li>
              <li>{this.intl.get("user-googleInput")}</li>
              <li className="clearfix">
                <Input value={this.state.codeValue} onInput={value => this.changeInput(value)}/>
                <Button title={this.intl.get("user-submit")}
                        className={`${this.state.codeValue ? 'can-click' : 'no-click'} name-btn`}
                        onClick={() => {this.state.codeValue && this.props.setGoogleVerify(this.state.codeValue)}}/>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
