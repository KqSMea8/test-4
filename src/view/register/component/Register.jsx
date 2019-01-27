import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import "./style/register.styl"
import ExchangeViewBase from "@/components/ExchangeViewBase";
import Button from '@/common/baseComponent/Button/index.jsx'
import Popup from '@/common/baseComponent/Popup/index.jsx'
import Input from '@/common/baseComponent/Input/index.jsx'
import PwdStrengthLine from '@/common/component/PwdStrengthLine/index.jsx'
import PwdRuleBox from '@/common/component/PwdRuleBox/index.jsx'
import {Regular, CheckPwdStrength} from '@/core'
// import QRCode from "qrcode-react"
import QRCode from "@/common/component/QRcodeCreater";

import Translate from "@/core/libs/Translate";
import RegisterLang from "../lang";
import { COMMON_CHECKBOX_SELECT, POST_BG_ZH, POST_BG_EN, POST_LOGO } from '@/config/ImageConfig';
import {
  resolveLoginPath,
  goLoginPath,
  resolveHelpPath,
  getQueryFromPath
} from "@/config/UrlConfig"

class Register extends ExchangeViewBase {
  constructor(props) {
    super(props);
    this.name = 'login';
    this.state = {
      titleList: [this.intl.get("phoneRegister"), this.intl.get("emailRegister")],
      titleIndex: 0, // 点击下标
      userInput: "",
      passInput: "",
      codeInput: "",
      againInput: "",
      verifyNum: this.intl.get("sendCode"),
      showPopup: false, // 提示弹窗
      popType: "tip1",
      popMsg: "登录成功",
      showTwoVerify: false,
      verifyType: "", // 密码登录两步认证弹窗
      checkState: true, // checkbox判断
      userErr: "", // 手机号/邮箱错误
      errCode: 0, // 密码错误禁止输入错误码
      errState: "", // 根据后台错误码显示错误
      twoVerifyUser: "", // 两步认证用户信息
      // from: props.location.state && props.location.state.from.pathname || '/home',
      from: '/home',
      errPassAgain: "",
      errPass: "",
      showRule: false,
      checkPwdStrength: 0,
      registerFlag: true, // 注册防连点

      //注册活动
      succPopup: false,
      awardNum: 0,
      uid: '',
      poster: '',
      showPoster: false,
      imgFlag: false,
      quid: getQueryFromPath('in') ? getQueryFromPath('in') : getQueryFromPath('uid')
    }
    const {controller, match} = props
    //绑定view
    controller.setView(this)
    //初始化数据，数据来源即store里面的state
    this.history = props.history
    this.state = Object.assign(this.state, controller.initState);
    // let query = match.params && match.params.in || null;
    // this.state.query = query
    this.getVerify = controller.getVerify.bind(controller);
    this.clearVerify = controller.clearVerify.bind(controller);
    this.destroy = controller.clearVerify.bind(controller); // 清除定时器
    this.register = controller.register.bind(controller); // 注册
    // this.getAward = controller.getAward.bind(controller); // 邀请活动
    // 添加统计数
    this.sendStatis = controller.configController.sendStatis.bind(controller.configController)
  }

  componentWillMount() {
    // this.props.controller.Storage.userToken.get() && (this.props.history.push({pathname:"/home"}));
  }

  componentDidMount() {
    // let queryIndex = this.props.location.query && this.props.location.query.titleIndex
    // if (queryIndex) {
    //   this.setState({
    //     titleIndex: queryIndex
    //   })
    // }
  }

  componentWillUpdate(...parmas) {

  }

  componentDidUpdate(preProps, preState) {

  }

  componentWillUnmount() {
    this.destroy()
  }

  changeTitle(i) { // 注册切换
    this.setState({
      titleIndex: i,
      userInput: "",
      codeInput: "",
      passInput: "",
      againInput: "",
      userErr: "", // 手机号/邮箱错误
      verifyNum: this.intl.get("sendCode"),
      getClick: false,
      errCode: 0,
      errState: '',
      errPassAgain: "",
      errPass: "",
      checkPwdStrength: 0
    });
    this.clearVerify();
  }

