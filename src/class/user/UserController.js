
import Util from "@/core/libs/GlobalUtil";
import Crypto from "@/core/libs/Crypto"
import UserStore from './UserStore'
import copy from '@/core/copy';
import {countDown, countDownStop} from '@/core/countDown'

export default class UserController {
  constructor(props) {
    this.store = new UserStore();
    this.store.setController(this);
    this.RSAencrypt = Crypto;
    this.countDown = countDown;
    this.countDownStop = countDownStop;
    this.copy = copy;
  }

  get configData() {
    return this.configController.initState;
  }
  setView(view) {
    this.view = view;
  }
  get initState() {
    return (this.store && Util.deepCopy(this.store.state)) || {};
  }

  setHeaderUserView(view) {
    this.userHeaderView = view
  }

  //清除用户信息
  clearUserInfo(){
    this.store.clearUserInfo()
  }

  // 获取短信验证码
  async getVerify(account, mode, type, os=3) {
    if (this.view.state.verifyNum !== this.view.intl.get("sendCode") && this.view.state.verifyNum !== 0) return;
    let result = await this.getCode(account, mode, type, os);
    // 通过两步认证、通知设置绑定成功的不显示绑定成功弹窗
    this.view.setState({
      remindPopup: true,
      popType: result ? 'tip3': 'tip1',
      popMsg: result ? result.msg :this.view.intl.get("sendSuccess"),
    });
    if (result) return;
    this.view.setState({verifyNum: 60});
    this.countDown('verifyCountDown', 'verifyNum', this.view);
  }

  // 清除短信验证码
  clearVerify() {
    this.countDownStop('verifyCountDown');
    this.view.setState({verifyNum: this.view.intl.get("sendCode")})
  }

  // 从登录接口获取信息
  getUserId(data) {
    this.store.userLogin(data)
  }

  // 接口调用部分
  async getCaptchaVerify() { // 获取图形验证码
    let captcha = await this.getCaptcha();
    this.view.setState({captcha: captcha.data, captchaId: captcha.id})
  }

  async initData() { // 获取用户信息
    let userInfo = await this.store.userInfo();
    this.userHeaderView && this.userHeaderView.setState({ userInfo })
    return {userInfo};
  }

  async getUserAuthData() { // 获取用户认证信息
    let userAuth = await this.store.userAuth();
    return {userAuth};
  }

  async getCurrentLogin() { // 获取当前登录设备
    let currentLogin = await this.store.currentLogin();
    return {currentLogin}
  }

  async getLoginList() { // 获取登录记录
    let loginList = await this.store.loginList();
    return {loginList}
  }

  async getIpList() { // 获取ip白名单
    let ipList = await this.store.ipList();
    return {ipList}
  }

  async getPaymentAccounts() { // 获取收付款账号列表
    let paymentList = await this.store.getPaymentAccounts();
    this.view && this.view.setState({paymentList});
    return {paymentList}
  }

  async getUserCreditsNum() { // 获取用户积分信息
    let userCreditsNum = await this.store.userCreditsNum();
    this.view.setState({userCreditsNum});
  }

  async getGoogle() { // 获取谷歌密钥
     let googleSecret = await this.store.googleSecret();
    return {googleSecret}
  }

  async getFundPwdLimit() { // 查看资金密码输入间隔
    let fundPwdInterval = await this.store.fundPwdInterval();
    return {fundPwdInterval}
  }

  async getUserCredits(page) { // 获取用户积分信息列表
    let userCredits = await this.store.userCredits(page);
    this.view.setState({userCredits});
    return {userCredits}
  }

  async uploadImg(file) { // 上传图片
    let imgUrl = `image${this.view.state.imgUrlIndex + 1}`,
        res = await this.store.uploadImg(file),
        result = await res.text(),
        obj={};
    obj[imgUrl] = result;
    this.view.setState(obj)
  }

  async uploadErweima(file) { // 上传二维码
    let res = await this.store.uploadImg(file),
        result = await res.text();
    return result
  }

