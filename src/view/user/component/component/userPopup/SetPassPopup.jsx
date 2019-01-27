import React, {Component} from 'react';

import ExchangeViewBase from "@/components/ExchangeViewBase";
import Button from '@/common/baseComponent/Button/index.jsx'
import Input from '@/common/baseComponent/Input/index.jsx'
import PwdStrengthLine from '@/common/component/PwdStrengthLine/index.jsx'
import PwdRuleBox from '@/common/component/PwdRuleBox/index.jsx'
import {Regular, CheckPwdStrength} from '@/core'
import { GUANBI_HEI } from '../../../../../config/ImageConfig';

export default class SetPassPopup extends ExchangeViewBase {
  constructor(props) {
    super(props);
    this.state = {
      currentPwdValue: "", // 当前密码输入框
      userValue: "", // 手机号／邮箱／新密码输入框
      againPwdValue: "", // 再次输入密码输入框
      pictureValue: "", // 图形验证码输入框
      verifyValue: "", // 短信／邮箱验证码输入框
      googleValue: "", // 谷歌验证码输入框
      errUser: "", // 新密码/手机／邮箱
      errAgainPwd: "", // 再次输入密码
      checkPwdStrength: 0, // 验证登录密码强度/资金密码强度
      showRule: false, // 是否展示密码规则
      popupTypeList: [
        { // 绑定邮箱
          title: this.intl.get("user-popBindEmail"),
          numTitle: this.intl.get("user-popEmail"),
          numInput: this.intl.get("user-inputEmail"),
          verifyTitle: this.intl.get("user-verifyEmail"),
          verifyInput: this.intl.get("user-inputVerifyEmail"),
          btnTitle: this.intl.get("user-popBind")
        },
        { // 绑定手机
          title: this.intl.get("user-phone-bind"),
          numTitle: this.intl.get("phone"),
          numInput: this.intl.get("user-inputPhone"),
          verifyTitle: this.intl.get("user-verifyPhone"),
          verifyInput: this.intl.get("user-inputVerifyPhone"),
          btnTitle: this.intl.get("user-popBind")
        },
        { // 设置密码
          title: this.intl.get("user-popSetLoginPwd"),
          numTitle: this.intl.get("user-newPwd"),
          numInput: this.intl.get("user-inputNewPwd"),
          numTitle2: this.intl.get("user-inputAgainPwd"),
          numInput2: this.intl.get("pwdSameAgain"),
          btnTitle: this.intl.get("set")
        },
        { // 修改密码
          title: this.intl.get("user-popRecoverLoginPwd"),
          numTitleNew: this.intl.get("user-currentPwd"),
          numInputNew: this.intl.get("user-inputNowPwd"),
          numTitle: this.intl.get("user-newPwd"),
          numInput: this.intl.get("user-inputNewPwd"),
          numTitle2: this.intl.get("user-inputAgainPwd"),
          numInput2: this.intl.get("pwdSameAgain"),
          btnTitle: this.intl.get("alter")
        },
        { // 设置资金密码
          title: this.intl.get("user-popSetFundPwd"),
          numTitle: this.intl.get("user-newPwd"),
          numInput: this.intl.get("user-inputNewPwd"),
          numTitle2: this.intl.get("user-inputAgainPwd"),
          numInput2: this.intl.get("pwdSameAgain"),
          verifyTitle: this.props.fundPassType === 3 ? this.intl.get("user-verifyPhone") : this.intl.get("user-verifyEmail"),
          verifyInput: this.props.fundPassType === 3 ? this.intl.get("user-inputVerifyPhone") : this.intl.get("user-inputVerifyEmail"),
          btnTitle: this.intl.get("save")},
        { // 修改资金密码
          title: this.intl.get("user-popRecoverFundPwd"),
          numTitle: this.intl.get("user-newPwd"),
          numInput: this.intl.get("user-inputNewPwd"),
          numTitle2: this.intl.get("user-inputAgainPwd"),
          numInput2: this.intl.get("pwdSameAgain"),
          verifyTitle: this.props.fundPassType === 3 ? this.intl.get("user-verifyPhone") : (this.props.fundPassType === 1 ? this.intl.get("user-verifyEmail") : this.intl.get("user-popGoole")),
          verifyInput: this.props.fundPassType === 3 ? this.intl.get("user-inputVerifyPhone") : (this.props.fundPassType === 1 ? this.intl.get("user-inputVerifyEmail") : this.intl.get("user-inputVerifyGoogle")),
          btnTitle: this.intl.get("save")
        },
        { // 解绑手机
          title: "修改手机号",
          numTitle: "新手机号",
          numInput: this.intl.get("user-inputPhone"),
          verifyTitle: this.intl.get("user-verifyPhone"),
          verifyInput: this.intl.get("user-inputVerifyPhone"),
          btnTitle: "确定"
        },
      ]
    }
  }

