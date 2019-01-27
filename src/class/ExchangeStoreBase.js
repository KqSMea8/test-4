import Msg from "../config/ErrCodeConfig";
import DetectOS from './lib/Os'
import Browser from './lib/Browser'
import {ZipUtil, StoreBase} from '../core'
import getWatchToken from '../core/libs/WatchmanFetch'
import {deleteDbPro, getDbPro} from '@/core/libs/QuickClickGuard'
import createHash from "create-hash";

//todo 换Map数据类型
const WebsocketCallBackList = {}, websocketHistory = {}, websocketErrorList = {}, websocketCloseList = {};
let srartFlag = false;


export default class ExchangeStoreBase extends StoreBase {
  constructor(modelName, connectName) {
    super();
    this.preHandler.push(this.exchangeStoreBasePreHandler);
    this.afterHandler.push(this.exchangeStoreBaseAfterHandler);
    modelName && this.installProxy(modelName, this.preHandler, this.afterHandler);
    this.WebSocket = {}
    modelName && connectName && this.installWebsocket(connectName, modelName);
    this.getWatchToken = getWatchToken;
  }

  exchangeStoreBasePreHandler(app, req, config) {
    if(config.needDbpro){
      if(getDbPro(config.name)){
        return
      }
    }
    let paramsObj = {a: config.action};
    if(req.data.params){
      paramsObj['d'] = req.data.params;
    };
    paramsObj['ts'] = parseInt(new Date() / 1000);
    paramsObj['appId'] = 0;
    req.data.params = paramsObj;
    // API接口签名计算
    let sigArr = [],
        secretKey = '70f239020d3a28b8d24ba1706f2dd7c03dcaa2fa5e7a077f1f517e5f2d3a68a1';
    function traverse(obj, arr){
      let keyArray = Object.keys(obj);
      if(!keyArray.length) return [];
      for (const k in obj) {
        let v = obj[k];
        if(Array.isArray(v)) continue;
        if(!v && v !== 0) continue;
        if(typeof v === 'object'){
          // console.warn((v.constructor.name, v));
          if(v.__proto__._isBigNumber) {
            arr.push(`${k}=${JSON.stringify(v)}`)
            continue
          }
          traverse(v, arr);
          continue
        };
        arr.push(`${k}=${encodeURIComponent(v).replace(/%20/g, '+')}`)
      }
      return arr;
    }
    req.data.params && traverse(req.data.params, sigArr)
    let sigString = sigArr.sort((a,b)=>{
      if(a>b) return 1;
      if(a<=b) return -1;
    }).join('&') + secretKey;
    // console.warn(sigString)
    function encrypt (type, str) {
      return createHash(type).update(str).digest('hex')
    }
    // console.warn(encodeURIComponent(sigString))
    let sig = encrypt('sha256', (encrypt('md5', encrypt('md5', sigString)))).toLowerCase()
    // console.warn(sig)
    req.data.params['sig'] = sig;

    app.Logger.dev('sendHttp', req.url, `action:${config.action}`, `请求${config.loggerInfo}`, req.data.params)
    //添加token
    if (!config.needToken) return
    if (!req.data.params.d.token) return
    let headers = new Headers()
    headers.set('token', req.data.params.d.token)
    req.data.headers = headers;
    delete req.data.params.d.token
  }

  exchangeStoreBaseAfterHandler(app, req, res, config) {
    if(config.needDbpro) {
      deleteDbPro(config.name)
    }
    app.Logger.dev('receiveHttp', req.url, `action:${config.actionBack}`, `收到${config.loggerInfo}`, res.result);

    // RPC_STATUS_REQUEST_TIME_EXCEPTION                       = 1427 // request请求时间异常
    let obj = {
      ret: res.result.r || res.result.ret || 0,
      data: res.result.d || res.result.data || null,
      action: res.result.a || res.result.action,
    }

    if(obj.ret === 1427){
      alert('时间异常，请同步时间。\n Time is abnormal. Please synchronize time.')
    }

    if (obj.ret !== 0) {
      let errMsg = Msg[obj.ret];
      res.result = obj.data ? Object.assign(errMsg, obj.data) : errMsg;
      return
    }
    if (obj.action !== config.actionBack) {
      // console.warn(obj.action, config.actionBack)
      res.result = Msg[1];
      return
    }
    res.result = obj.data
  }

  startWebsocket(connectName) {
    // this.WebSocket[connectName].on('connect', data => {
    //   console.log(data.token)
    //   this.Storage.wt.set(data.token)
    // });
    this.WebSocket[connectName].emit('connect', {t: this.Storage.wt.get(), v: 0, de: Browser(), im: `${DetectOS()}/${Browser()}`, os: 3 });
    this.Loop.websocketHeartBreak.clear();
    this.Loop.websocketHeartBreak.setDelayTime(10);
    this.Loop.websocketHeartBreak.set(async () => {
        this.WebSocket[connectName].emit('heartBreak');
      await this.Sleep(5000)
    });
    this.Loop.websocketHeartBreak.start()
  }