  async uploadInfo(firstName, lastName, name, type, num, img1, img2, img3) { // 身份认证确认提交
    let typeIndexArr = [1, 3, 2], userAuth = this.view.state.userAuth, succObj = {};
    let result = await this.store.Proxy.uploadUserAuth({
      "token": this.store.token,
      "first_name": firstName, // 姓氏
      "last_name": lastName, // 名字
      name, // 名字
      type,  // 0：无 1：身份证 2：驾照 3：护照
      "number": num, // 证件号
      "image1": img1, // 正面照
      "image2": img2, // 背面照
      "image3": img3  // 手持照
    });
    succObj = {
      state: 1,
      firstName: userAuth.number ? userAuth.firstName : this.view.state.firstNameValue,
      lastName: userAuth.number ? userAuth.lastName : this.view.state.lastNameValue,
      number: userAuth.number ? userAuth.number : this.view.state.numberValue
    };
    if (result && result.id) {
      setTimeout(() => {
        userAuth = Object.assign(userAuth, succObj)
      }, 2000)
    }
    this.view.setState({
      // remindPopup: true,
      remindPopup: true,
      popType: result && result.id ? 'tip1' : 'tip3',
      popMsg: result && result.id ? this.view.intl.get("user-photoSucc") : result.msg, // 上传成功
      userAuth,
      checkVerifyArr: result && result.id ? false : true,
      errCode: result && result.id ? 0 : result.ret,
      errState: result && result.id ? '' : result.msg
    })
  }

  async bindUser(account, mode, code, captchaId, captchaCode) { // 绑定邮箱／手机号
    if(!this.view.state.setPassFlag)
      return;
    this.view.setState({
      setPassFlag: false
    });
    let result = await this.store.Proxy.bindUser({
      token: this.store.token,
      ac: account,// 手机号或邮箱
      mo: mode,// 0:phone 1:email
      co: code,
      cid: captchaId, // 图形验证码id，没有就传空
      cco: captchaCode, // 图形验证码，没有就传空
      os: 3, // 1:android 2:iOS 3:borwser
    });
    // 通过两步认证、通知设置绑定成功的不显示绑定成功弹窗
    this.view.setState({
      remindPopup: result && [607, 608, 619, 623].includes(result.ret) ? false : ([1, 2].includes(this.view.state.bindOrigin) ? (result && true) : true),
      popType: [1, 2].includes(this.view.state.bindOrigin) ? (result && 'tip3') : (result ? 'tip3': 'tip1'),
      popMsg: [1, 2].includes(this.view.state.bindOrigin) ? (result && result.msg) : (result ? result.msg : this.view.intl.get("user-bindSucc")),
      showSet: result ? true : false,
      setPassFlag: true,
      errCode: result && result.ret,
      errState: result && result.msg
    });
    if (result === null) {
      this.view.setState({
        userInfo: mode === 0 ?  Object.assign(this.view.state.userInfo, {phone: account}) : Object.assign(this.view.state.userInfo, {email: account}),
      });
      this.getCaptchaVerify();
      this.getUserCreditsNum();
      if (this.view.state.bindOrigin === 1) {
        this.view.selectType(this.view.state.isTwoVerify, this.view.state.twoVerifyTitle, this.view.state.twoVerifyCon);
        return
      }
      if (this.view.state.bindOrigin === 2) {
        this.setUserNotify(this.view.state.noticeContent, this.view.state.noticeIndex)
      }
    }
    if (result !== null) {
      this.getCaptchaVerify()
    }
  }

  async setLoginPass(oldPwd, newPwd, type) { // 设置／修改登录密码
    if(!this.view.state.setPassFlag)
      return;
    this.view.setState({
      setPassFlag: false
    });
    let result = await this.store.Proxy.getLoginPwd({
      token: this.store.token,
      opd: this.RSAencrypt(oldPwd),
      npd: this.RSAencrypt(newPwd),
      ty: type,// 0:设置密码 （不用传old_pass） 1:修改密码
    });
    this.view.setState({
      remindPopup: result && [610, 631].includes(result.ret) ? false : true,
      popType: result ? 'tip3': 'tip1',
      popMsg: result ? result.msg : (type ? this.view.intl.get("user-modifiedSucc") : this.view.intl.get("user-setSucc")),
      showSet: result ? true : false,
      setPassFlag: true,
      errCode: result && result.ret,
      errState: result && result.msg
    });
    if (result === null) {
      this.view.state.userInfo && this.view.setState({userInfo: Object.assign(this.view.state.userInfo, {loginPwd: 0})});
      this.store.state.userInfo.loginPwd = 0;
      // 修改密码成功跳转至...
      this.view.state.to && this.view.history.push(this.view.state.to);
      // 首页登录密码三秒后消失
      this.view.state.popupShow && (setTimeout(()=>{this.view.setState({popupShow: false}); this.changeUserIsNew()}, 2000))
    }
  }

