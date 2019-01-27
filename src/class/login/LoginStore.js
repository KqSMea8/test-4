import ExchangeStoreBase from '../ExchangeStoreBase'
import DetectOS from '../lib/Os'
import Browser from '../lib/Browser'

let pushHistoryFlag = true

export default class LoginStore extends ExchangeStoreBase {
  constructor() {
    super('login', 'general');
    this.state = {};
    this.reLogin();
    this.WebSocket.general.on('login', data => {
      this.controller.userLoginInfo(data);
      let obj = this.formatLoginObj();
      if(data.r === 0 && pushHistoryFlag ){
        this.WebSocket.general.clearWebsocketHistoryArr('login');
        this.WebSocket.general.pushWebsocketHistoryArr('login', obj)
      }
      if(data.r && (data.r === 2006 || data.r === 2007)) { // 登录超时
        data.ret = data.r;
        this.controller.loginUpdate(data);
      }
    });
    this.WebSocket.general.on("loginOther", data => { // 其他地方登录
      this.WebSocket.general.clearWebsocketHistoryArr('login');
      let dataOther = Object.assign(data, {flag: 1});
      this.controller.loginUpdate(dataOther);
    });
    this.WebSocket.general.on("loginSeverErr", data => { // 服务维护
      this.WebSocket.general.clearWebsocketHistoryArr('login');
      let dataSeverErr = Object.assign(data, {flag: 2});
      this.controller.loginUpdate(dataSeverErr);
    });
  }

  setController(ctl) {
    this.controller = ctl
  }

  formatLoginObj() {
    let ls = 'exchange_logic_client';
    if(window.location.href.indexOf('otc') > 0){
      ls = 'otc_logic_client'
    }
    return ({ "tk": this.Storage.userToken.get(), "os":this.Storage.os.get(), "de": `${ DetectOS()}/${Browser()}`, "did": '', ls, id: this.Storage.userId.get()})
  }

  reLogin(){
    let token = this.Storage.userToken.get();
    if(token){
      let obj = this.formatLoginObj();
      this.WebSocket.general.emit('login', obj)
    }
  }

  login(obj) { // 登陆接口
    let ch = this.Storage.c.get();
    this.WebSocket.general.emit('login', ch ? Object.assign(obj, {ch:Number(ch)}) : obj)
  }

  loginOutRemind() { // 退出登陆
    this.WebSocket.general.emit('loginOut')
  }
}
