import React, {Component} from "react";
import ExchangeViewBase from "@/components/ExchangeViewBase";
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Redirect,
  Switch
} from "react-router-dom";
import '../stylus/nav.styl'
import {
  resolveOrderPath
} from "@/config/UrlConfig"

export default class Nav extends ExchangeViewBase {
  constructor(props) {
    super(props);
    this.state = {
      pairIdMsg: {},
      renderFlag: false,
      orderNavItems: [
        {name: this.intl.get("order-currency"), address: '/qb/detail'},
        {name: this.intl.get("order-digital"), address: '/otc/detail'},
        {name: this.intl.get("order-fund"), address: '/fund/detail'},
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
    // let pairIdMsg =await this.props.controller.marketController.store.getPairMsg();
    // this.setState(
    //     {
    //       pairIdMsg,
    //       renderFlag: true
    //     }
    // )
  }

  render() {
    // const {match} = this.props;
    return (
      <div className='order-pro-manage'>
        <ul className='order-nav'>
          {this.state.orderNavItems.map((v, index) => {
            return (
              <li key={index}>
                <NavLink activeClassName="active" to={v.address}>
                  {v.name}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}

