import HttpProxy from './httpProxy'
import Websocket from './webSocket'
import Loop from "./loop";
import GlobalUtil from "./libs/GlobalUtil";
import AsyncAll from "./libs/AsyncAll";
import ChangeFontSize from './libs/ChangeFontSize'
import Storage from './storage/index'
import './libs/Prototype'
import ZipUtil from './libs/ZipUtil'
import StoreBase from './StoreBase'
import Regular from './libs/Regular'
import CheckPwdStrength from './libs/CheckPwdStrength'
import Logger from './libs/Logger'
import Crypto from './libs/Crypto'

import LoopCache from "./loop/index_cache";
import Sleep from "./libs/Sleep";



const RUNAPP = async (config) => {
  let ServerConfig = config.ServerConfig;
  let WebSocketConfig = config.WebSocketConfig;
  let HttpConfig = config.HttpConfig;
  let LoopTaskConfig = config.LoopTaskConfig;
  let StorageConfig = config.StorageConfig;
  HttpConfig.useHttp && HttpProxy.setConfig(HttpConfig, ServerConfig);
  Storage.install(StorageConfig.storageList);
  WebSocketConfig.useWebSocket && Websocket.install(ServerConfig, WebSocketConfig.webSocketList);
  Loop.install(LoopTaskConfig);
};


export {
  GlobalUtil,
  Websocket,
  RUNAPP,
  AsyncAll,
  ChangeFontSize,
  Storage,
  ZipUtil,
  StoreBase,
  Regular,
  CheckPwdStrength,
  Logger,
  Crypto
}