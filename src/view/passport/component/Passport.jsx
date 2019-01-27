import React, {Component} from 'react';
import "./style/passport.styl"
import ExchangeViewBase from "@/components/ExchangeViewBase";
import Button from '@/common/baseComponent/Button'
import Input from '@/common/baseComponent/Input'
import PwdStrengthLine from '@/common/component/PwdStrengthLine'
import PwdRuleBox from '@/common/component/PwdRuleBox'
import Popup from '@/common/baseComponent/Popup'
import {Regular, CheckPwdStrength} from '@/core'

import Translate from "@/core/libs/Translate";
import ForgetPassLang from "../lang";

class ForgetPass extends ExchangeViewBase {
  constructor(props) {
    super(props);
    const {controller} = props
    this.state = {
      userInput: "",
      verifyInput: "",
      passInput: "",
      againInput: "",
      picInput: "",
      showPopup: false,
      popType: "tip1",
      popMsg: "成功",
      captcha: "",
      captchaId: "",
      errPass: "",
      errPassAgain: "",
      userErr: "",
      verifyNum: this.intl.get("sendCode"),
      errCode: 0, // 错误ret
      errState: '', // 错误提示
      getClick: false, // 验证码是否可点击
      checkPwdStrength: 0 //密码强度检验
    }
    //绑定view
    controller.setView(this);
    //初始化数据，数据来源即store里面的state
    this.history = props.history;
    this.state = Object.assign(this.state, controller.initState);
    this.getVerify = controller.getVerify.bind(controller); // 短信验证码
    this.getCaptchaVerify = controller.getCaptchaVerify.bind(controller); // 图形验证码
    this.forgetLoginPass = controller.forgetLoginPass.bind(controller); // 图形验证码
    // 统计访问量
    // this.sendStatis = controller.configController.sendStatis.bind(controller.configController)
  }

  componentWillMount() {

  }

  async componentDidMount() {
    // this.sendStatis({
    //   event: 'signInPV',//操作代码
    //   type: 'find',//tab
    // });
    await this.getCaptchaVerify()
  }

  componentWillUpdate(...parmas) {

  }

  changeUserInput(value) {
    let reg1 = Regular('regEmail', value.trim()),
        reg2 = Regular('regPhone', value.trim());
    this.setState({
      userInput: value.trim()
    });
    this.state.userErr && (this.setState({userErr: ""}));
    if (reg1 || reg2) {
      this.setState({
        getClick: true
      });
      return
    }
    this.setState({
      getClick: false
    });
  }

  changeVerifyInput(value) {
    this.setState({verifyInput: value.replace(/\D/g, '').trim()});
    this.state.errState && (this.setState({errState: ""}))
  }

  changePassInput(value) {
    let pwdS = CheckPwdStrength.CheckPwdStrength(value.trim());
    this.setState({
      passInput: value.trim(),
      checkPwdStrength: pwdS
    });
    this.state.errPass && (this.setState({errPass: ""}));
    this.state.errPassAgain && (this.setState({errPassAgain: ""}))
  }

  changeAgainInput(value) {
    this.setState({againInput: value.trim()});
    this.state.errPassAgain && (this.setState({errPassAgain: ""}))
  }

  changePicInput(value) {
    this.setState({picInput: value.replace(/\D/g, '').trim()});
    this.state.errState && (this.setState({errState: ""}))
  }

  // 检验部分
  checkUserInput = () => { // 手机号／邮箱
    let reg1 = Regular('regEmail', this.state.userInput),
        reg2 = Regular('regPhone', this.state.userInput),
        userErr = this.state.userErr;
    if (!reg1 && !reg2) {
      userErr = this.intl.get("login-inputVerifyPhoneAndEmail")
    }
    this.setState({
      userErr
    })
  };

  checkPassInput = () => { // 密码
    let reg = Regular('regPwd', this.state.passInput); // 密码
    if(!reg) {
      this.setState({
        errPass: this.intl.get("pass-checkNewPwd")
      });
      return
    }
    if(this.state.againInput && (this.state.againInput !== this.state.passInput)) { // 两次密码不一致
      this.setState({
        errPassAgain: this.intl.get("pass-checkAgainPwd")
      })
    }
    if (reg && (this.state.againInput === this.state.passInput)) { // 两次密码一致
      this.state.errPassAgain && (this.setState({errPassAgain: ""}))
    }
  };

  checkAgainInput = () => { // 再次输入密码
    let reg = Regular('regPwd', this.state.againInput); // 再次输入密码
    if(!this.state.passInput && !reg) { // 密码格式不对
      this.setState({
        errPassAgain: this.intl.get("pass-checkNewPwd")
      });
      return
    }
    if(this.state.passInput && (this.state.againInput !== this.state.passInput)) { // 两次密码不一致
      this.setState({
        errPassAgain: this.intl.get("pass-checkAgainPwd")
      })
    }
    if (reg && (this.state.againInput === this.state.passInput)) { // 两次密码一致
      this.state.errPassAgain && (this.setState({errPassAgain: ""}))
    }
  };

