import React, {Component} from "react";
import ExchangeViewBase from "@/components/ExchangeViewBase";
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Redirect,
  Switch
} from "react-router-dom";
import FundConfirm from './component/FundConfirm/'
import FundDetail from './component/FundDetail/'

import {
  resolveOrderPath
} from "@/config/UrlConfig"

export default class FundOrder extends ExchangeViewBase {
  constructor(props) {
    super(props);
    this.state = {};
    // const {controller} = this.props;
    //绑定view
    // controller.setView(this);
    //初始化数据，数据来源即store里面的state
    // this.state = Object.assign(this.state, controller.initState);
  }

  render() {
    // const {match} = this.props;
    return (
      <div>
        <Switch>
          <Route path={'/fund/detail'}
                 render={({history}) => (<FundDetail controller={this.props.controller} history={history}/>)}/>
          <Route path={'/fund/confirm'}
                 render={({history}) => (<FundConfirm controller={this.props.controller} history={history}/>)}/>
          {/*<Route path={`${order}/detail`} render={OrderD} />*/}
          <Redirect to={'/fund/detail'}/>
        </Switch>
      </div>
    )
  }
}
