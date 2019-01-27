import React from 'react';
import {render} from 'react-dom';
import {RUNAPP, Websocket, Storage} from '@/core'
import "whatwg-fetch";
import ServerConfig from '@/config/ServerConfig'
import WebSocketConfig from '@/config/WebSocketConfig'
import HttpConfig from '@/config/HttpConfig'
import LoopTaskConfig from '@/config/LoopTaskConfig'
import StorageConfig from '@/config/StorageConfig'
import GeneralConfig from '@/config/GeneralConfig'
import '@/class/lib/Prototype'
import Device from '@/core/libs/Device'
import PcAppContianer from '@/common/layout/pcAppContainer'
import {goHomePath} from "@/config/UrlConfig"
import App from "./App"


let str = Date.now() + '-' + Math.random().toString(36).substr(2),
    broFlagObj = {
      Chrome: 51,
      Safari: 11,
      Edge: 14,
      Firefox: 53,
    },
    device = Device.bro().device,
    version = Device.bro().version;


const renderDom = async Component => {
  console.log('version', GeneralConfig.version);
  await RUNAPP({ServerConfig, WebSocketConfig, HttpConfig, LoopTaskConfig, StorageConfig});
  WebSocketConfig.useWebSocket && Websocket.general({test: str});
  if(Storage.userToken.get()) {
    goHomePath()
    return;
  }
  render(
      <PcAppContianer>
        <Component/>
      </PcAppContianer>,
      document.getElementById('app')
  );
};

if (!device || version < broFlagObj[device]) {
  alert('您的浏览器不支持部分功能，请升级或更换浏览器!\nYour browser does not support some functions, please upgrade or replace the browser!')
}

renderDom(App);