  async modifyFundPwd(account, mode, opType, newPass, captchaCode, captchaId, code, os=3) { // 设置／修改资金密码
    if(!this.view.state.setPassFlag)
      return;
    this.view.setState({
      setPassFlag: false
    });
    let result = await this.store.Proxy.modifyFundPwd({
      token: this.store.token,
      ac: account,
      mo: mode, // 0:phone 1:email 2:google
      oty: opType, // 0:设置资金密码 1:修改资金密码
      np: this.RSAencrypt(newPass),
      cc: captchaCode, // 图形验证码，没有就传空
      ci: captchaId, // 图形验证码id，没有就传空
      co: code,
      os: os, // 1:android 2:iOS 3:browser
    });
    this.view.setState({
      remindPopup: result && [607, 608, 619, 2001].includes(result.ret) ? false : true,
      popType: result ? 'tip3': 'tip1',
      popMsg: result ? result.msg : (opType ? this.view.intl.get("user-modifiedSucc") : this.view.intl.get("user-setSucc")),
      showSet: result ? true : false,
      setPassFlag: true,
      errCode: result && result.ret,
      errState: result && result.msg
    });
    if (result === null && opType === 0) { // 设置成功后重置参数
      this.view.setState({
        userInfo: Object.assign(this.view.state.userInfo, {fundPwd: 0}),
        fundPwdInterval: 0,
      });
      this.store.state.userInfo.fundPwd = 0;
      this.store.state.fundPwdInterval = 0;
    }
    if (result !== null) {
      this.getCaptchaVerify()
    }
    if(result===null){
      this.getCaptchaVerify();
      //修改成功跳转至...
      this.view.state.to && this.view.history.push(this.view.state.to);
    }
  }

  async setTwoVerify(account, mode, code, position, verifyType) { // 修改两步认证
    if(!this.view.state.verifyFlag)
      return;
    this.view.setState({
      verifyFlag: false
    });
    let userInfo = this.view.state.userInfo,
        twoVerifyArr = ['loginVerify', 'withdrawVerify', 'fundPassVerify'],
        twoVerifyState = twoVerifyArr[position-1],
        twoVerifyUser = {};
    twoVerifyUser[twoVerifyState] = verifyType;
    let result = await this.store.Proxy.setTwoVerify({
      token: this.store.token,
      ac: account,
      mo: mode, //0手机 1邮箱 2Google
      co: code, //验证码
      os: 3, // 1:android 2:iOS 3:borwser
      po: position,//修改的位置 1登陆   2提现   3资金密码
      vty: verifyType//2谷歌验证 1邮件  3短信  0无
    });
    this.view.setState({
      verifyFlag:true
    });
    if (result === null) {
      userInfo = Object.assign(this.view.state.userInfo, twoVerifyUser)
    }
    this.view.setState({
      remindPopup: result && [607, 608, 619, 2001].includes(result.ret) ? false : true,
      errCode: result && result.ret,
      errState: result && result.msg,
      popType: result ? 'tip3': 'tip1',
      popMsg: result ? result.msg : this.view.intl.get("user-modifiedSucc"),
      userInfo,
      showChange: result ? true : false,
    })
  }

  async setUserNotify(value, index) { // 修改通知方式
    let userInfo = this.view.state.userInfo;
    this.view.setState({
      type: index + 1,
      bindOrigin: 2
    });
    if (1 - index === userInfo.notifyMethod) return; // 点击已选中不发请求
    if (!userInfo[value.checkType]) { // 未绑定情况下弹窗
      this.view.setState({
        noticeIndex: index,
        noticeContent: value,
        showSet: true
      });
      return
    }
    if (userInfo[value.checkType]) { // 通知方式修改
      let result = await this.store.Proxy.setUserNotify({
        token: this.store.token,
        ty: 1 - index // 0:phone 1:email
      });
      this.view.setState({
        remindPopup: true,
        popType: result ? 'tip3': 'tip1',
        popMsg: result ? result.msg : this.view.intl.get("user-modifiedSucc"),
        userInfo: result ? userInfo : Object.assign(userInfo, {notifyMethod: 1 - index})
      })
    }
  }

  async setPwdLimit(type, pwd) { // 设置资金密码间隔
    let result = await this.setFundPwdInterval(type, pwd);
    let fundPwdInterval = this.view.state.fundPwdInterval;
    this.view.setState({
      remindPopup: result && [601, 612].includes(result.ret) ? false : true,
      errCode: result && result.ret,
      errState: result && result.msg,
      popType: result ? 'tip3': 'tip1',
      popMsg: result ? result.msg : this.view.intl.get("user-modifiedSucc"),
      showTimePwdPopup: result ? true : false,
      fundPwdInterval: result ? fundPwdInterval : type
    });
  }

