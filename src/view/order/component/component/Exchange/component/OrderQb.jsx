import React, {Component} from "react";
import ExchangeViewBase from "@/components/ExchangeViewBase";
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Redirect,
  Switch
} from "react-router-dom";
import OrderCurrent from './OrderCurrent'

import {
  resolveOrderPath
} from "@/config/UrlConfig"

import '../stylus/orderQb.styl'
// import OrderListController from '../../class/orderList/userOrderList/UserOrderListController';


export default class OrderQb extends ExchangeViewBase {
  constructor(props) {
    super(props);
    this.state = {
      pairIdMsg: {},
      renderFlag: false,
      orderNavItems: [
        {name: this.intl.get("order-pro-cur"), address: '/current', type: 'orderCurrent'},
        {name: this.intl.get("order-pro-his"), address: '/history', type: 'orderHistory'},
        {name: this.intl.get("order-deal"), address: '/deal', type: 'orderDeal'}
      ]
    };
    // const {controller} = this.props;
    //绑定view
    // controller.setView(this);
    //初始化数据，数据来源即store里面的state
    // this.state = Object.assign(this.state, controller.initState);
  }
  
  componentWillMount() {
  
  }
  
  async componentDidMount() {
    let pairIdMsg =await this.props.controller.marketController.store.getPairMsg();
    this.setState(
        {
          pairIdMsg,
          renderFlag: true
        }
    )
  }
  
  render() {
    // const {match} = this.props;
    return (
        <div className='order-qb-detail'>
              <ul className='order-nav'>
                {this.state.orderNavItems.map((v, index) => {
                  return (
                      <li key={index}>
                        <NavLink activeClassName="active" to={`/qb/detail${v.address}`}>
                          {v.name}
                        </NavLink>
                      </li>
                  )
                })}
              </ul>
            <div className='order-content'>
              <Switch>
                <Route path={'/qb/detail/current'} component={({match}) => (
                    <OrderCurrent controller={this.props.controller} type='orderCurrent' pairIdMsg={this.state.pairIdMsg} pvType='currentOrder'/>
                )}/>
                <Route path={'/qb/detail/history'} component={({match}) => (
                  <OrderCurrent controller={this.props.controller} type='orderHistory' pairIdMsg={this.state.pairIdMsg} pvType='orderHistory'/>
                )}/>
                <Route path={'/qb/detail/deal'} component={({match}) => (
                   <OrderCurrent controller={this.props.controller} type='orderDeal' pairIdMsg={this.state.pairIdMsg} pvType='dealHistory'/>
                )}/>
                <Redirect to={'/qb/detail/current'}/>
              </Switch>
            </div>
        </div>
    )
  }
}