  changeUser(value) { // 用户
    let reg1 = Regular('regPhone', value.trim()),
      reg2 = Regular('regEmail', value.trim()),
      flag = this.state.titleIndex,
      regArr = [reg1, reg2];
    this.setState({
      userInput: value.trim()
    });
    this.state.userErr && (this.setState({userErr: ""}));
    this.state.errState && (this.setState({errState: ""}));
    if (regArr[flag]) {
      this.setState({
        getClick: true
      });
      return
    }
    this.setState({
      getClick: false
    });
  }

  changePass(value) { // 密码
    let pwdS = CheckPwdStrength.CheckPwdStrength( value.trim());
    this.setState({
      passInput: value.trim(),
      checkPwdStrength: pwdS
    });
    this.state.errPass && (this.setState({errPass: ""}))
    this.state.errPassAgain && (this.setState({errPassAgain: ""}))
  }

  changeAgain(value) { // 再次输入密码
    this.setState({againInput: value.trim()});
    this.state.errPassAgain && (this.setState({errPassAgain: ""}))
  }

  changeCode(value) { // 验证码
    this.setState({codeInput: value.replace(/\D/g, '').trim()});
    this.state.errState && (this.setState({errState: ""}))
  }

  checkRule = () => { // 显示密码规则
    this.setState({
      showRule: true
    })
  }

  canClick() {
    let {userErr, errState, errPass, errPassAgain, checkState, userInput, codeInput, passInput, againInput} = this.state;
    if (userErr || errState || errPass || errPassAgain) return false;
    if (checkState && userInput && codeInput && passInput && againInput) return true;
    return false
  }

  checkUser = () => {
    this.setState({
      checkState: !this.state.checkState
    })
  };

  // 检验部分
  checkUserInput = () => { // 手机号／邮箱
    let reg1 = Regular('regPhone', this.state.userInput), // 手机
      reg2 = Regular('regEmail', this.state.userInput), // 邮箱
      flag = this.state.titleIndex,
      errArr = [this.intl.get("register-checkPhone"), this.intl.get("register-checkEmail")],
      regArr = [reg1, reg2];
    if (!regArr[flag]) {
      this.setState({
        userErr: errArr[flag]
      })
    }
  };

  checkPass = () => { // 密码
    let reg = Regular('regPwd', this.state.passInput); // 密码
    this.setState({
      showRule: false
    })
    if(!reg) {
      this.setState({
        errPass: this.intl.get("register-checkNewPwd")
      });
      return
    }
    if(this.state.againInput && (this.state.againInput !== this.state.passInput)) { // 两次密码不一致
      this.setState({
        errPassAgain: this.intl.get("register-checkAgainPwd")
      })
    }
    if (reg && (this.state.againInput === this.state.passInput)) { // 两次密码一致
      this.state.errPassAgain && (this.setState({errPassAgain: ""}))
    }
  };

  checkAgain = () => { // 再次输入密码
    let reg = Regular('regPwd', this.state.againInput); // 再次输入密码
    if(!this.state.passInput && !reg) { // 密码格式不对
      this.setState({
        errPassAgain: this.intl.get("register-checkNewPwd")
      });
      return
    }
    if(this.state.passInput && (this.state.againInput !== this.state.passInput)) { // 两次密码不一致
      this.setState({
        errPassAgain: this.intl.get("register-checkAgainPwd")
      })
    }
    if (reg && (this.state.againInput === this.state.passInput)) { // 两次密码一致
      this.state.errPassAgain && (this.setState({errPassAgain: ""}))
    }
  };

  handlerRegister = async () => { // 登录事
    // console.log(1111, this.state.query)
    // let res = this.state.query && await this.getAward(this.state.userInput) || true;
    // if (!res) return;
    this.register(this.state.userInput, this.state.passInput, this.state.codeInput, this.state.titleIndex, this.state.quid)
  };

  copy = el => {
    this.sendStatis({
      event: 'activityClick',//操作代码
      type: 'Activity_C_Link_Web',//tab
    });
    if(!this.state.uid) {
      this.setState({
        showPopup: true,
        popType: 'tip3',
        popMsg: this.intl.get("code-error"),
      });
      return
    }
    let link = this.shareLink();
    el.value = `${link} ${el.value}`;
    if (!this.props.controller.copy(el)) {
      this.props.controller.popupController.setState({
        isShow: true,
        type: 'tip3',
        msg: this.intl.get('copyErr'),
        autoClose: true
      });
      return
    }
    this.props.controller.popupController.setState({
      isShow: true,
      type:'tip1',
      msg: this.intl.get("register-inviteLindSucc"),
      // onClose: ()=>{this.props.history.push({pathname:'/login'})},
      autoClose: true
    })
  };

