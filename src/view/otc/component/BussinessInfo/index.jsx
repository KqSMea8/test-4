import React, {Component} from 'react'
import ExchangeViewBase from "@/components/ExchangeViewBase.jsx"
import Bussiness from './components/Bussiness'
import BussinessAd from './components/BussinessAd'
import {getQueryFromPath} from '@/config/UrlConfig'
import Pagination  from "@/common/baseComponent/Pagination/index.jsx"
import './stylus/index.styl'

export default class BussinessInfo extends ExchangeViewBase{
  constructor(props){
    super(props);
    this.state = {
      adType: 'buy',
      bussinessInfo: {},
      adList: [],
      authenState: null,
      count: 0,
      page_no: 1
    };
    this.type = 1;
    this.changeAdType = this.changeAdType.bind(this)
    props.controller.setView(this)
  }
  async componentDidMount(){
    let trader = JSON.parse(getQueryFromPath('trader'));
    this.props.controller.changeKey('uid', trader);
    this.props.controller.changeKey('trader', trader);
    // this.props.controller.changeKey('type', 1);
    let bussinessInfo = await this.props.controller.traderInfo();
    let adList = await this.props.controller.otcSales('', 0, trader, 1, 2, 7, 1, 10, 0);
    let getUserAuthData = this.props.controller.userId ? await this.props.controller.userController.getUserAuthData() : null;
    let getPaymentAccounts = await this.props.controller.userController.getPaymentAccounts('getPaymentAccounts', getPaymentAccounts);
    this.getPaymentAccounts = (getPaymentAccounts.paymentList || []).filter(v=> !!v.usable);
    this.setState({
      bussinessInfo,
      adList: adList.sales || [],
      authenState: getUserAuthData ? getUserAuthData.userAuth.state : 0,
      count: adList.count
    });
  }
  async changeAdType(v){
    let trader = JSON.parse(getQueryFromPath('trader'));
    let type = v === 'buy' ? 1 : 2;
    this.type = type;
    let adList = await this.props.controller.otcSales('', 0, trader, type, 2, 7, 1, 10, 0);
    this.setState({
      adType: v,
      adList: adList.sales || [],
      count: adList.count
    })
  }
  enterConfirm(v){
    this.props.controller.enterConfirm({
      id: JSON.stringify(v.id),
      trader: JSON.stringify(v.sid),
      type: this.state.adType,
      authenState: this.state.authenState
    })}
    
  async changePage(page_no){
    let trader = JSON.parse(getQueryFromPath('trader'));
    this.props.controller.changeKey('page_no', page_no);
    let adList = await this.props.controller.otcSales('', 0, trader, this.type, 2, 7, page_no, 10, 0);
    this.setState({
      adList: adList.sales,
      page_no
    })
  }
  render(){
    return(
        <div className='otc-bussiness'>
          <Bussiness bussinessInfo={this.state.bussinessInfo}/>
          <BussinessAd
              adType={this.state.adType}
              changeAdType={this.changeAdType}
              adList={this.state.adList}
              enterConfirm={this.enterConfirm.bind(this)}
          />
          <div className={`bussiness-list-page`}>
            <Pagination
                total={this.state.count || 0}
                showTotal={true}
                pageSize={10}
                onChange={this.changePage.bind(this)}
                showQuickJumper={true}
                currentPage={this.state.page_no}/>
          </div>
        </div>
    )
  }
}