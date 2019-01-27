import React, { Component } from "react";
import intl from "react-intl-universal";
import {
  Route,
  NavLink,
  Redirect,
  Switch
} from 'react-router-dom'

import NoticeContent from './component/NoticeContent.jsx' // 资讯公告
import NoticeContentDetail from './component/NoticeContentDetail.jsx' // 资讯详情
import "./style/notification.styl"

import Translate from '@/core/libs/Translate'
import NotificationLang from '../lang'

import {
  resolveNotificationPath
} from "@/config/UrlConfig"

class Notification extends Component {
  constructor(props) {
    super(props);
    this.intl = intl;
    this.controller = props.controller;
    // this.sendStatis={this.sendStatis}sendStatis = props.controller.configController.sendStatis.bind(props.controller.configController)
  }

  render() {
    const {controller} = this.props;
    return (
      <div className="clearfix notice-wrap">
        {!window.location.href.includes('detail') && <ul className="notice-nav fl" >
          <li><NavLink activeClassName="active" to={'/public'}>{this.intl.get("notice-newNotice")}</NavLink></li>
          <li><NavLink activeClassName="active" to={'/info'}>{this.intl.get("notice-info")}</NavLink></li>
        </ul>}
        <div>
          <Switch>
            {/*sendStatis={this.sendStatis}*/}
            <Route path={'/public'} component={({match, location}) => (
              <NoticeContent controller={controller} match={match} location={location}/>
            )}/>
            <Route path={'/info'} component={({match, location}) => (
              <NoticeContent controller={controller} match={match} location={location}/>
            )}/>
            <Route path={'/detail'} component={({match, location, history}) => (
              <NoticeContentDetail controller={controller} match={match} location={location} history={history}/>
            )}/>
            <Redirect to={'/public'}/>
          </Switch>
        </div>
      </div>
    );
  }
}

export default Translate(Notification, NotificationLang)