  async setGoogleVerify(code) { // 验证谷歌验证码
    let result = await this.store.Proxy.setGoogleVerify({
      token: this.store.token,
      co: code
    })
    this.view.setState({
      remindPopup: result && true,
      popType: result && 'tip3',
      popMsg: result && result.msg,
      showGoogle: result ? true : false,
      userInfo: result ? Object.assign(this.view.state.userInfo, {googleAuth: 0}) : Object.assign(this.view.state.userInfo, {googleAuth: 1})
    })
    if (result === null) {
      this.getUserCreditsNum();
      this.view.selectType(this.view.state.isTwoVerify, this.view.state.twoVerifyTitle, this.view.state.twoVerifyCon)
    }
  }

  async addIp(ipAdd) { // 添加ip白名单
    let ipList = this.view.state.ipList, time = new Date().getTime() / 1000;
    if (this.view.state.ipValue === '') return;
    let result = await this.store.Proxy.addIp({
      token: this.store.token,
      ipd: ipAdd
    });
    if (result && result.ipd) {
      ipList.push({IPAddress: ipAdd, createAt: time, IPId: result.ipd})
    }
    this.view.setState({
      remindPopup: true,
      popType: result && result.ipd ? 'tip1' : 'tip3',
      popMsg: result && result.ipd ? this.view.intl.get("user-addSucc") : result.msg,
      ipList
    })
  }

  async delIp(ipId, iPAdd, index) { // 删除ip白名单
    let ipList = this.view.state.ipList;
    let result = await this.store.Proxy.deletIp({
      token: this.store.token,
      id: ipId,
      add: iPAdd
    });
    if (result === null) {
      ipList.splice(index, 1)
    }
    this.view.setState({
      remindPopup: true,
      popType: result ? 'tip3': 'tip1',
      popMsg: result ? result.msg : this.view.intl.get("user-delSucc"),
      ipList
    })
  }

  async outOther(flag1, flag2) { // 退出其他设备
    let currentLogin = this.view.state.currentLogin,
        currentLoginMe = currentLogin.filter(item => {return item.isMe === true});
    let result = await this.store.Proxy.outOther({
      token: this.store.token,
      im: `${flag1}/${flag2}`
    });
    this.view.setState({
      remindPopup: true,
      popType: result && result.errCode ? 'tip3': 'tip1',
      popMsg: result && result.errCode ? result.msg : this.view.intl.get("user-outSucc"),
      currentLogin: result ? currentLogin : currentLoginMe
    })
  }

  async getIPAddr() { // 获取当前IP
    let result = await this.store.Proxy.getIPAddr();
    this.view.setState({
      ipAddr: result.ip,
      showIp: true
    })
  }

  async addPayment(obj, name) { // 添加支付方式
    if(!this.view.state.addPayFlag) return;
    this.view.setState({
      addPayFlag: false
    });
    obj.fundpass = this.RSAencrypt(obj.fundpass)
    let paramsObj = Object.assign(obj, {token: this.store.token, name}),
        result = await this.store.Proxy.newPaymentAccount(paramsObj);
    if (result === null) {
      let paylistObj = await this.getPaymentAccounts()
      let payOpenList = paylistObj.paymentList.filter(item => {return item.usable === 1})
      if (payOpenList.length <= 4) {
        await this.setPayment(paylistObj.paymentList[0].id, 1)
      }
    }
    this.view.setState({
      toggleFlag: false,
      remindPopup: result ? ([601, 612, 616].includes(result.ret) ? false : true) : false,
      errCode: result && result.ret,
      errState: result && result.msg,
      popType: result && 'tip3',
      popMsg: result && result.msg,
      addPayFlag: true
    })
    return result
  }

  async updatePayment(obj, id, name) { // 修改支付方式
    obj.fundpass = this.RSAencrypt(obj.fundpass)
    let paramsObj = Object.assign(obj, {token: this.store.token, id, name}),
        result = await this.store.Proxy.updatePaymentAccount(paramsObj),
        paymentList = this.view.state.paymentList;
    if (result === null) {
      paymentList.forEach(v => {
        if (v.id === id) {
          v = Object.assign(v, obj)
        }
      })
    }
    this.view.setState({
      remindPopup: result && [601, 612].includes(result.ret) ? false : true,
      errCode: result && result.ret,
      errState: result && result.msg,
      popType: result ? 'tip3': 'tip1',
      popMsg: result ? result.msg : this.view.intl.get("user-modifiedSucc"),
      paymentList
    });
    return result
  }