  installWebsocket(connectName, modelName) {
    let websocket = super.installWebsocket(connectName);
    if (!websocket)
      return;
    let headerConfig = Object.assign(websocket.config.optionList['global'], websocket.config.optionList[modelName]);
    let opConfig = {};
    headerConfig && Object.keys(headerConfig).forEach(v => {
      opConfig[headerConfig[v].resOp] = v
    });
    websocket.onMessage = async data => {
      let ver, op, seq, zip, body;
      try{
        data = await ZipUtil.BlobParse(data)
      } catch (e) {
        this.Logger.error('解析Blob',e)
      }
      try{
        data = Buffer.from(data);
        ver = data.readInt16BE(0);
        op = data.readInt16BE(2);
        seq = data.readInt32BE(4);
        zip = data.readInt8(8);
        body = data.length > 9 && data.slice(9)
      } catch (e) {
        this.Logger.error('操作buffer', e)
      }

      if(zip){
        try{
          body = await ZipUtil.unZip(body)
        } catch (e) {
          this.Logger.error('解压缩', e)
        }

      }
      try{
        body = JSON.parse(body.toString())
      } catch (e) {
        this.Logger.error('解析json', e)
      }
      let opName = opConfig[op], config = headerConfig[opName], dataCache = body;
      body && this.Logger.dev('reciveWebsocket', `op:${op}`, `seq:${seq}`, `接收${config.loggerInfo}返回数据`, body);
      if(config.s && Math.abs(seq - config.s) > Math.pow(2,31)){
        config.s = 0
      }
      if(!config.passSort && seq < config.s){
        // this.Logger('删除部分',seq, config.s, op, config);
        // todo: 多个消息同时发送
        return
      }
      config.s = seq;
      if(body && body.r){
        delete body.m;
        dataCache = Object.assign(Msg[body && body.r || 0] || {}, body)
      }
      if(config.needSeq){
        dataCache.seq = seq
      }
      opName && WebsocketCallBackList[opName] && WebsocketCallBackList[opName](dataCache)
    };

    websocket.onClose = data => {
      this.Loop.websocketHeartBreak.stop();
      this.Loop.websocketHeartBreak.clear();
      //执行关闭队列
      Object.keys(websocketCloseList).forEach(v => websocketCloseList[v].forEach(func => func(data)));
      websocket.onOpen = data => {
        this.Logger.dev('onClose', 'websocketHistory', websocketHistory);
        this.startWebsocket(connectName);
        Object.keys(websocketHistory).forEach(v => websocketHistory[v].forEach(vv => this.WebSocket[connectName].emit(v, vv)))
      }
    }

    websocket.onError = data => {
      // this.Logger.dev('onError', 'websocketErrorList', websocketErrorList);
      this.Loop.websocketHeartBreak.stop();
      this.Loop.websocketHeartBreak.clear();
      //执行错误队列
      Object.keys(websocketErrorList).forEach(v => websocketErrorList[v].forEach(func => func(data)));
      websocket.onOpen = data => {
        this.Logger.dev('onError', 'websocketHistory', websocketHistory);
        this.startWebsocket(connectName);
        Object.keys(websocketHistory).forEach(v => websocketHistory[v].forEach(vv => this.WebSocket[connectName].emit(v, vv)))
      }
    }

    this.WebSocket[connectName] = {}

    this.WebSocket[connectName].emit = async (key, data) => {
      headerConfig[key].history && this.WebSocket[connectName].pushWebsocketHistoryArr(key, this.Util.deepCopy(data), headerConfig[key].historyFunc);
      let emitData = await this.formatWebSocketEmitData(headerConfig, key, data);
      data && this.Logger.dev('sendWebsocket', `op:${headerConfig[key].o}`, `seq:${headerConfig[key].s}`, `发送${headerConfig[key].loggerInfo}数据`,data);
      websocket.send(emitData)
    };

    this.WebSocket[connectName].on = (key, func) => {
      WebsocketCallBackList[key] = func
    };

    this.WebSocket[connectName].pushWebsocketHistoryArr = (key, value, func) => {
      websocketHistory[key] = websocketHistory[key] || [];
      if(func){
        websocketHistory[key] = func(websocketHistory[key], value);
        return
      }
      websocketHistory[key].push(value)
    };

    this.WebSocket[connectName].clearWebsocketHistoryArr = key => {
      websocketHistory[key] = []
    };

    this.WebSocket.pushErrorList = (key, func) => {
      websocketErrorList[key] = websocketErrorList[key] || [];
      websocketErrorList[key].push(func)
    };

    this.WebSocket.clearWebsocketErrorList = key => {
      websocketErrorList[key] = [];
    };

    this.WebSocket.pushCloseList = (key, func) => {
      websocketCloseList[key] = websocketCloseList[key] || [];
      websocketCloseList[key].push(func)
    };

    this.WebSocket.clearWebsocketCloseList = key => {
      websocketCloseList[key] = [];
    };

    if (!srartFlag) {
      this.startWebsocket(connectName);
      srartFlag = true
    }
  }

  async formatWebSocketEmitData(headerConfig, key, data){
    let dataBuffer, flag = 0, buffer;
    try{
      dataBuffer = data && Buffer.from(JSON.stringify(data)) || null;
      buffer = Buffer.allocUnsafe(9)
    } catch (e) {
      this.Logger.error('操作buffer', e)
    }

    if(dataBuffer && dataBuffer.length > 5000){
      flag = 1
      dataBuffer = await ZipUtil.zip(dataBuffer)
    }
    try{
      headerConfig[key].s = Math.floor(Math.random() * 1000000000);
      buffer.writeInt16BE(headerConfig[key].v, 0);
      buffer.writeInt16BE(headerConfig[key].o, 2);
      buffer.writeInt32BE(headerConfig[key].s, 4);
      buffer.writeInt8(flag, 8)
    } catch (e) {
      this.Logger.error('操作buffer', e)
    }
    try {
      if (dataBuffer && dataBuffer.length) {
        buffer = Buffer.concat([buffer, dataBuffer], 9 + dataBuffer.length)
      }
    } catch (e) {
      this.Logger.error('操作buffer', e)
    }
    return buffer
  }
}