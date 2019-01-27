import React, { Component } from "react";
import intl from "react-intl-universal";
import {
  resolveNotificationPath
} from "@/config/UrlConfig"

export default class HomeNotice extends Component {
  constructor(props) {
    super(props);
    this.intl = intl;
    this.state = {
      top1: 0,
      top2: 100,
      criticalArr: [0, 100]
    };
    const {controller} = props;
    // 绑定view
    controller.setView(this);
    // 初始化数据，数据来源即store里面的state
    this.state = Object.assign(this.state, controller.initState);
    this.getNotificationCon = controller.getNotificationCon.bind(controller) // 获取公告
  }

  async componentDidMount() {
    await this.getNotificationCon(0, 3, 0);
  }

  render() {
    return <div className={`${this.state.notificationList && Object.keys(this.state.notificationList).length && this.state.notificationList.data.length ? "" : "hide"} home-notice-wrap-pro`}>
      {this.state.notificationList && Object.keys(this.state.notificationList).length && this.state.notificationList.data.length && <div className="home-notice-content">
        <ul>
          {this.state.notificationList && Object.keys(this.state.notificationList).length && this.state.notificationList.data.length && this.state.notificationList.data.map((v, index) => <li key={index}>
            <a href={resolveNotificationPath('/detail', {noticeId: v.activityId})} target="_blank">
              【{v.createdAt.toDate('MM-dd')}】{v.subject}
            </a>
          </li>)}
          <li className="more-li">
            <a href={resolveNotificationPath('/public')} target="_blank">{this.intl.get("more")}</a>
          </li>
        </ul>
      </div> || null}
    </div>;
  }
}