  componentDidMount() {
    this.props.errState && this.props.clearErrState();
  }

  componentWillUnmount() {
    this.props.destroy && this.props.destroy();
  }

  // 输入部分
  changeCurrentPwd(value) { // 当前密码输入框
    this.setState({currentPwdValue: value.trim()});
    this.props.errState && this.props.clearErrState();
  }

  changeUser(value) { // 手机号／邮箱／新密码输入框
    let pwdS = CheckPwdStrength.CheckPwdStrength(value.trim()),
        fundPwdS = CheckPwdStrength.CheckFundPwdStrength(value.trim());
    if ([3, 4].includes(this.props.isType)) { // 验证登录密码
      this.setState({checkPwdStrength: pwdS});
    }
    if ([5, 6].includes(this.props.isType)) { // 验证登录密码
      this.setState({checkPwdStrength: fundPwdS});
    }
    this.setState({userValue: value.trim()});
    this.state.errUser && (this.setState({errUser: ""}));
    this.props.errState && this.props.clearErrState();
    this.state.errAgainPwd && (this.setState({errAgainPwd: ""}));
  }

  changeAgainPwd(value) { // 再次输入密码
    this.setState({againPwdValue: value.trim()});
    this.state.errAgainPwd && (this.setState({errAgainPwd: ""}));
    this.props.errState && this.props.clearErrState();
  }

  changePicture(value) { // 输入图形验证码
    this.setState({pictureValue: value.replace(/\D/g, '').trim()});
    this.props.errState && this.props.clearErrState();
  }

  changeVerify(value) { // 输入验证码
    this.setState({verifyValue: value.replace(/\D/g, '').trim()});
    this.props.errState && this.props.clearErrState();
  }

  changeGoogle(value) {  // 输入谷歌验证码
    this.setState({googleValue: value.replace(/\D/g, '').trim()});
    this.props.errState && this.props.clearErrState();
  }

  // 检验部分
  checkUser = () => { // 检验邮箱、手机、密码、资金密码
    let reg1 = Regular('regEmail', this.state.userValue), // 邮箱
        reg2 = Regular('regPwd', this.state.userValue), // 密码
        reg3 = Regular('regPhone', this.state.userValue), // 手机
        reg4 = Regular('regFundPwd', this.state.userValue); // 资金密码

    if (this.props.isType === 1) { // 验证邮箱
      if(!reg1) {
        this.setState({
          errUser: this.intl.get("user-checkEmail")
        })
      }
    }

    if (this.props.isType === 2) { // 验证手机
      if(!reg3) {
        this.setState({
          errUser: this.intl.get("user-checkPhone")
        })
      }
    }

    if ([3, 4].includes(this.props.isType)) { // 验证登录密码
      this.setState({showRule: false})
      if(!reg2) {
        this.setState({
          errUser: this.intl.get("user-checkNewPwd")
        })
      }
      if(this.state.againPwdValue && (this.state.userValue !== this.state.againPwdValue)) {
        this.setState({
          errAgainPwd: this.intl.get("user-checkAgainPwd")
        })
      }
      if (reg2 && (this.state.againPwdValue === this.state.userValue)) {
        this.state.errAgainPwd && (this.setState({errAgainPwd: ""}))
      }
    }

    if ([5, 6].includes(this.props.isType)) { // 验证资金密码
      this.setState({showRule: false})
      if(!reg4) {
        this.setState({
          errUser: this.intl.get("user-checkNewPwd")
        })
      }
      if(this.state.againPwdValue && (this.state.userValue !== this.state.againPwdValue)) {
        this.setState({
          errAgainPwd: this.intl.get("user-checkAgainPwd")
        })
      }
      if (reg4 && (this.state.againPwdValue === this.state.userValue)) {
        this.state.errAgainPwd && (this.setState({errAgainPwd: ""}))
      }
    }
  };