  canClick() { // 能否点击
    if (this.state.userErr || this.state.errPassAgain || this.state.errPass || this.state.errState) return false;
    if (this.state.userInput && this.state.verifyInput && this.state.passInput && this.state.againInput && this.state.picInput) return true;
    return false
  }

  render() {
    return (
      <div className="find-pass-wrap-con" style={{minHeight: `${window.innerHeight - 2.1 * 100}px`}}>
        <div className="find-pass-wrap">
          <h1>{this.intl.get("login-findPass")}</h1>
          <ul>
            <li className="err-parent">
              <Input placeholder={this.intl.get("login-userInput")}
                     className={this.state.userInput && this.state.userErr ? 'err-input' : ''}
                     value={this.state.userInput}
                     onInput={value => this.changeUserInput(value)}
                     onBlur={this.checkUserInput}/>
              {this.state.userInput && this.state.userErr && <em className="err-children">{this.state.userInput && this.state.userErr}</em>}
            </li>
            <li className="send-verify-li err-parent">
              <div className="clearfix send-verify-div">
                <Input placeholder={this.intl.get("login-placeholderPhoneAndEmail")}
                       value={this.state.verifyInput}
                       className={[607, 608].includes(this.state.errCode) && this.state.errState ? 'err-input' : ''}
                       onInput={value => this.changeVerifyInput(value)}/>
                <Button className={`${(typeof this.state.verifyNum === 'number' && this.state.verifyNum !== 0) ? 'disabled-btn' : ''} ${this.state.getClick ? 'can-click' : ''} send-code-btn`}
                        title={typeof this.state.verifyNum === 'number' && (this.state.verifyNum === 0 && this.intl.get("sendAgain") || `${this.state.verifyNum}s`) || this.state.verifyNum}
                        onClick={() => {
                          let reg1 = Regular('regEmail', this.state.userInput), // 邮箱
                            userType = reg1 ? 1 : 0;
                          this.getVerify(this.state.userInput, userType, 1)
                        }}/>
              </div>
              {[607, 608].includes(this.state.errCode) && this.state.errState && <em className="err-children">{[607, 608].includes(this.state.errCode) ? this.state.errState : ''}</em>}
            </li>
            <li className="pass-li err-parent">
              <Input placeholder={this.intl.get("pass-inputNewPwd")}
                     maxlength="32"
                     className={this.state.passInput && this.state.errPass ? 'err-input' : ''}
                     oriType="password"
                     value={this.state.passInput}
                     onBlur={this.checkPassInput}
                     onInput={value => this.changePassInput(value)}/>
              <PwdRuleBox />
              {this.state.passInput && this.state.errPass && <em className="err-children">{this.state.passInput && this.state.errPass}</em>}
            </li>
            {this.state.checkPwdStrength && <li className="pwd-strength-li">
              <PwdStrengthLine flag={this.state.checkPwdStrength}/>
            </li> || null}
            <li className="err-parent">
              <Input placeholder={this.intl.get("login-passAgainPlaceholder")}
                     className={this.state.againInput && this.state.errPassAgain ? 'err-input' : ''}
                     maxlength="32"
                     oriType="password"
                     value={this.state.againInput}
                     onBlur={this.checkAgainInput}
                     onInput={value => this.changeAgainInput(value)}/>
              {this.state.againInput && this.state.errPassAgain && <em className="err-children">{this.state.againInput && this.state.errPassAgain}</em>}
            </li>
            <li className="send-picture-li err-parent">
              <div className="clearfix">
                <Input placeholder={this.intl.get("pass-popPicturePlaceholder")}
                       value={this.state.picInput}
                       className={this.state.errCode === 619 && this.state.errState ? 'err-input' : ''}
                       onInput={value => this.changePicInput(value)}/>
                <img src={this.state.captcha || ''} alt="" className="picture-btn btn" onClick={this.getCaptchaVerify} />
              </div>
              {this.state.errCode === 619 && this.state.errState && <em className="err-children">{this.state.errCode === 619 && this.state.errState}</em>}
            </li>
            <li className="warn-li">*{this.intl.get("login-forgetRule")}</li>
            <li>
              <Button title={this.intl.get("sure")}
                      className={` ${this.canClick() ? 'can-click' : ''} pass-btn`}
                      disable={this.canClick() ? false : true}
                      onClick={() => {
                        let reg1 = Regular('regEmail', this.state.userInput), // 邮箱
                          userType = reg1 ? 1 : 0;
                        this.forgetLoginPass(
                          this.state.userInput,
                          userType,
                          this.state.verifyInput,
                          this.state.passInput,
                          this.state.captchaId,
                          this.state.picInput)
                      }}/>
            </li>
          </ul>
        </div>
        {this.state.showPopup && (
          <Popup
            type={this.state.popType}
            msg={this.state.popMsg}
            onClose={() => {
              this.setState({ showPopup: false });
            }}
            autoClose = {true}
          />
        )}
      </div>
    );
  }
}

export default Translate(ForgetPass, ForgetPassLang)