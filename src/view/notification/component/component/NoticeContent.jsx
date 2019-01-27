import React, { Component } from "react";
import intl from "react-intl-universal";
import {Link} from 'react-router-dom'
import Pagination from '@/common/baseComponent/Pagination/index.jsx'
import { COMMON_NOTHING_WHITE } from '@/config/ImageConfig';

export default class NoticeContent extends Component {
  constructor(props) {
    super(props);
    this.intl = intl;
    this.state = {
      type: 0,
      idType: '',
      page: 1,
      totalPage: 0
    };
    const {controller} = props;
    //绑定view
    controller.setView(this);
    //初始化数据，数据来源即store里面的state
    this.state = Object.assign(this.state, controller.initState);
    this.getNotificationCon = controller.getNotificationCon.bind(controller) // 获取资讯公告
    this.cleartNotification = controller.cleartNotification.bind(controller) // 清除资讯公告
  }

  componentWillMount() {
    this.setState({
      type: window.location.href.includes('public') ? 0 : 2,
      idType: window.location.href.includes('public') ? 'noticeId' : 'infoId'
    })
  }

  async componentDidMount() {
    this.cleartNotification()
    let url = this.props.location.pathname.split('/')[2];
    let result = await this.getNotificationCon(0, 15, this.state.type);
    this.setState(result);

    // 统计访问量
    // this.props.sendStatis({
    //   event: 'notificationPV',//操作代码
    //   type: url,//tab
    // })
  }

  componentWillUnmount() {

  }

  componentDidUpdate(preProps, preState) {

  }

  render() {
    return (
      <div className="notice-content fl">
        <div className="notice-content-wrap">
          <div>
            {this.state.notificationList && Object.keys(this.state.notificationList).length && this.state.notificationList.data.length ? (
              <ul className="con-ul">
                {this.state.notificationList && Object.keys(this.state.notificationList).length && this.state.notificationList.data.length && this.state.notificationList.data.map((v, index) => (
                  <Link to={`/detail?${this.state.idType}=${v.activityId}`} key={index} target="_blank">
                    <li className="clearfix">
                      <i>{v.subject}</i>
                      <span>{v.createdAt.toDate('yyyy-MM-dd HH:mm:ss')}</span>
                    </li>
                  </Link>
                ))}
              </ul>) : (<div className="nothing-div"><img src={COMMON_NOTHING_WHITE} alt=""/>
              <p>{this.intl.get("notice-none")}</p></div>)}

            {this.state.notificationList && Object.keys(this.state.notificationList).length && this.state.notificationList.data.length ?
              <Pagination total={this.state.totalPage || this.state.notificationList.totalCount || 0}
                          pageSize={15}
                          showTotal={true}
                          onChange={page => {
                            this.setState({page});
                            this.getNotificationCon(page - 1, 15, this.state.type)
                          }}
                          currentPage={this.state.page}
                          showQuickJumper={true}/> : ''}
          </div>
        </div>
      </div>
    );
  }
}