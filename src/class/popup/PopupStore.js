import ExchangeStoreBase from '../ExchangeStoreBase'

export default class PopupStore extends ExchangeStoreBase {
  constructor() {
    super('global', "general");
    // this.Logger('PopupStore....................', this.WebSocket)
    this.state = {
      isBreak: false
    }
    this.WebSocket.pushErrorList('break', this.breakHandle);
    // this.WebSocket.pushCloseList('break', this.breakHandle)
    // // websocket监听用户资产更新推送
    // this.WebSocket.general.on("userNoticeUpdata", data => {
      //   // console.log("userNoticeUpdata-websocket", data);
      //   this.controller.userNoticeUpdata(data);
      // });
    this.WebSocket.general.on('connect', (data)=>{
      this.Storage.wt.set(data.t)
      if(this.isBreak) window.location.reload()
    })
  }
  setController(ctl) {
    this.controller = ctl
  }

  breakHandle = ()=>{
    if(this.isBreak) return;
    this.isBreak = true;
    this.controller.setState({
      connecting: true
    })
    // this.Logger('errorBreak....................', this.isBreak)
  }
}