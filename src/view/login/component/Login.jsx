import React, { Component } from "react";
import intl from "react-intl-universal";
import "./style/login.styl"
import Button from '@/common/baseComponent/Button/index.jsx'
import Popup from '@/common/baseComponent/Popup/index.jsx'
import Input from '@/common/baseComponent/Input/index.jsx'
import TwoVerifyPopup from '@/common/component/viewsPopup/TwoVerifyPopup.jsx'
import {Regular} from '@/core'
import DetectOS from '@/class/lib/Os'
import Browser from '@/class/lib/Browser'

import Translate from '@/core/libs/Translate'
import LoginLang from '../lang'
import {
  getQueryFromPath,
  resolveHomePath,
  resolvePassportPath,
  resolveRegisterPath
} from "@/config/UrlConfig"

class Login extends Component {
  constructor(props) {
    super(props);
    const {controller} = props;
    this.name = 'login';
    this.intl = intl;
    this.state = {
      userInput: "",
      passInput: "",
      codeInput: "",
      picInput: "",
      verifyNum: this.intl.get("sendCode"),
      showPopup: false, // 提示弹窗
      popType: "tip1",
      popMsg: "登录成功",
      showTwoVerify: false,
      verifyType: "", // 密码登录两步认证弹窗
      checkState: true, // checkbox判断
      userErr: "", // 手机号/邮箱错误
      loginCode: 0, // 密码错误禁止输入错误码
      loginState: "", // 根据后台错误码显示错误
      twoVerifyUser: "", // 两步认证用户信息
      from: getQueryFromPath('redirectURL') || resolveHomePath()
    };
    //绑定view
    controller.setView(this);
    //初始化数据，数据来源即store里面的state
    this.history = props.history;
    this.state = Object.assign(this.state, controller.initState);
    this.getVerify = controller.getVerify.bind(controller);
    this.clearVerify = controller.clearVerify.bind(controller);
    this.login = controller.login.bind(controller);
    this.getCaptchaVerify = controller.getCaptchaVerify.bind(controller);
    this.destroy = controller.clearVerify.bind(controller); // 清除定时器
    this.loginFirst = controller.loginFirst.bind(controller); // 页面登录
    // 添加统计数
    this.sendStatis = controller.configController.sendStatis.bind(controller.configController)
  }

  componentDidMount() {
    this.sendStatis({
      event: 'signInPV',//操作代码
      type: 'password',//tab
    });
    this.getCaptchaVerify();
    window.addEventListener("keydown", this.onEnter);
  }

  componentWillUnmount() {
    this.destroy();
    window.removeEventListener("keydown", this.onEnter);
  }

  changeUser(value) { // 校验用户
    this.setState({userInput: value.trim()});
    this.state.userErr && (this.setState({userErr: ""}))
  }

  changePass(value) { // 输入密码
    this.setState({passInput: value.trim()});
    this.state.loginState && (this.setState({loginState: ""}))
  }

  changePic(value) { // 输入图形验证码
    this.setState({picInput: value.replace(/\D/g, '').trim()});
    this.state.loginState && (this.setState({loginState: ""}))
  }

  canClick() {
    if (this.state.userErr || this.state.loginState) return false;
    if (this.state.userInput && this.state.passInput && this.state.picInput) return true;
    return false
  }

  checkUserInput = () => { // 手机号／邮箱
    let reg1 = Regular('regEmail', this.state.userInput), // 邮箱
      reg2 = Regular('regPhone', this.state.userInput), // 手机
      userErr = this.state.userErr;
    if (!reg1 && !reg2) {
      userErr = this.intl.get("login-inputVerifyPhoneAndEmail")
    }
    this.setState({
      userErr
    })
  };

  resetCode = () => { // 重置错误码
    this.setState({
      loginCode: 0
    })
  };

  handlerLogin = async () => { // 登录事件
    let reg1 = Regular('regEmail', this.state.userInput), // 邮箱
        userType = reg1 ? 1 : 0;
    this.loginFirst(this.state.userInput, this.state.passInput, userType, 1, this.state.captchaId, this.state.picInput, DetectOS(), Browser())
  };

  onEnter = (event) => { // 登录回车
    if (event.keyCode !== 13) return;
    this.canClick() && this.handlerLogin()
  };

