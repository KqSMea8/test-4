import React, {Component} from 'react';
import ExchangeViewBase from '@/components/ExchangeViewBase'


import {AsyncAll, Regular} from '@/core'

export default class BaseInfo extends ExchangeViewBase {
  constructor(props) {
    super(props);
  }

  render() {
    const {userInfo, changeSetPopup} = this.props;
    return (
      <div className="basic-data model-div clearfix">
        <h2>{this.intl.get("user-base")}</h2>
        <ul className="fl clearfix">
          <li>
            <strong>{this.intl.get("user-id")}</strong>
            <b>{JSON.stringify(userInfo.userId) || ''}</b>
          </li>
          <li>
            <strong>{this.intl.get("email")}</strong>
            <b className={`${userInfo.email ? '' : 'basic-popup'}`}
               onClick={state => !userInfo.email && changeSetPopup && changeSetPopup(1)}>{userInfo.email && userInfo.email || this.intl.get("user-popBindEmail")}</b>
          </li>
          <li>
            <strong>{this.intl.get("phone")}</strong>
            <b className={`${userInfo.phone ? '' : 'basic-popup'}`}
               onClick={state => !userInfo.phone && changeSetPopup && changeSetPopup(2)}>
              {userInfo.phone && userInfo.phone || this.intl.get("user-phone-bind")}
              {/*{userInfo.phone && <span onClick = {state => changeSetPopup(7)}>{this.intl.get('alter')}</span>}*/}
            </b>
          </li>

          {/*<li>{this.intl.get("user-level")}</li>*/}
          {/*<li>*/}
          {/*<Link to="/help/pricing">VIP{userInfo.level}</Link>*/}
          {/*({this.intl.get("points")}：<Link to="/user/integration"*/}
          {/*className="user-score">{this.state.userCreditsNum}</Link>)*/}
          {/*</li>*/}
          {/*{userInfo.googleAuth === 0 && <li>*/}
          {/*<em>{this.intl.get("user-googleVerify")}</em>*/}
          {/*<i onClick={() => {this.setState({modifyGoogle: true});}}>{this.intl.get('alter')}</i>*/}
          {/*</li>}*/}
        </ul>
      </div>
    );
  }
}