  shareLink = () => {
    let linkList = {
      qe: this.intl.get("register-invite"),
      sd: this.intl.get("register-invite-11")
    };
    let link = '';
    for (let key in this.props.controller.configController.activityState) {
      if (this.props.controller.configController.activityState[key] === 1) {
        link = linkList[key];
        break;
      }
    }
    return link
  };

  getPoster = async() => {
    this.sendStatis({
      event: 'activityClick',//操作代码
      type: 'Activity_C_Poster_Web',//tab
    });
    if(this.state.poster) {
      this.setState({
        showPoster: true,
        succPopup: false
      });
      return
    }
    if(!this.state.uid) {
      this.setState({
        showPopup: true,
        popType: 'tip3',
        popMsg: this.intl.get("code-error"),
      });
      return
    }
    let canvas = document.querySelector('#webInvite-poster'),
      // image = document.querySelector('.poster'),
      code = document.querySelector('.qrcode').querySelector('canvas'),
      ctx = canvas.getContext('2d'),
      lang = this.props.controller.configController.language,
      postBg = this.props.controller.configController.language === 'zh-CN' ? POST_BG_ZH : POST_BG_EN;
    const image = new Image();
    fetch(postBg, {
      // mode: 'cors',
      // headers: {
      //   "Content-Type": "application/json",
      // },
    }).then(response=>response.blob()).then(myBlob=> {
      let objectURL = URL.createObjectURL(myBlob);
      image.onload = () => {
        ctx.drawImage(image, 0, 0);
        lang=== 'zh-CN' && ctx.drawImage(code, 205, 750, 165, 165);
        lang=== 'en-US' && ctx.drawImage(code, 207, 752, 165, 165);
        let src = canvas.toDataURL();
        this.setState({
          poster: src,
          showPoster: true,
          succPopup: false
        })
      };
      image.src = objectURL;
    })
  }