  checkRule = () => { // 显示密码规则
    if ([3,4,5, 6].includes(this.props.isType)) {
      this.setState({
        showRule: true
      })
    }
  }

  checkAgainPwd = () => { // 检验在输入一次密码
    let reg = Regular('regPwd', this.state.againPwdValue), // 密码
        reg2 = Regular('regFundPwd', this.state.againPwdValue); // 资金密码

    if ([3, 4].includes(this.props.isType)) { // 再次输入密码
      if(!this.state.userValue && !reg) {
        this.setState({
          errAgainPwd: this.intl.get("user-checkNewPwd")
        });
        return
      }
      if(this.state.userValue && (this.state.againPwdValue !== this.state.userValue)) {
        this.setState({
          errAgainPwd: this.intl.get("user-checkAgainPwd")
        })
      }
      if (reg && (this.state.againPwdValue === this.state.userValue)) {
        this.state.errAgainPwd && (this.setState({errAgainPwd: ""}))
      }
    }
    if ([5, 6].includes(this.props.isType)) { // 再次输入密码
      if(!this.state.userValue && !reg2) {
        this.setState({
          errAgainPwd: this.intl.get("user-checkNewPwd")
        });
        return
      }
      if(this.state.userValue && (this.state.againPwdValue !== this.state.userValue)) {
        this.setState({
          errAgainPwd: this.intl.get("user-checkAgainPwd")
        })
      }
      if (reg2 && (this.state.againPwdValue === this.state.userValue)) {
        this.state.errAgainPwd && (this.setState({errAgainPwd: ""}))
      }
    }
  };

  canClick() {
    if (this.state.errUser || this.state.errAgainPwd || this.props.errState) return false;
    if ((this.props.isType === 1 || this.props.isType === 2) && this.state.userValue && this.state.pictureValue && this.state.verifyValue) return true; // 绑定
    if (this.props.isType === 3 && this.state.userValue && this.state.againPwdValue) return true; // 设置登录密码
    if (this.props.isType === 4 && this.state.currentPwdValue && this.state.userValue && this.state.againPwdValue) return true; // 修改登录密码
    if (this.props.isType === 5 && this.state.userValue && this.state.againPwdValue && this.state.pictureValue && this.state.verifyValue) return true; // 设置资金密码
    if (this.props.isType === 6 && this.state.userValue && this.state.againPwdValue && this.state.pictureValue && (this.state.verifyValue || this.state.googleValue)) return true; // 修改资金密码
    return false
  }

  renderSelectBtn = (type) => { // 根据传入参数生成提交button
    let clickType, // 选择点击事件
        userValue = this.state.userValue, // 手机号/邮箱/密码
        typeFlag = 0, // 参数类型
        verifyValue = this.state.verifyValue, // 验证码
        captchaId = this.props.captchaId, // 图形验证码Id
        pictureValue = this.state.pictureValue, // 图形验证码
        currentPwdValue = this.state.currentPwdValue, // 当前密码
        fundValue = this.props.fundPassType === 3 ? this.props.phone : (this.props.fundPassType === 1 ? this.props.email : ''), // 资金密码信息
        fundType = this.props.fundPassType === 3 ? 0 : (this.props.fundPassType === 1 ? 1 : 2), // 资金密码类型
        fundTypeValue = this.props.fundPassType === 2 ? this.state.googleValue : this.state.verifyValue, // 资金密码验证码
        btnClickArr = [ // 事件数组
          () => this.props.bindUser(userValue, typeFlag, verifyValue, captchaId, pictureValue),
          () => this.props.setLoginPass(currentPwdValue, userValue, typeFlag),
          () => this.props.modifyFundPwd(fundValue, fundType, typeFlag, userValue, pictureValue, captchaId, fundTypeValue)
        ];

    if ([1, 4, 6].includes(type)) { // 绑定邮箱／修改密码／修改资金密码
      typeFlag = 1
    }
    if (type === 3) { // 设置密码
      currentPwdValue = ''
    }
    if ([1, 2].includes(type)) { // 绑定手机邮箱
      clickType = 0
    }
    if ([3, 4].includes(type)) { // 设置修改密码
      clickType = 1
    }
    if ([5, 6].includes(type)) { // 设置资金密码
      clickType = 2
    }

    return (
      <Button
        title={type && this.state.popupTypeList[type - 1].btnTitle}
        className={`${this.canClick() ? 'can-click' : ''} set-btn btn`}
        disable={this.canClick() ? false : true}
        onClick={() => btnClickArr[clickType]()}
      />
    )
  };

