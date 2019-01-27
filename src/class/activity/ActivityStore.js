import ExchangeStoreBase from '../ExchangeStoreBase'

export default class NoticeStore extends ExchangeStoreBase {
  constructor() {
    super('activity');
    this.state = {
      recordList: [],
      rankingList: [],
      bannerImgUrl:'',
      pr: 5,
      aw: 20,
      tv: 5000000,
      ranking: 0,
      award: 0,
      inviteCode: ""
    }
  }
  setController(ctl) {
    this.controller = ctl
  }

  // 获取我的QBT
  async getMyQbt(token) {
    let result = await this.Proxy.getMyQbt({
      token: token
    });
    if (result && result.id) {
      return {
        availableCount: result.aw,
        price: result.p,
        coinIcon: "",
        coinId: "",
        coinName: this.controller.configData.coin,
        fullName: this.controller.configData.coin,
        valuationCN: result.vl
      };
    }
    return false;
  }
  // 获取QBT信息
  async getQbtInfo() {
    // console.log(this.controller.token);
    let result = await this.Proxy.getQbtInfo();
    if (result) {
      return {
        coinNameCN: result.d.cn,
        coinNameEN: result.d.ne,
        des: result.d.des,
        priceCN: result.d.pc,
        priceEN: result.d.pe,
        publishTime: result.d.rt,
        publishNum: result.d.tv,
        circulationNum: result.d.cv,
        crowdfundingPrice: result.d.ipc,
        website: result.d.ws,
        locationSearch: result.d.bs,
        description: result.d.des

      };
    }
    return false;
  }

  async getAward(account, inviter){
    let result = await this.Proxy.getAward({
      ac: account, // 账号
      in: inviter // 邀请人账号
    });
    return result;
  }

  async getHomeBanner(activityStatus, activityPosition,it) {
    let result = await this.Proxy.getHomeBanner({
      os: 3,
      st : activityStatus,
      ps : activityPosition,
      it: it,
    });

    this.state.homeBanner = result && result.al
    return this.state.homeBanner
  }

  async getInvited(page = 1, pageSize = 10, needCount = true){
    let resultObj = {};
    let result = await this.Proxy.getInvited({
      token: this.controller.userToken,
      p: page, // 页码
      s: pageSize, // 单页数量
      nc: needCount // 是否需要总数 bool值
    });
    resultObj.list = result && result.l && result.l.map(v=>{
      return {
        "inviterAccount": v.ac,
        "addCount": v.rb,
        "time": v.t,
        "verify": v.v
      }
    })
    resultObj.countAll = result.tv || 0;
    resultObj.inviteNum = result.ia || 0;
    return resultObj;
  }

  async getRankingList(userToken, page = 1, pageSize = 10){
    let result = await this.Proxy.getRankingList({
      token: userToken,
      p: page,
      s: pageSize
    })
    let resultObj = {}
    resultObj.list = result && result.l && result.l.map(v=>{
      return {
        "avatar": v.av,
        "inviterAccount": v.ac,
        "award": v.aw,
        "serialNumber": v.ser
      }
    })
    this.state.award = resultObj.award = result.r
    this.state.ranking = resultObj.ranking = result.aw
    return resultObj
  }

  async getInviteCode(token){ // 获取邀请码
    let result = await this.Proxy.getInviteCode({
      token
    })
    this.state.inviteCode = result.ic
    return result.ic
  }
}