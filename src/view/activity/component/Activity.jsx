import React, { Component } from 'react';
import {
  Route,
  Redirect,
  Switch
} from 'react-router-dom'
import {
  resolveActivityPath,
  goHomePath,
  getQueryFromPath,
  formatQueryToPath
} from '@/config/UrlConfig';
import ActivityGiving from './component/ActivityGiving.jsx' // 注册活动

import Translate from '@/core/libs/Translate'
import ActivityLang from '../lang'

class Activity extends Component {
  constructor(props) {
    super(props);
    this.sendStatis = props.controller.configController.sendStatis.bind(props.controller.configController)
  }

  render() {
    let inviteId = (getQueryFromPath('in') ? getQueryFromPath('in') : getQueryFromPath('uid')) || '';
    const Giving = props => {
      return <ActivityGiving history={this.props.history} controller={this.props.controller} sendStatis={this.sendStatis}/>;
    };
    return (
      <div className="route">
        <Switch>
          <Route path={('/register')} render={props => (<Giving {...props}/>)} />
          <Redirect to={formatQueryToPath('/register', {in: inviteId})} />
        </Switch>
      </div>
    )
  }
}

export default Translate(Activity, ActivityLang)