  renderVerifyBtn = (type) => { // 根据参数生成倒计时按钮
    let userValue = this.state.userValue, // 信息接收对象
        userType = 1, // 接收对象类型
        verifyType = 3, // 发送类型
        clickFlag = true; // 能否点击
    if (type === 1) {  // 绑定邮箱
      clickFlag = Regular('regEmail', this.state.userValue)
    }
    if ([2, 7].includes(type)) {  // 绑定修改手机号
      userType = 0;
      clickFlag = Regular('regPhone', this.state.userValue)
    }
    if ([5, 6].includes(type)) { // 设置资金密码
      userValue = this.props.fundPassType === 3 ? this.props.phone : this.props.email;
      userType = this.props.fundPassType === 3 ? 0 : 1;
      verifyType = this.props.isType
    }

    return (
      <Button
        title={typeof this.props.verifyNum === 'number' && (this.props.verifyNum === 0 && this.intl.get("sendAgain") || `${this.props.verifyNum}s`) || this.props.verifyNum}
        className={`${(typeof this.props.verifyNum === 'number' && this.props.verifyNum !== 0) ? 'disabled-btn' : ''}  ${clickFlag ? '' : 'disabled-btn'} verify-btn btn`}
        onClick={() => {clickFlag && this.props.getVerify(userValue, userType, verifyType)}}
      />
    )
  };

