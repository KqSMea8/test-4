import ExchangeStoreBase from '../ExchangeStoreBase'
import Statistic from '../../modules/statistics'
import getOs from '../../class/lib/Os'
import GeneralConfig from "../../config/GeneralConfig"
import Device from '../../core/libs/Device'
import {
  EXCHANGE_NAME_CNY,
  EXCHANGE_NAME_USD,
  EXCHANGE_URl,
  EXCHANGE_Apply_EMAIL,
  EXCHANGE_CONTACT_EMAIL,
  EXCHANGE_ADDR,
  EXCHANGE_SERVICE_PHONE,
  EXCHANGE_SERVICE_QQ,
  EXCHANGE_COIN,
  CURRENT_URL,
  CURRENT_IMGURL,
  EXCHANGE_TWITTER,
  EXCHANGE_WECHAT,
  EXCHANGE_TELEGRAPH,
  STATISTIC_URL,
  OFFICIAL_WEBSITE
} from '@/config/VariableConfig.js'

import {getQueryFromPath} from '@/config/UrlConfig'
import {AsyncAll} from '@/core'


export default class UserStore extends ExchangeStoreBase {
  constructor(count) {

    super("config", "general");
    !this.Storage.language.get() && this.Storage.language.set("zh-CN")
    let language = getQueryFromPath("language") === '0' ? "zh-CN" : getQueryFromPath("language") === '1' ? "en-US" : undefined;
    language && this.Storage.language.set(language);

    // 渠道存储
    // if(window.location.pathname === '/'){
    getQueryFromPath("c") && this.Storage.c.set(getQueryFromPath("c"))
    // }
    this.state = {
      os:3,
      nameCny: EXCHANGE_NAME_CNY,
      nameUsd: EXCHANGE_NAME_USD,
      coin: EXCHANGE_COIN,
      netUrl: EXCHANGE_URl,
      officialWebsite: OFFICIAL_WEBSITE,
      applyEmailUrl: EXCHANGE_Apply_EMAIL,
      contactEmailUrl: EXCHANGE_CONTACT_EMAIL,
      addr: EXCHANGE_ADDR,
      servicePhone: EXCHANGE_SERVICE_PHONE,
      serviceQQ: EXCHANGE_SERVICE_QQ,
      currentUrl: CURRENT_URL,
      currentImgUrl: CURRENT_IMGURL,
      // language: 'zh-CN',
      language: this.Storage.language.get() || "zh-CN",
      activityState: 1,
      twitter: EXCHANGE_TWITTER,
      weChat: EXCHANGE_WECHAT,
      telegraph: EXCHANGE_TELEGRAPH,
      statisticUrl: STATISTIC_URL,
      func_id: Device.mobile() ? 1014 : 1011
    }
    this.statis = new Statistic({
      host:this.state.statisticUrl,
      config: {
        protocol:101,//协议ID
        country: this.Storage.language.get(),//国家
        os:Device.mobile() ? Device.android() ? 'android' : Device.ios() ? 'ios' : 'otherOs' : getOs(),
        channel: this.Storage.c.get() || '',//渠道
        version: GeneralConfig.version,//版本号
        id: 'com_mixotc_exchange_web',//产品id
        func_id: this.state.func_id//功能id
      }
    })
  }
  setController(ctl) {
    this.controller = ctl
  }

  setOs(os) {
    this.Storage.os.set(os);
    this.state.os = os;
  }
  changeLanguage(lang){
    this.state.language = lang;
    this.Storage.language.set(lang);
  }
  // 获取活动状态
  async getActivityState(){
    let result = await this.Proxy.activityState();
    // result.sd = 1
    // result.qe = 0
    this.state.activityState = result;
  }

  async checkVersion() {
    let result = await AsyncAll([
      this.Proxy.checkVersion({
        app:1,
        v:0
      }),
      this.Proxy.checkVersion({
        app:2,
        v:0
      })
    ]);
    this.state.versionAndroidInfo = result;
    return result
  }

  async sendStatis(obj){
    // let id = this.Storage.c.get();
    // id && await this.Proxy.sendChannel({id: Number(id)});
    // let result = await this.statis.send({
    //   event: 'homeNav',//操作代码
    //   type: 'home',//tab
    // })
    let result = await this.statis.send(obj)
    return result;
  }
  get versionAndroidInfo(){
    return this.state.versionAndroidInfo

  }

  get language(){
    return this.state.language;
  }

  get os() {
    return this.state.os;
  }
}