  render() {
    let language = this.props.controller.configController.language,
      verifyTypeObj = {
        2008: 2,
        2009: 1,
        2010: 3
      };
    return (
      <div className="login-wrap-con" style={{minHeight: `${window.innerHeight - 2.1 * 100}px`}}>
        <div className="login-wrap">
          <h1 className={language === 'en-US' ? 'h1-en' : ''}>{this.intl.get('header-login')} QB.com</h1>
          <ul>
            <li className="err-parent">
              <Input placeholder={this.intl.get("login-userInput")}
                     value={this.state.userInput}
                     onInput={value => this.changeUser(value)}
                     className={this.state.userInput && this.state.userErr ? 'err-input' : ''}
                     onBlur={this.checkUserInput}/>
              {this.state.userInput && this.state.userErr &&
              <em className="err-children">{this.state.userInput && this.state.userErr}</em>}
            </li>
            <li className="pass-li clearfix err-parent">
              <Input placeholder={this.intl.get("login-passInput")}
                     className={this.state.loginCode === 631 && this.state.loginState ? 'err-input' : ''}
                     maxlength="32"
                     oriType={this.state.loginCode === 630 ? "text" : "password"}
                     disabled={this.state.loginCode === 630 ? true : false}
                     value={this.state.loginCode === 630 ? this.intl.get("login-seal") : this.state.passInput}
                     onInput={value => this.changePass(value)}/>
              {this.state.loginCode === 631 && this.state.loginState &&
              <em className="err-children">{this.state.loginCode === 631 && this.state.loginState}</em>}
            </li>
            <li className="picture-li err-parent">
              <div className="clearfix">
                <Input placeholder={this.intl.get("login-popPicturePlaceholder")}
                       className={this.state.loginCode === 619 && this.state.loginState ? 'err-input' : ''}
                       value={this.state.picInput}
                       onInput={value => this.changePic(value)}/>
                <div className="picture-btn">
                  <img src={this.state.captcha || ''} alt="" onClick={this.getCaptchaVerify}/>
                </div>
              </div>
              {this.state.loginCode === 619 && this.state.loginState &&
              <em className="err-children">{this.state.loginCode === 619 && this.state.loginState}</em>}
            </li>
            <li className="login-btn-li">
              <Button
                title={this.intl.get("login")}
                className={`${this.canClick() ? 'can-click' : ''} login-btn`}
                disable={this.canClick() ? false : true}
                onClick={this.handlerLogin}/>
            </li>
            <li className="forget-li clearfix">
              <a href={resolvePassportPath()} className="forget-a">{`${this.intl.get("login-forget")}?`}</a>
              <span>{this.intl.get("login-account")}<a href={resolveRegisterPath()}>{this.intl.get("login-register")}</a></span>
            </li>
          </ul>
        </div>
        {this.state.showPopup && (
          <Popup
            type={this.state.popType}
            msg={this.state.popMsg}
            onClose={() => {
              this.setState({showPopup: false});
            }}
            autoClose={true}
          />
        )}
        {this.state.showTwoVerify && <TwoVerifyPopup
          verifyNum={this.state.verifyNum}
          resetCode={this.resetCode}
          errCode={this.state.loginCode}
          errState={this.state.loginState}
          type={verifyTypeObj[this.state.verifyType]}
          getVerify={() => {
            this.getVerify(this.state.twoVerifyUser, this.state.verifyType === 2009 ? 1 : 0, 0)
          }}
          onClose={() => {
            this.setState({showTwoVerify: false, verifyType: ""});
            this.getCaptchaVerify()
          }}
          destroy={this.destroy}
          onConfirm={code => {
            let reg1 = Regular('regEmail', this.state.userInput), // 邮箱
              userType = reg1 ? 1 : 0;
            this.loginFirst(
              this.state.verifyType === 2008 ? this.state.userInput : this.state.twoVerifyUser,
              code,
              this.state.verifyType === 2008 ? userType : (this.state.verifyType === 2009 ? 1 : 0),
              this.state.verifyType === 2008 ? 2 : 3,
              this.state.captchaId,
              this.state.picInput,
              DetectOS(),
              Browser());
          }}
        />}
      </div>
    );
  }
}

export default Translate(Login, LoginLang)