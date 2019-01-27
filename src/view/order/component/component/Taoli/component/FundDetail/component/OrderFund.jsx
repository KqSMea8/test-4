import React, {Component} from "react";
import ExchangeViewBase from "@/components/ExchangeViewBase";
import PropTypes from "prop-types"
// import {resolveOrderPath} from '@/config/UrlConfig'
import {NavLink, Redirect, Route, Switch} from "react-router-dom";
import OrderFundInfo from "./OrderFundInfo";

export default class FundCon extends ExchangeViewBase {
  static defaultProps = {};
  static propTypes = {};

  constructor(props) {
    super(props);
    this.orderNavItems = [
      // {name: this.intl.get("order-wait-pay"), address: '/fund/detail/pay', type: 'orderWaitPay'},
      {name: this.intl.get("order-wait-confirm"), address: '/fund/detail/confirm', type: 'orderWaitConfirm'},
      {name: this.intl.get("order-com"), address: '/fund/detail/deal', type: 'orderDeal'},
      // {name: this.intl.get("order-cancel"), address: '/fund/detail/cancel', type: 'orderCancel'}
    ];
  }

  render() {
    return (
      <div className={'order-fund'}>
        <ul className='order-nav'>
          {this.orderNavItems.map((v, index) => {
            return (
              <li key={index}>
                <NavLink activeClassName="active" to={v.address}>
                  {v.name}
                </NavLink>
              </li>
            )
          })}
        </ul>
        <div className='order-fund-content'>
          <Switch>
            {this.orderNavItems.map((v, index) => (
              <Route
                key={index}
                path={v.address}
                component={({history}) => (
                  <OrderFundInfo
                    history={history}
                    controller={this.props.controller}
                    routeType={v.type}
                  />
                )}
              />
            ))}
            <Redirect to={'/fund/detail/confirm'}/>
          </Switch>
        </div>
      </div>
    )
  }
}