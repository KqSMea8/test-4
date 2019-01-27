
import Util from "@/core/libs/GlobalUtil";
import intl from "react-intl-universal";
import en from "../../lang/en.js";
import zh from "../../lang/zh.js";
// locale data


import ConfigStore from './ConfigStore'

export default class ConfigController {
  constructor() {
    this.store = new ConfigStore()
  }
  // 获取app view
  setAppView(view){
    this.app = view;
  }
  setView(view) {
    this.view = view;
  }
  get initState() {
    return (this.store && Util.deepCopy(this.store.state)) || {};
  }
  get nameCny() {
    return this.store.state.nameCny
  }

  get activityState() {
    return this.store.state.activityState
  }

  get currentUrl() {
    return this.store.state.currentUrl
  }

  get language() {
    // return "zh-CN";
    return this.store.language;
  }
  setOs(os){
    this.store.setOs(os)
  }

  changeLanguage(lang){
    this.store.changeLanguage(lang);
    location.reload();
    // this.app.setState({ initDone: false},()=>{
    //   this.loadLocales();
    // })
  }
  // 获取活动状态
  async getActivityState() {
    await this.store.getActivityState();
  }

  //checkVersion
  async checkVersion() {
    let result = await this.store.checkVersion();
    return result;
  }
// 发送渠道号
  async sendStatis(obj){
    if(!process.env.STATICS_FLAG) return;
    let result = await this.store.sendStatis(obj);
    return result;
  }

  get versionAndroidInfo(){
    return this.store.versionAndroidInfo
  }
  get os(){
    return this.store.state.os
  }

  async loadLocales() {
    const locales = {
      "en-US": en(this.store.state),
      "zh-CN": zh(this.store.state)
    };

    // init method will load CLDR locale data according to currentLocale
    // react-intl-universal is singleton, so you should init it only once in your app
    let lang = this.language;
    await intl.init({
      currentLocale: lang, // TODO: determine locale here
      locales,
    });
    this.app.setState({ initDone: true });
  }

}