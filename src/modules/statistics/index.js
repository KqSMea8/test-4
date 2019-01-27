export default class Statistics{
  constructor(props) {
    this.url = `${props.host}/statistics/upload/`;
    this.ipUrl = `${props.host}/statistics/ip/`;
    this.version = '1.0.5';
    this.config = Object.assign(props.config, {
      sdk_version: this.version
    });
    //协议ID(传入配置)|时间|IP|SDK Version|Device ID(传入配置)|OS|国家(传入配置)|渠道(传入配置)|版本号(传入配置)|产品ID(传入配置)|功能ID(传入配置)|统计对象|操作代码|操作结果|入口|TAB|位置|关联对象|备注
    this.orderArr = ['protocol', 'time', 'ip', 'sdk_version', 'device_id', 'os', 'country', 'channel', 'version', 'id', 'func_id', 'obj', 'event', 'result', 'enter', 'type', 'pos', 'rel', 'rem']
    this.defaultOption = {
      method:'post',
      headers: {
        'Accept':'application/json',
        'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
      }
    }
    //处理出发送的body
    this.dealBody=(o)=>{
      let body = Object.assign(this.config, o);
      return this.orderArr.map(v=>{
        if(v==='time') return new Date()-0;
        if(body[v]) return body[v];
        if(!body[v]) return ''
      }).join('|')
    }
  }
  async getIp(){
    let ip = await fetch(this.ipUrl, {
      method:'get',
      headers: {
        'Accept':'application/json',
        'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
      }
    }).then((res)=>{
      return res.text()
    }).then((res)=>{
      return res;
    }).catch(err=>{
      return '';
    })
    return ip;
  }
  async send(body){
    if(!this.config.ip)  this.config.ip = await this.getIp();
    let content = Object.assign({body: this.dealBody(body)}, this.defaultOption);
    let result = await fetch(this.url, content).then((res)=>{
      return res.text()
    })
    .then((res)=>{
      return {ret:0, msg:res}
    }).catch(err=>{
      return {ret:-1, msg: err};
    })
    return result;
  }
}