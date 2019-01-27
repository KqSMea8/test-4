import ExchangeStoreBase from '../ExchangeStoreBase'

export default class KlineStore extends ExchangeStoreBase {
  constructor() {
    super('userOrder', 'general');
    this.name = new Date()-0
    this.state = {
      duration: '',
      tradePairName: '',
      kline: [],
      klineUpdate: [],   // ws推送数据
    };
    this.WebSocket.general.on("tradeKline", data => {
      this.state.klineUpdate = []
      // console.log("k线-ws推送：\n",data, this.state.klineUpdate, this.state.klineUpdate.length, this.state.tradePairName);
      if(data.n !== this.state.tradePairName){
        return
      }
      // console.log("k线-ws推送：\n",data, this.state.klineUpdate, this.state.tradePairName);
      data.ns.map(v => {
          let arr = [];
          arr.push(v.st * 1000);
          arr.push(v.op);
          arr.push(v.hp);
          arr.push(v.lp);
          arr.push(v.cp);
          arr.push(v.vol);
          this.state.klineUpdate.push(arr);
      });
      this.controller.setKlineUpdate(this.state.klineUpdate);
    });
  }

  setController(ctrl) {
    this.controller = ctrl;
  }

  async getData() {
    let result = await this.Proxy.getKline({
      "n": this.state.tradePairName,
      "dur": this.state.duration // k线时间段秒数
    });
    // console.log("k线-http请求：\n", result, this.state.kline, this.state.kline.length,this.state.tradePairName);
    if(result.n !== this.state.tradePairName){
      return false
    }
    // console.log("k线-http请求：\n",result, this.state.tradePairName);
    if (result.n) {
      if (!result.ns) { this.state.kline = []; return };
      this.state.kline = result.ns.map(v => {
        let arr = [];
        arr.push(v.st * 1000);
        arr.push(v.op);
        arr.push(v.hp);
        arr.push(v.lp);
        arr.push(v.cp);
        arr.push(v.vol);
        return arr;
      });
    }
  }

  get kline(){
    return this.state.kline;
  }

  clearKline(){
    this.state.kline = [];
  }

  //websockt加入房间
  joinRoom(fromRoom, toRoom) {
    this.state.kline = [];
    this.state.klineUpdate = [];
    if (toRoom === ''){
      this.state.duration = '',
      this.state.tradePairName = '',
      this.state.kline = [];
    }
    this.WebSocket.general.emit("joinRoom", { f: fromRoom, t: toRoom });
  }

  update(k, v) {
    // console.log('store update', k, v, JSON.stringify(this.state))
    this.state[k] = v;
  }
}