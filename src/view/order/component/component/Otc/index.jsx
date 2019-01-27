import React, {Component} from "react";
import ExchangeViewBase from "@/components/ExchangeViewBase";
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Redirect,
  Switch
} from "react-router-dom";
import OrderConfirm from './component/OtcConfirm/'
import OtcDetail from './component/OtcDetail/'
import OrderContent from './component/OtcContent/'
// import Qb from './component/Exchange/'

import './style/order.styl'


import {
  resolveOrderPath
} from "@/config/UrlConfig"


export default class Otc extends ExchangeViewBase {
  constructor(props) {
    super(props);
    this.state = {
    };
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
            <Route path={'/otc/detail'} component={({match}) => ( <OtcDetail controller={this.props.controller}/>
            )}/>
            {/*<Route path={`${order}/content`} component={({match}) => ( <OrderDetail controller={this.props.controller}/>*/}
            )}/>
            <Route path={'/otc/confirm'} component={({match, history}) => (<OrderConfirm controller={this.props.controller} history={history}/>
            )}/>
            <Route path={'/otc/content'} component={({match}) => ( <OrderContent controller={this.props.controller}/>
            )}/>
            {/*<Route path={`${order}/detail`} render={OrderD} />*/}
            <Redirect to={'/otc/detail'}/>
          </Switch>
        </div>
    )
  }
}
