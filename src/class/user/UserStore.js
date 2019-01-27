import ExchangeStoreBase from '../ExchangeStoreBase'
import Server from '../../config/ServerConfig'

export default class UserStore extends ExchangeStoreBase {
  constructor() {
    super("user", "general");
    this.state = {
      userId: "",
      token: "",
      userName: "",
      userIsNew: false,
      userInfo: {}, // 用户基本信息
      userAuth: {}, // 认证信息
      userCreditsNum: 0, // 用户积分
      loginList: [], // 登录日志
      userCredits: {}, // 用户积分列表
      currentLogin: [], // 当前登录设备
      ipList: [], // 白名单列表
      googleSecret: '', // 谷歌验证密钥
      fundPwdInterval: -1, // 密码间隔
      paymentList: [], // 收款列表
      hasStore: false
    }
    this.state.token && this.userInfo()

    // websocket监听退出消息
    this.WebSocket.general.on("login", data => {
      if(data.ret === 2006) {
        this.clearUserInfo()
      }
    });
  }

  setController(ctl) {
    this.controller = ctl
  }


  async userLogin(data) { // 获取登录信息
    this.state.userId = data && data.id;
    this.state.token = data && data.tk;
    this.state.userName = data && data.na;
    this.state.userIsNew = data && data.in;
    this.Storage.userToken.set(data && data.tk);
    this.Storage.userId.set(data && data.id);
    this.Storage.userName.set(data && data.na);
  }

  //清除用户信息
  clearUserInfo() {
    this.Storage.userId.removeAll();
    this.Storage.userToken.removeAll();
    this.Storage.userName.removeAll();
    this.state.userId = '';
    this.state.token = '';
    this.state.userName = ''
  }

  // 提供基础数据
  get uid(){ // 提供用户id
    return this.state.userId || this.Storage.userId.get();
  }

  get token() { // 提供用户token
    return this.state.token || this.Storage.userToken.get();
  }

  get name() { // 提供用户姓名
    return this.state.userName || this.Storage.userName.get();
  }

  async userInfo() { // 获取用户信息
    let userInfo = await this.Proxy.getUserInfo({"token": this.token});
    let userInfoObj = {
      // "cardVerify": userInfo.cardVerify,
      credits: userInfo.cre,
      email: userInfo.em,
      fundPassVerify: userInfo.fvf,
      fundPwd: userInfo.fpd,
      googleAuth: 1 - userInfo.gla,
      interval: userInfo.int,
      level: userInfo.lv,
      loginPwd: userInfo.lpd,
      loginVerify: userInfo.lvf,
      notifyMethod: userInfo.nm,
      phone: userInfo.ph,
      userId: userInfo.id,
      // "userName": userInfo.userName,
      withdrawVerify: userInfo.wvf,
    }
    this.state.userInfo = userInfoObj;
    return userInfoObj
  }

  async userAuth() { // 获取用户认证信息
    let userAuth = await this.Proxy.getUserAuth({"token": this.token});
    let userAuthObj = {
      // "userId": userAuth.userId,
      state: userAuth.state,                     // 0未认证 1审核中 2已审核 3未通过 4恶意上传审核失败封锁3天 5永久禁止
      firstName: userAuth.first_name,
      lastName: userAuth.last_name,
      fullName: userAuth.name,
      type: userAuth.type,                      // 0：无 1：身份证 2：军官证 3：护照
      number: userAuth.number, // 证件号
      image1: userAuth.image1,   // 正面
      image2: userAuth.image2,   // 背面
      image3: userAuth.image3,    // 手持
      updateAt: userAuth.update        // 最后更新时间 当状态为4封锁3天时使用，updateAt+3天为封锁终止时间
    }
    this.state.userAuth = userAuthObj;
    return userAuthObj
  }

  async userCreditsNum() { // 获取用户积分
    let userCreditsCon = await this.Proxy.getUserCreditsNum({"token": this.token});
    // let userCreditsNum = userCreditsCon.credits;
    let userCreditsNum = userCreditsCon.cre || 0;
    this.state.userCreditsNum = userCreditsNum;
    return userCreditsNum
  }

  async currentLogin() { // 获取当前登录设备列表
    let currentLoginCon = await this.Proxy.getCurrentLogin({"token": this.token});
    let currentLoginConObj = {
      list: currentLoginCon.l && currentLoginCon.l.map(v => {
        return {
          country: v.c,
          device: v.de,
          ip: v.ip,
          ipLocation: {isoCode: v.il.co, countryCN: v.il.cc, provinceCN: v.il.pc, countryEN: v.il.ce, provinceEN: v.il.pe},
          isMe: v.im,
          loginTime: v.lt,
          os: v.os
        }
      })
    }
    let currentLogin = currentLoginConObj ? currentLoginConObj.list : [];

    this.state.currentLogin = currentLogin;
    return currentLogin
  }

