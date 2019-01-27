import React, {Component} from "react";
import ExchangeViewBase from "@/components/ExchangeViewBase";
import Pagination  from "@/common/baseComponent/Pagination/index.jsx"
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Redirect,
  Switch
} from "react-router-dom";
import OrderOtcInfo from './OrderOtcInfo'

import {
  resolveOrderPath
} from "@/config/UrlConfig"

// import '../stylus/orderOtc.styl'
// import OrderListController from '../../class/orderList/userOrderList/UserOrderListController';


export default class OrderOtc extends ExchangeViewBase {
  constructor(props) {
    super(props);
    this.state = {
    currency: this.intl.get('all'),
      currencyArr: [this.intl.get('all'), 'BTC', 'USDT'],
      otcOrderContent: [],
      count: 0,
      page_no: 1,
      status: 1,
      uid: 0
    };
    this.orderNavItems = [
      {name: this.intl.get("order-ing"), address: '/current', type: 'orderCurrent'},
      {name: this.intl.get("order-com"), address: '/deal', type: 'orderDeal'},
      {name: this.intl.get("order-cancel"), address: '/cancel', type: 'orderCancel'}
    ];
    // const {controller} = this.props;
    //绑定view
    // controller.setView(this);
    //初始化数据，数据来源即store里面的state
    // this.state = Object.assign(this.state, controller.initState);
  }

  componentDidMount() {
    // let pairIdMsg =await this.props.controller.marketController.store.getPairMsg();
    // this.setState(
    //     {
    //       pairIdMsg,
    //       renderFlag: true
    //     }
    // )
  }

  async otcUnread(){
    let otcOrderContent = this.props.controller.store.state.otcOrderContent;
    let result = await this.props.controller.otcUnread();
    let index;
    if(!result)
      return
    result.length && result.map((v) => {
      index = otcOrderContent.findIndex((vv) => JSON.stringify(vv.id) === JSON.stringify(v.oid));
      if(index !== -1){
        otcOrderContent[index].unRead = v.ct
      }
    })
    this.setState({
      otcOrderContent
    })
  }

  async otcOrderStore(state, page_no, role = 0, begin_time = 1, end_time = 1, currency = '', id = 0){
    let otcOrderContent = await this.props.controller.otcOrderStore(state,page_no, role, begin_time, end_time, currency, id);
    this.setState({
      otcOrderContent: otcOrderContent.list || [],
      count: otcOrderContent.count || 0,
      status: state
    })
  }

  async getCurrency(){
    let currencyArr = await this.props.controller.otcController.canDealCoins();
    currencyArr.push(this.intl.get('all'));
    this.setState({
      currencyArr
    })
  }

  async changePage(page_no){
    let otcOrderContent = await this.props.controller.otcOrderStore(this.state.status, page_no);
    this.setState({
      otcOrderContent: otcOrderContent.list,
      page_no
    })
  }

  resetPage=()=>{
    this.state.page_no = 1;
    this.setState({page_no: 1});
  }

  render() {
    const uid = this.props.controller.userController.userId;
    // const {match} = this.props;
    return (
        <div className="order-otc">
          <ul className='order-nav'>
            {this.orderNavItems.map((v, index) => {
              return (
                  <li key={index}>
                    <NavLink activeClassName="active" to={`${'/otc/detail'}${v.address}`}>
                      {v.name}
                    </NavLink>
                  </li>
              )
            })}
          </ul>
          <div className='order-content'>
            <Switch>
              {this.orderNavItems.map((v, index) => (
                  <Route
                      key={index}
                      path={`${'/otc/detail'}${v.address}`}
                      render={({match}) => (
                          <OrderOtcInfo
                              controller={this.props.controller}
                              type={v.type}
                              currency={this.state.currency}
                              currencyArr={this.state.currencyArr}
                              getCurrency={this.getCurrency.bind(this)}
                              otcUnread={this.otcUnread.bind(this)}
                              otcOrderStore={this.otcOrderStore.bind(this)}
                              // resetPage={this.resetPage}
                              otcOrderContent={this.state.otcOrderContent}
                              uid={uid}
                              count={this.state.count}
                          />
                      )}
                  />
              ))}
              <Redirect to={'/otc/detail/current'}/>
            </Switch>
          </div>
        </div>
    )
  }
}