  render() {
    let language = this.props.controller.configController.language,
      reg1 = Regular('regPhone', this.state.userInput), // 手机
      reg2 = Regular('regEmail', this.state.userInput), // 邮箱
      flag = this.state.titleIndex,
      regArr = [reg1, reg2];
    const activityState = this.props.controller.configController.activityState;
    return (
      <div className="register-wrap-con">
        <div className="register-wrap">
          <h1 className={language === 'en-US' ? 'h1-en' : ''}>
            {this.state.titleList.map((v, index) => (
              <span key={index} className={this.state.titleIndex === index ? 'active' : ''}
                    onClick={i => this.changeTitle(index)}>{v}</span>))}
          </h1>
          <ul>
            <li className="err-parent">
              <Input placeholder={this.state.titleIndex ? this.intl.get('register-inputEmail') : this.intl.get('register-inputPhone')}
                     value={this.state.userInput}
                     onInput={value => this.changeUser(value)}
                     className={this.state.userInput && this.state.userErr ? 'err-input' : ''}
                     onBlur={this.checkUserInput}/>
              {this.state.userInput && this.state.userErr && <em className="err-children">{this.state.userInput && this.state.userErr}</em>}
              {[623].includes(this.state.errCode) && this.state.errState && <em className="err-children">{[623].includes(this.state.errCode) ? this.state.errState : ''}</em>}
            </li>
            <li className="send-code-li err-parent">
              <div className="clearfix send-code-div">
                <Input placeholder={this.state.titleIndex ? this.intl.get('register-inputVerifyEmail') : this.intl.get('register-inputVerifyPhone')}
                       value={this.state.codeInput}
                       className={[607, 608].includes(this.state.errCode) && this.state.errState ? 'err-input' : ''}
                       onInput={value => this.changeCode(value)}/>
                <Button className={`${(typeof this.state.verifyNum === 'number' && this.state.verifyNum !== 0) ? 'disabled-btn' : ''} ${this.state.getClick ? 'can-click' : ''} send-code-btn`}
                        title={typeof this.state.verifyNum === 'number' && (this.state.verifyNum === 0 && this.intl.get("sendAgain") || `${this.state.verifyNum}s`) || this.state.verifyNum}
                        onClick={() => {regArr[flag] && this.getVerify(this.state.userInput, this.state.titleIndex, 0)}}/>
              </div>
              {[607, 608].includes(this.state.errCode) && this.state.errState && <em className="err-children">{[607, 608].includes(this.state.errCode) ? this.state.errState : ''}</em>}
            </li>
            <li className="err-parent pass-li">
              <Input placeholder={this.intl.get("register-inputNewPwd")}
                     className={this.state.passInput && this.state.errPass ? 'err-input' : ''}
                     maxlength="32"
                     oriType="password"
                     value={this.state.passInput}
                     onBlur={this.checkPass}
                     onFocus={this.checkRule}
                     onInput={value => this.changePass(value)}/>
              {this.state.showRule && <PwdRuleBox />}
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
                     onBlur={this.checkAgain}
                     onInput={value => this.changeAgain(value)}/>
              {this.state.againInput && this.state.errPassAgain && <em className="err-children">{this.state.againInput && this.state.errPassAgain}</em>}
            </li>
            <li className="checkbox-li">
              <p onClick={this.checkUser}>
                {this.state.checkState ? (<img src={COMMON_CHECKBOX_SELECT} alt=""/>) : (<span></span>)}
              </p>
              {this.intl.get("register-read")}
              <a href={resolveHelpPath('/terms')} target="_blank" className="userAgree">{this.intl.get("login-readUser")}</a>
            </li>
            <li className="register-btn-li">
              <Button
                title={this.intl.get('header-regist')}
                className={`${this.canClick() ? 'can-click' : ''} login-btn`}
                disable={this.canClick() ? false : true}
                onClick={this.handlerRegister}/>
            </li>
            <li className="go-login-li">{this.intl.get("register-account")}<a href={resolveLoginPath()}>{this.intl.get("register-login")}</a></li>
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

        {/*//注册活动弹窗*/}
        {this.state.succPopup && (
          <div className="succ-popup-wrap" onClick={()=>{goLoginPath()}}>
            <div className="succ-con">
              <div>
                <p>{`${this.intl.get("register-reg-alert")}${this.intl.get("register-reg-nameUsd", {num:this.state.awardNum})}!`}</p>
                <p>{activityState.qe ? this.intl.get('register-inviteLindGet2') : this.intl.get('register-inviteLindGet')}</p>
                <span>{this.intl.get('register-inviteLind')}：</span>
                <input type="text" value={this.props.controller.activityController.shareAddress(this.state.uid)} readOnly="readonly" ref="address"/>
              </div>
              <div className="btn-grounp">
                <button className="copy-btn" onClick={(e) => {e.stopPropagation(); this.copy(this.refs.address);}}>{this.intl.get('copyLink')}</button>
                <button onClick={e => {e.stopPropagation(); this.getPoster()}}>{this.intl.get("createPoster")}</button>
              </div>
              {/*<img src={this.$imagesMap.$h5_act_reg_gift} className="gift-img" alt=""/>*/}
              {/*<p>{`${this.intl.get("register-reg-alert")}${this.intl.get("register-reg-nameUsd", {num:this.state.awardNum})}`}</p>*/}
            </div>
          </div>
        )}
        <div style={{display: 'none'}}>
          {/*<img className='poster' src={POST_BG} crossOrigin="anonymous" onLoad={this.loadImg}/>*/}
          <div className="qrcode">
            <QRCode value={this.props.controller.activityController.shareAddress(this.state.uid)}  size={400} logo={POST_LOGO}/>
          </div>
          <canvas id="webInvite-poster" width="578" height="1026" ></canvas>
        </div>
        {
          this.state.showPoster && <div className="post-wrap" onClick={()=>{this.setState({showPoster: false}); goLoginPath()}}>
            <img src={this.state.poster} alt="" crossOrigin="anonymous" onClick={(e)=>{e.stopPropagation()}}/>
          </div>
        }
      </div>
    );
  }
}

export default Translate(Register, RegisterLang)