  async loginList() { // 获取登录日志
    let loginContent = await this.Proxy.getLoginList({p: 0, s: 10, src:-1, cl:0, token: this.token});
    let loginContentObj = {
      data: loginContent.d && loginContent.d.map(v => {
        return {
          catalog: v.cl,
          ip: v.ip,
          ipLocation: {isoCode: v.il.co, countryCN: v.il.cc, provinceCN: v.il.pc, countryEN: v.il.ce, provinceEN: v.il.pe},
          createdTime: v.ct,
          os: v.os
        }
      })
    }
    let loginlist = loginContentObj.data ? loginContentObj.data : [];
    let catalogArr = [
        this.controller.view.intl.get("user-log-1"),
        this.controller.view.intl.get("user-log-2"),
        this.controller.view.intl.get("user-log-3"),
        this.controller.view.intl.get("user-name"),
        this.controller.view.intl.get("twoStep"),
        this.controller.view.intl.get("user-log-4"),
        this.controller.view.intl.get("user-log-5"),
        this.controller.view.intl.get("user-log-6"),
        this.controller.view.intl.get("user-log-7"),
        this.controller.view.intl.get("user-log-8"),
        this.controller.view.intl.get("user-log-9"),
        this.controller.view.intl.get("user-log-10"),
        this.controller.view.intl.get("user-ipWhite"),
        this.controller.view.intl.get("user-log-11")];
    loginlist.length && loginlist.forEach(v => {
      v.catalog = catalogArr[v.catalog]
    })
    this.state.loginList = loginlist;
    return loginlist
  }

  async userCredits(page) { // 获取用户积分列表
    let userCreditsCon = await this.Proxy.getUserCredits({"p": page, "s":10, "token": this.token});
    let userCreditsConObj = {
      list: userCreditsCon.l && userCreditsCon.l.map(v => {
        return {
          id: v.id,
          operation: v.op,
          gain: v.ga,
          createdTime: v.t
        }
      }),
      totalCount: userCreditsCon.tc
    }
    let userCreditsArr = [
      this.controller.view.intl.get("user-credits1"),
      this.controller.view.intl.get("user-credits2"),
      this.controller.view.intl.get("user-credits3"),
      this.controller.view.intl.get("user-credits4"),
      this.controller.view.intl.get("user-credits4"),
      this.controller.view.intl.get("user-credits5"),
      this.controller.view.intl.get("user-credits6"),
      this.controller.view.intl.get("user-credits7"),
      this.controller.view.intl.get("user-credits8"),
      this.controller.view.intl.get("user-credits9"),
      this.controller.view.intl.get("user-credits10"),
      this.controller.view.intl.get("user-credits11"),
      this.controller.view.intl.get("user-credits12"),
      this.controller.view.intl.get("user-credits13"),
      this.controller.view.intl.get("user-credits14"),
      this.controller.view.intl.get("user-credits15"),
    ]

    userCreditsConObj.list && userCreditsConObj.list.forEach(v => {
      v.operation = userCreditsArr[v.id]
    })
    this.state.userCredits = userCreditsConObj;
    return userCreditsConObj
  }

  async ipList() { // 获取ip白名单
    let ipListCon = await this.Proxy.getIpList({"token": this.token});
    let ipList = ipListCon.d && ipListCon.d.map(v => {
      return {
        IPId: v.id,
        IPAddress: v.add,
        createAt: v.t
      }
    })
    this.state.ipList = ipList;
    return ipList
  }


  async googleSecret() { // 获取谷歌验证密钥
    let googleSecretCon = await this.Proxy.getGoogle({"token": this.token});
    let googleSecret = googleSecretCon.sec;
    this.state.googleSecret = googleSecret;
    return googleSecret
  }

  async fundPwdInterval() { // 获取资金密码输入间隔
    let fundPwdIntervalCon = await this.Proxy.getFundPwdSuspend({"token": this.token});
    let fundPwdInterval = fundPwdIntervalCon.mo;
    this.state.fundPwdInterval = fundPwdInterval;
    return fundPwdInterval
  }

  async getPaymentAccounts() { // 获取收付款账号列表
    let myPaymentAccounts = await this.Proxy.myPaymentAccounts({"token": this.token});
    this.state.paymentList = myPaymentAccounts.accounts || []
    return this.state.paymentList
  }

  async uploadImg(file){ // 上传图片
    let uploadImg = new FormData();
    uploadImg.append("uploadimage", file);
    return await fetch(`${Server.hSecure && 'https' || 'http'}://${Server.host}/v1/usupload/`, {
      method: 'Post',
      body: uploadImg,
    })
  }

  async hasStore(){
    let result = await this.Proxy.hasStore({token: this.token})
    return result;
  }

}
