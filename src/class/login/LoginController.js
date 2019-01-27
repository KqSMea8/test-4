
import Util from "@/core/libs/GlobalUtil";
import Sleep from "@/core/libs/Sleep";
import Storage from "@/core/storage";
import Crypto from "@/core/libs/Crypto"
import copy from '@/core/copy';
import LoginStore from './LoginStore'
import {countDown, countDownStop} from '@/core/countDown'
import {Regular} from "../../core";
import {
  goHomePath,
  goLoginPath,
} from "@/config/UrlConfig"

export default class LoginController {
  constructor(props) {
    this.store = new LoginStore();
    this.store.setController(this);
    this.getWatchToken = this.store.getWatchToken;
    this.Sleep = Sleep;
    this.Storage = Storage;
    this.RSAencrypt = Crypto;
    this.countDown = countDown;
    this.countDownStop = countDownStop;
    this.copy = copy;
  }

  setView(view){
    this.view = view;
  }

  setHeaderOutView(view) { // 头部导航view
    this.headerView = view
  }
  get initState() {
    return (this.store && Util.deepCopy(this.store.state)) || {};
  }

  async getVerifyCodeLogin(account, mode, type, os=3) { // 获取短信验证码
    let result = await this.store.Proxy.getVerifyCodeLogin({
      "ac": account, // 手机号或者邮箱
      "mo": mode,//0 phone 1 email
      "ty": type,//0 登录; 1 修改密码; 2 支付; 3 绑定手机／邮箱; 5 设置资金密码 6 修改资金密码 7登陆第二次验证 8提币 9二次验证
      "os": os// 1 android 2 iOS 3 browser 4 h5
    });
    return result
  }

  async getVerify(account, mode, type, os=3) { // 获取验证码
    let reg1 = Regular('regEmail', this.view.state.userInput),
        reg2 = Regular('regPhone', this.view.state.userInput);
    if(!reg1 && !reg2) return;
    if (this.view.state.verifyNum !== this.view.intl.get("sendCode") && this.view.state.verifyNum !== 0) return;
    let result = await this.userController.getCode(account, mode, type, os);
    this.view && this.view.setState({
      popType: result ? 'tip3': 'tip1',
      popMsg: result ? result.msg :this.view.intl.get("sendSuccess"),
      showPopup: true
    });
    if (result) return;
    this.view.setState({verifyNum: 60});
    this.countDown('verifyCountDown', 'verifyNum', this.view);
  }

  clearVerify() { // 清除定时器
    this.countDownStop("verifyCountDown");
  }

  async getCaptchaVerify() { // 获取图形验证码
    let captcha = await this.userController.getCaptcha();
    this.view && this.view.setState({captcha: captcha.data, captchaId: captcha.id})
  }

  login(account, code, type, mode, captchaId, captchaCode, deviceFlag1, deviceFlag2, os=3, ls='exchange_logic_client',) { // websocket请求接口
    if (!this.view.state.verifyType){
      code = this.RSAencrypt(code)
    }
    let obj = {"pa": code, "mo":mode, "pid":captchaId, "pco":captchaCode, "de": `${deviceFlag1}/${deviceFlag2}`, "did": '', os, ls};
    let keyArr = ['ph','em'];
    obj[keyArr[type]] = account;
    this.Storage.mo.set(true);
    this.store.login(obj)
  }

  async userLoginInfo(data) { // 登陆返回信息
    if (data.r === 0 &&  data.d) { // 登陆成功
      this.userController.getUserId(data.d);
      //不是登录页面不跳转
      if(this.view && this.view.name === "login" && window.location.href.includes("login")) {
        location.href = this.Storage.path.get()
      }
      return
    }

    if ([2008, 2009, 2010].includes(data.r)) { // 需要二次验证
      this.view.setState({
        showTwoVerify: true,
        verifyType: data.r,
        twoVerifyUser: data.d.ac,
        verifyNum: this.view.intl.get("sendCode")
      });
      return
    }
    if (data.r !== 0 || data.d === null) {
      this.getCaptchaVerify()
    }
    data = Object.assign(data, data.d);
    this.view && this.view.setState({
      showPopup: data && [607, 608, 619, 631, 2001].includes(data.ret) ? false : true,
      popType: 'tip3',
      loginCode: data.ret,
      loginState: data.msg,
      popMsg: (this.view.state.titleIndex === 0 && data.ret === 604) ? this.view.intl.get("login-wait") : (data.msg || this.view.intl.get("login-err"))
    })
  }

