import React, {Component} from 'react';
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Redirect,
  Switch
} from 'react-router-dom'

import UserSafeCenter from './component/userSafe' // 安全中心
import UserIdentity from './component/UserIdentity.jsx' // 身份认证
import UserInvite from './component/UserInvite.jsx' // 我的邀请
// import UserScore from './children/UserScore.jsx' // 我的积分

// import "./stylus/user.styl"
import "./style/index.styl"
import ExchangeViewBase from "@/components/ExchangeViewBase";
import Translate from '@/core/libs/Translate'
import UserLang from '../lang'


class User extends ExchangeViewBase {
  constructor(props) {
    super(props);
    this.controller = props.controller;
    // this.sendStatis = props.controller.configController.sendStatis.bind(props.controller.configController)
  }

  render() {
    const {controller} = this.props;
    // let match = this.props.match;
    return (
      <div className="user-big-wrap" style={{minHeight: `${window.innerHeight - 210}px`}}>
        <div className="clearfix user-wrap" style={{minHeight: `${window.innerHeight - 210}px`}}>
          <ul className="user-nav fl">
            <li><NavLink activeClassName="active" to={('/safe')} >{this.intl.get("header-security")}</NavLink></li>
            <li><NavLink activeClassName="active" to={('/identity')}>{this.intl.get("header-idVerify")}</NavLink></li>
            <li><NavLink activeClassName="active" to={('/invite')}>{this.intl.get("user-invite")}</NavLink></li>
            {/*<li><NavLink activeClassName="active" to={`${match.url}/integration`}>{this.intl.get("user-score")}</NavLink></li>*/}
          </ul>
          <div className="user-content fl" style={{minHeight: `${window.innerHeight - 2.1 * 100}px`}}>
            <Switch>
              <Route path={('/safe')} component={({match, history}) => (
                <UserSafeCenter controller={controller} history={history}/>
              )}/>
              <Route path={('/identity')} component={({match}) => (
                <UserIdentity controller={controller}/>
              )}/>
              <Route path={('/invite')} component={({match}) => (
                <UserInvite controller={controller.activityController}/>
              )}/>
              {/*<Route path={`${match.url}/integration`} component={({match}) => (*/}
              {/*<UserScore controller={controller} sendStatis={this.sendStatis}/>*/}
              {/*)}/>*/}
              <Redirect to={('/safe')} />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

export default Translate(User, UserLang)