  async setPayment(id, usable) { // 开关支付方式
    let result = await this.store.Proxy.setPaymentAccountUsable({token: this.store.token, id, usable}),
        paymentList = this.view.state.paymentList,
        toggleFlag = this.view.state.toggleFlag;
    if (result === null) {
      paymentList.forEach(v => {
        if (v.id === id) {
          v.usable = 1 - v.usable
        }
      })
    }
    this.view.setState({
      remindPopup: (result && toggleFlag) ? true : false,
      popType: result && 'tip3',
      popMsg: result && result.msg,
      paymentList
    })
    return result
  }

  async delPayment(id, index) { // 删除支付方式
    let paymentList = this.view.state.paymentList;
    let result = await this.store.Proxy.delPaymentAccount({
      token: this.store.token,
      id
    });
    if (result === null) {
      paymentList.splice(index, 1)
    }
    this.view.setState({
      remindPopup: true,
      popType: result ? 'tip3': 'tip1',
      popMsg: result ? result.msg : this.view.intl.get("user-delSucc"),
      paymentList
    });
  }

  clearUserCreditsNum() { // 清除store里的用户积分
    this.store.state.userCreditsNum = 0
  }


  // 为其他模块提供接口
  // 密码间隔  设置间隔  两步验证  设置用户初始信息  userId  是否设置资金密码
  get userVerify() { // 提供两步认证信息, 是否设置资金密码
    let {  //0: 已设置资金密码 1: 未设置资金密码; d
      fundPassVerify, loginVerify, withdrawVerify, fundPwd
    } = this.store.state.userInfo;
    return {fundPassVerify, loginVerify, withdrawVerify, fundPwd}
  }

  get userInfo() { // 提供用户手机号或者邮箱
    let {
      email, phone
    } = this.store.state.userInfo;
    return { email, phone }
  }

  async getUserInfo() { // 请求用户信息
    if (!Object.keys(this.store.state.userInfo).length){
       await this.initData()
    }
    return this.store.state.userInfo;
  }

  get userAuthVerify() { // 提供用户是否实名
    let {  // 0未认证;1审核中;2已审核;3未通过;4恶意上传失败封锁3天;5永久禁止
      state
    } = this.store.state.userAuth;
    return {state}
  }

  async getUserAuthVerify() { // 请求用户认证信息
    if (!Object.keys(this.store.state.userAuth).length){
      await this.getUserAuthData()
    }
    return this.store.state.userAuth;
  }

  get userToken() { // 提供用户token
    return this.store.token
  }

  get userId() { // 提供用户id
    return this.store.uid
  }

  get userName() { // 提供用户姓名
    return this.store.name
  }

  get userIsNew() {
    return this.store.state.userIsNew
  }

  changeUserIsNew() {
    this.store.state.userIsNew = false
  }

  async setFundPwdInterval(type, pwd) { // 设置资金密码输入间隔
    let result = await this.store.Proxy.setFundPwdSuspend({
      "token": this.store.token,
      "int": type, // 0:每次都需要密码 1:2小时内不需要 2:每次都不需要
      "fpd": this.RSAencrypt(pwd),
    });
    return result
  }

  async getFundPwdInterval() { // 查看资金密码输入间隔
    let result = await this.store.Proxy.getFundPwdSuspend({
      "token": this.store.token,
    });
    let resultObj = {
      mode: result.mo
    };
    return resultObj
  }

  async getCode(account, mode, type, os=3) { // 获取短信验证码
    let result = await this.store.Proxy.getVerifyCode({
      "ac": account, // 手机号或者邮箱
      "mo": mode,//0 phone 1 email
      "ty": type,//0 登录; 1 修改密码; 2 支付; 3 绑定手机／邮箱; 5 设置资金密码 6 修改资金密码 7登陆第二次验证 8提币 9二次验证
      "os": os// 1 android 2 iOS 3 browser 4 h5
    });
    return result
  }

  async getCaptcha() { // 获取图形验证码
    let result = await this.store.Proxy.getCaptcha();
    let resultObj = {
      id: result.id,
      data: result.d
    };
    return resultObj
  }

  async hasStore(){
    let result = await this.store.hasStore()
    if(result && result.hasStore) {
      return true
    }
    return result;
  }
}