  render() {
    return (
      <div className="pass-wrap">
        <div className="pass-info">
          <div className="title-wrap clearfix">
            <img src={GUANBI_HEI} alt="" className="close-popup" onClick={() => {this.props.onClose && this.props.onClose()}}/>
            <h1 className="pop-title">{this.props.isType && this.state.popupTypeList[this.props.isType - 1].title}</h1>
          </div>
          <div className="clearfix">
            <ul>
              <li className={`${[4].includes(this.props.isType) ? 'long-li' : 'hide'} err-parent`}>
                <p>{this.props.isType && this.state.popupTypeList[this.props.isType - 1].numTitleNew}</p>
                <Input placeholder={this.props.isType && this.state.popupTypeList[this.props.isType - 1].numInputNew}
                       value={this.state.currentPwdValue}
                       oriType={[4].includes(this.props.isType) ? 'password' : 'text'}
                       className={this.state.currentPwdValue && [631].includes(this.props.errCode) ? 'err-input' : ''}
                       onInput={value => this.changeCurrentPwd(value)}/>
                {[631].includes(this.props.errCode) && this.props.errState && <em className="err-children">{this.props.errState}</em>}
              </li>
              <li className="long-li err-parent pass-li">
                <p>{this.props.isType && this.state.popupTypeList[this.props.isType - 1].numTitle}</p>
                <Input placeholder={this.props.isType && this.state.popupTypeList[this.props.isType - 1].numInput}
                       value={this.state.userValue}
                       onInput={value => this.changeUser(value)}
                       maxlength={[3, 4, 5, 6].includes(this.props.isType) ? 36 : ''}
                       oriType={[3, 4, 5, 6].includes(this.props.isType) ? 'password' : 'text'}
                       className={this.state.userValue && (this.state.errUser || [610, 623].includes(this.props.errCode)) ? 'err-input' : ''}
                       onFocus={this.checkRule}
                       onBlur={this.checkUser}/>
                {[610, 623].includes(this.props.errCode) ? (
                  [610, 623].includes(this.props.errCode) && this.props.errState && <em className="err-children">{this.props.errState}</em>
                ) : (
                  this.state.userValue && this.state.errUser && <em className="err-children">{this.state.userValue && this.state.errUser}</em>
                )}
                {[3, 4].includes(this.props.isType) && this.state.showRule && <PwdRuleBox />}
                {[5, 6].includes(this.props.isType) && this.state.showRule && <PwdRuleBox type={0}/>}
              </li>
              {[3, 4, 5, 6].includes(this.props.isType) && this.state.checkPwdStrength && <li className="pwd-strength-li">
                <PwdStrengthLine flag={this.state.checkPwdStrength}/>
              </li> || null}
              <li className={`${[3, 4, 5, 6].includes(this.props.isType) ? 'long-li' : 'hide'} err-parent`}>
                <p>{this.props.isType && this.state.popupTypeList[this.props.isType - 1].numTitle2}</p>
                <Input placeholder={this.props.isType && this.state.popupTypeList[this.props.isType - 1].numInput2}
                       value={this.state.againPwdValue}
                       maxlength="32"
                       onInput={value => this.changeAgainPwd(value)}
                       oriType={[3, 4, 5, 6].includes(this.props.isType) ? 'password' : 'text'}
                       className={this.state.againPwdValue && this.state.errAgainPwd ? 'err-input' : ''}
                       onBlur={this.checkAgainPwd}/>
                {this.state.againPwdValue && this.state.errAgainPwd && <em className="err-children">{this.state.againPwdValue && this.state.errAgainPwd}</em>}
              </li>
              {/*图形验证码*/}
              <li className={`${[3, 4, 7].includes(this.props.isType) ? 'hide' : ''} err-parent`}>
                <p>{this.intl.get("user-popPicture")}</p>
                <div className="clearfix pass-btn-group">
                  <Input placeholder={this.intl.get("user-popPicturePlaceholder")}
                         value={this.state.pictureValue}
                         className={this.props.errCode === 619 && this.props.errState ? 'err-input' : ''}
                         onInput={value => this.changePicture(value)}/>
                  <img src={this.props.captcha || ''} alt="" className="picture-btn btn" onClick={this.props.getCaptcha}/>
                </div>
                {this.props.errCode === 619 && this.props.errState && <em className="err-children">{this.props.errState}</em>}
              </li>
              {/*修改手机号验证码*/}
              <li className={`${this.props.isType === 7 ? 'long-li' : 'hide'} err-parent`}>
                <p>{this.props.isType && this.state.popupTypeList[this.props.isType - 1].verifyTitle}</p>
                <div className="clearfix verify-div">
                  <Input placeholder={this.props.isType && this.state.popupTypeList[this.props.isType - 1].verifyInput} value={this.state.verifyValue} onInput={value => this.changeVerify(value)}/>
                  <Button title={typeof this.props.verifyNum === 'number' && (this.props.verifyNum === 0 && this.intl.get("sendAgain") || `${this.props.verifyNum}s`) || this.props.verifyNum}
                          className="verify-btn btn"
                          onClick={() => {Regular('regEmail', this.state.userValue) && this.props.getVerify(this.state.userValue, 1, 3)}}
                  />
                </div>
                {this.props.errState && <em className="err-children">{this.props.errState}</em>}
              </li>
              {/*短信／邮箱验证码*/}
              <li className={`${([3, 4].includes(this.props.isType) || (this.props.isType === 6 && this.props.fundPassType === 2)) ? 'hide' : ''} err-parent long-li`}>
                <p>{this.props.isType && this.state.popupTypeList[this.props.isType - 1].verifyTitle}</p>
                <div className="clearfix verify-div">
                  <Input placeholder={this.props.isType && this.state.popupTypeList[this.props.isType - 1].verifyInput}
                         value={this.state.verifyValue}
                         className={[607, 608].includes(this.props.errCode) && this.props.errState ? 'err-input' : ''}
                         onInput={value => this.changeVerify(value)}/>
                  {this.renderVerifyBtn(this.props.isType)}
                </div>
                {[607, 608].includes(this.props.errCode) && this.props.errState && <em className="err-children">{this.props.errState}</em>}
              </li>
              <li className={`${(this.props.isType === 6 && this.props.fundPassType === 2) || this.props.isType === 7 ? 'long-li' : 'hide'} err-parent`}>
                <p>{this.intl.get("user-popGoole")}</p>
                <Input placeholder= {this.intl.get("user-inputVerifyGoogle")}
                       value={this.state.googleValue}
                       className={this.props.errCode === 2001 && this.props.errState ? 'err-input' : ''}
                       onInput={value => this.changeGoogle(value)}/>
                {this.props.errCode === 2001 && this.props.errState && <em className="err-children">{this.props.errState}</em>}
              </li>
              <li className={[4, 6].includes(this.props.isType) ? 'remind-pass-li' : 'hide'}>
                <p>{this.intl.get("user-popFundRule")}</p>
              </li>
              <li className={[2].includes(this.props.isType) ? 'remind-pass-li' : 'hide'}>
                <p>*{this.intl.get("user-supportPhone")}</p>
              </li>
              <li className="set-btn-li">{this.renderSelectBtn(this.props.isType)}</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
