import ExchangeStoreBase from '../ExchangeStoreBase'

export default class NoticeStore extends ExchangeStoreBase {
  constructor() {
    super("notice", "general");
    this.state = {
      activityList: {},
      userNotice: {}, // 用户通知列表
      userNoticeHeader: {},
      notificationList: {} // 获取资讯公告列表
    };
    // websocket监听用户资产更新推送
    this.WebSocket.general.on("userNoticeUpdata", data => {
      // console.log("userNoticeUpdata-websocket", data);
      this.controller.userNoticeUpdata(data);
    });
    this.WebSocket.general.on('otcChatReply', data => {
      if(window.location.href.includes('/otc/content')){
        this.controller.userOrderController.chatItemWs(data)
      }
      else {
        this.controller.popupController.setState({
          isShowTip: true,
          autoClose: true
        })
      }
    })
  }

  setController(ctl) {
    this.controller = ctl
  }

  async notificationCon(page, pageSize, type) { // 获取资讯公告
    let res = await this.Proxy.getActivity({
      id: 0,
      ty: type, //类型 0公告 1新闻 2资讯
      con: 0, //内容类型 0则不返回content 1则返回全部数据
      p: page,
      ps: pageSize,
      la: {"en-US": 0, "zh-CN": 1}[this.controller.configController.language] || 0,
    });
    if (!res) return;
    let notificationList = {
      page: res.p,
      totalCount: res.c,
      data: [],
    };
    res.d && res.d.map(item => {
      notificationList.data.push({
        catalog: item.cat,
        activityId: item.id,
        subject: item.su,
        content: item.cnt,
        source: item.s,
        createdAt: item.t,
        titleImage: item.tim,
        recommend: item.re,
        recommendLink: item.url,
        abstract: item.ab,
      });
    });
    this.state.notificationList = notificationList;
    return notificationList;
  }

  async userNotice(unRead, page, pageSize) { // 获取用户通知列表
    // unRead 0 全部 1未读, page, pageSize 0 全部
    let res = await this.Proxy.getUserNocticeList({
      token: this.controller.token,
      ur: unRead,
      p: page,
      s: pageSize
    });
    if (!res) return;
    let userNotice = {
      totalCount: res && res.tc,
      list: [],
    };
    res.l && res.l.map(item => {
      userNotice.list.push({
        id: item.id,
        isRead: item.ir,
        content: item.c,
        createAt: item.t,
      });
    });
    userNotice = userNotice ? userNotice : {};
    if (unRead) {
      this.state.userNoticeHeader = userNotice
    }
    this.state.userNotice = userNotice;
    // console.log('通知列表', userNotice)
    return userNotice
  }

  async activityCon(activityId, activityType) { // 活动详情
    let res = await this.Proxy.getActivity({
      id: activityId,
      ty: activityType,
      con: 1,
      p: 0,
      ps: 10,
      la: {"en-US": 0, "zh-CN": 1}[this.controller.configController.language] || 0,
    });
    if (!res) return;
    let activityList = {
      page: res.p,
      totalCount: res.c,
      data: [],
    };
    res.d && res.d.map(item => {
      activityList.data.push({
        catalog: item.cat,
        activityId: item.id,
        subject: item.su,
        content: item.cnt,
        source: item.s,
        createdAt: item.t,
        titleImage: item.tim,
        recommend: item.re,
        recommendLink: item.url,
        abstract: item.ab,
      });
    });
    activityList = res.msg ? [] : activityList.data.length && activityList.data[0];
    this.state.activityList = activityList;
    return activityList
  }

}