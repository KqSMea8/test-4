import React, { Component } from "react";
import intl from "react-intl-universal";
import {Link} from 'react-router-dom'
import "../style/noticeDetail.styl"

export default class NoticeContentDetail extends Component {
  constructor(props) {
    super(props);
    this.intl = intl;
    this.state = {
      queryType: 0, // 根据字段判断类型
      queryId: "", // 取传过来id
      idType: "" // 判断传过来的是noiceId还是infoId
    };
    const {controller} = props;
    //绑定view
    controller.setView(this);
    //初始化数据，数据来源即store里面的state
    this.state = Object.assign(this.state, controller.initState);
    this.getNotificationCon = controller.getNotificationCon.bind(controller);// 获取资讯公告
    this.activityCon = controller.activityCon.bind(controller); // 获取详情
    this.cleartActivity = controller.cleartActivity.bind(controller); // 清除详情
  }

  componentWillMount() {
    let url = window.location.search, str1, str2;
    str1 = url.split('?');
    str2 = str1[1].split('=');
    this.setState({
      idType: str2[0],
      queryType: str2[0] === 'noticeId' ? 0 : 2,
      queryId: str2[1] * 1
    })
  }

  async componentDidMount() {
    this.cleartActivity();
    await Promise.all([
      this.activityCon(this.state.queryId, this.state.queryType),
      this.getNotificationCon(0, 10, this.state.queryType)
    ]);
  }

  async checkNotice(v, index) { // 点击侧边栏获取详情
    this.props.history.push(`/detail?${this.state.idType}=${v.activityId}`)
  }

  render() {
    let activityInfo = this.state.activityList;
    let activityRecommend, link;
    activityInfo.catalog && (activityRecommend = eval(activityInfo.recommend));
    activityInfo.catalog && (link = eval(activityInfo.recommendLink));
    return (
      <div className="notice-detail-wrap">
        <h1>
          <Link to={this.state.queryType === 0 ? '/public' : '/info'}>
            {this.state.queryType === 0 ? this.intl.get("newsView") : this.intl.get("infoView")}
          </Link>
          <b>{this.state.queryType === 0 ? this.intl.get("notice-detail") : this.intl.get("info-detail")}</b>
        </h1>
        <div className="clearfix notice-detail-con">
          <ul className="notice-nav fl">
            <li>{this.state.queryType === 0 ? this.intl.get("notice-newNotice") : this.intl.get("notice-info")}</li>
            {(Object.keys(this.state.notificationList).length && this.state.notificationList.data.length && this.state.notificationList.data.map((v, index) => (
              <li className={`clearfix ${this.state.queryId === v.activityId ? 'active' : ''}`}
                key={index}
                onClick={state => this.checkNotice(v, index)}>{v.subject}</li>)) || null)}
          </ul>
          <div className="fl notice-detail-con-right">
            <h2>
              {activityInfo.subject}
              {/*<b>*/}
              {/*{activityInfo.createdAt &&*/}
              {/*activityInfo.createdAt.toDate("yyyy-MM-dd HH:mm:ss")}*/}
              {/*</b>*/}
            </h2>
            <div className="con-detail">
              {this.state.queryType ? <h3>
                {/* 从比特节点数据获悉，跟着区块链热度一起上涨的，还有比特币世界中全节点的数量。全球比特币全节点数量在2018年2月之前，一直处于相对稳定的10000点左右状态，中国在全球的全节点占有率在5%到8%之间，但是自2月后突然猛增，一直到3月，全球市场占有率飙升至17%，全球排名也超过一直稳居老二的德国，跃居全球第二，目前排在第一位的仍是美国。 */}
                {activityInfo.abstract}
              </h3> : ''}
              <div className="content">
                {/* {activityInfo.catalog ? <img src={`${this.props.controller.configData.currentImgUrl}downloadimage/origin/${activityInfo.titleImage}`} alt="" /> : ''} */}
                <div dangerouslySetInnerHTML={{__html: activityInfo.content}}></div>
              </div>
              {activityInfo.catalog ? <div>
                <h5>
                  <span>{this.intl.get("notice-link")}：</span>
                  <a href={`${activityInfo.source}`} target="_blank">{`${activityInfo.source}`}</a>
                </h5>
                {link && <h6>
                  <span>{this.intl.get("notice-recommend")}：</span>
                  {activityRecommend && activityRecommend.map((v, i) => <a href={link[i]} target="_blank" key={i}>{v}</a>)}
                </h6>}
              </div> : ''}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