  async loginFirst(account, code, type, mode, captchaId, captchaCode, deviceFlag1, deviceFlag2, os=3) { // http请求接口
    if (!this.view.state.verifyType){
      code = this.RSAencrypt(code)
    }
    let obj = {"pa": code, "mo":mode, "pid":captchaId, "pco":captchaCode, "de": `${deviceFlag1}/${deviceFlag2}`, "did": '', os};
    let keyArr = ['ph','em'];
    obj[keyArr[type]] = account;
    let result = await this.store.Proxy.login(obj)
    if (result.tk) { // 登陆成功
      this.Storage.mo.set(true);
      this.userController.getUserId(result);
      this.store.reLogin()
      return
    }
    if ([2008, 2009, 2010].includes(result.ret)) { // 需要二次验证
      this.view.setState({
        showTwoVerify: true,
        verifyType: result.ret,
        twoVerifyUser: result.ac,
        verifyNum: this.view.intl.get("sendCode")
      });
      return
    }
    this.getCaptchaVerify();
    this.view && this.view.setState({
      showPopup: result.ret && [607, 608, 619, 631, 2001].includes(result.ret) ? false : true,
      popType: 'tip3',
      loginCode: result.ret,
      loginState: result.msg,
      popMsg: (this.view.state.titleIndex === 0 && result.ret === 604) ? this.view.intl.get("login-wait") : (result.msg || this.view.intl.get("login-err"))
    })
  }

  async clearLoginInfo() { // 退出登陆
    this.store.loginOutRemind();
    this.userController.clearUserInfo()
  }

  async loginUpdate(obj) { // 监听退出消息 // 服务器维护 // 其他地方登录 // 登录超时
    this.clearLoginInfo();
    let stateObj = { otherLogin : true , otherLoginCon: obj.ret };
    this.headerView && this.headerView.setState(stateObj);
    await this.Sleep(2000);
    goHomePath();
  }

  // 找回密码
  async forgetLoginPass(account, mode, code, newPass, captchaId, captchaCode, os=3) { // 找回密码
    let result = await this.store.Proxy.forgetLoginPass({
      ac: account,
      mo: mode, // 0 phone 1 email
      co: code,
      np: this.RSAencrypt(newPass),
      pi: captchaId,
      pc: captchaCode,
      os
    });
    // console.log('忘记密码', result)
    this.view.setState({
      showPopup: result && [607, 608, 619].includes(result.ret) ? false : true,
      popType: result ? 'tip3': 'tip1',
      popMsg: result ? result.msg : this.view.intl.get("user-modifiedSucc"),
      errCode: result && result.ret,
      errState: result && result.msg
    });

    if (result === null) {
      setTimeout(() => {
        goLoginPath()
      }, 2000);
      return
    }

    if (result !== null) {
      this.getCaptchaVerify()
    }
  }

  // 注册
  async register(account, pwd, code, type, inviter, os=3) {
    if(this.view && !this.view.state.registerFlag)
      return;
    this.view && this.view.setState({
      registerFlag: false
    });
    let rctToken = await this.getWatchToken('8ccc5ce6b7c4441daa971f5644074bec');//网易云易盾token
    let obj = {"pa":this.RSAencrypt(pwd), "co":code, os, rct: rctToken, "in": inviter},
        keyArr = ['ph','em'];
    obj[keyArr[type]] = account;
    let result = await this.store.Proxy.register(obj);
    if (result !== null) {
      this.view.setState({
        showPopup: result && [607, 608, 623].includes(result.ret) ? false : true,
        popType: 'tip3',
        popMsg: result && result.msg,
        errCode: result && result.ret,
        errState: result && result.msg,
        registerFlag: true
      });
      return
    }
    this.configController.sendStatis({
      event: 'signUpSuccess',//操作代码
      type: 'password',//tab
    });
    let awardResult = await this.activityController.getAward(account, inviter);
    if (this.configController.activityState && (this.configController.activityState.qe || this.configController.activityState.sd)){
      this.view.setState({
        succPopup: (awardResult && awardResult.ret) ? false : true,
        showPopup: (awardResult && awardResult.ret) ? true : false,
        popMsg: awardResult && awardResult.ret && awardResult.msg,
        popType: 'tip3',
        awardNum: awardResult && awardResult.aw,
        uid: awardResult && awardResult.ic
      });
      return
    }
    this.view.setState({
      showPopup: true,
      popType: 'tip1',
      popMsg: this.view.intl.get("register-succ"),
      registerFlag: true
    });
    await this.Sleep(3000);
    goLoginPath()
  }

}