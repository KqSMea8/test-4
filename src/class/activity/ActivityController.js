
import ActivityStore from './ActivityStore'
import ServerConfig from "../../config/ServerConfig"
import Util from "@/core/libs/GlobalUtil";
import copy from '@/core/copy';
import {swiper, swiperClear, swiperStop} from '@/core/swiper'
import {
  resolveActivityPath
} from "@/config/UrlConfig"

export default class ActivityController {
  constructor() {
    this.store = new ActivityStore()
    this.store.setController(this);
    this.getWatchToken = this.store.getWatchToken;
    this.swiper = swiper;
    this.swiperClear = swiperClear;
    this.swiperStop = swiperStop;
    this.copy = copy;
  }

  setView(view) {
    this.view = view;
  }


  // 获取我的QBT
  async getMyQbt() {
    let token = this.userToken;
    let result = await this.store.getMyQbt(token);
    if (result) this.view && this.view.setState({ Qbt: result });
    return result;
  }
  // 获取QBT信息
  async getQbtInfo() {
    let result = await this.store.getQbtInfo();
    if (result) this.view.setState({ QbtInfo: result });
    return result;
  }
  get configData() {
    return this.configController.initState
  }

  get userId() {
    return this.userController.userId
  }

  get userToken() {
    return this.userController.userToken
  }

  get account() {
    return this.userController.userInfo.phone || this.userController.userInfo.email
  }

  get address() {
    // console.log(1111, this.configData.activityState)
    let address = this.configData.activityState ? `${ServerConfig.hSecure && "https" || 'http'}://${ServerConfig.host}/activity/register/?uid=${this.userId || ''}` : `${ServerConfig.hSecure && "https" || 'http'}://${ServerConfig.host}/register/?uid=${this.userId || ''}`
    return address
  }

  get initState() {
    return (this.store && Util.deepCopy(this.store.state)) || {};
  }

  shareAddress(inviteCode) {
    let url = `${ServerConfig.hSecure && "https" || 'http'}:${resolveActivityPath('/register', {in: inviteCode || ''})}`
    return url
  }

  async getHomeBanner(activityStatus, activityPosition,it) {
    let homeBanner = await this.store.getHomeBanner(activityStatus, activityPosition,it)
    this.view.setState({homeBanner});
  }

  async getInvited(page, pageSize, needCount) {
    if (!this.configData.activityState) {
      return true
    }
    let getInvitObj = await this.store.getInvited(page, pageSize, needCount)
    this.view.setState({
      list: getInvitObj.list,
      countAll: getInvitObj.countAll,
      inviteNum: `${getInvitObj.inviteNum}${this.configData.coin}`
    })
  }

  // 注册活动
  async getAward(account, inviter="") {
    let result = await this.store.getAward(account, inviter);
    return result
  }

  async getInviteCode() {
    let result = await this.store.getInviteCode(this.userToken);
    this.view.setState({
      inviteCode: result
    })
  }
}