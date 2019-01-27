import React, {Component} from "react";
import ExchangeViewBase from "@/components/ExchangeViewBase";
import {
  Route,
  Redirect,
  Switch
} from "react-router-dom";
// import OrderConfirm from './component/OrderConfirm/'
// import OrderDetail from './component/OrderDetail/'
// import OrderContent from './component/OrderContent/'
import Qb from './component/Exchange/'
import Otc from './component/Otc/'
import Fund from './component/Taoli/'

// import './component/OrderDetail/stylus/order.styl'

import Translate from '@/core/libs/Translate'
import OrderLang from '../lang'


class Order extends ExchangeViewBase {
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
    return (
        <div className="order-manage-wrap">
          <Switch>
            <Route path={'/qb'} render={({match}) => ( <Qb controller={this.props.controller}/>
            )}/>
            <Route path={'/otc'} render={({match, history}) => ( <Otc controller={this.props.controller} history={history}/>
            )}/>
            <Route path={'/fund'} render={({match}) => ( <Fund controller={this.props.controller}/>
            )}/>
            <Redirect to={'/qb'}/>
          </Switch>
        </div>
    )
  }
}

export default Translate(Order, OrderLang)