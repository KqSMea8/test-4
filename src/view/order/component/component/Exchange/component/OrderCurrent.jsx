import ExchangeViewBase from '@/components/ExchangeViewBase'
import React, {Component} from "react";
import SelectButton from "@/common/baseComponent/SelectButton";
import Button from "@/common/baseComponent/Button";
import DatePicker from "@/common/baseComponent/DatePicker/DatePicker";
import Pagination from "@/common/baseComponent/Pagination";
const scrollbot = require('simulate-scrollbar');
import {
  COMMON_CHECKBOX_NORMAL,
  COMMON_CHECKBOX_SELECT
} from '@/config/ImageConfig'
import '../stylus/orderDetail.styl'

export default class OrderCurrent extends ExchangeViewBase {
  constructor(props) {
    super(props);
    this.name = 'orderOrder';
    this.state = {
      preArray: [],
      searchSaveFlag:false,
      // startTime: 1509484067,
      // endTime: 1530088867,
      "startTime": Math.floor(new Date().getTime() / 1000) - 7 * 24 * 60 * 60,
      "endTime": Math.floor(new Date().getTime() / 1000),
      coinArray: [],
      marketArray: [],
      idArray: [],
      coinSelect: this.intl.get('order-all'),
      marketSelect: this.intl.get('order-all'),
      typeSelect: this.intl.get('order-all'),
      orderType: 2,
      hideOther: 0,
      orderStatus: [1, 2, 3, 4, 5, 6, 7],
      page: 1,
      pageSize: 20,
      tradePairId: 1,
      total: 0,
      detailFlag: false,
      hiddenFlag: false,
      orderDetail: {},
      orderNavItems: {
        orderCurrent: {
          title: this.intl.get("order-pro-cur"),
        },
        orderHistory: {
          title: this.intl.get("order-pro-his")
        },
        orderDeal: {
          title: this.intl.get("order-deal")
        }
      },
      orderStatusItems : {
        0: this.intl.get('unDeal'),
        1: this.intl.get('partDeal'),
        2: this.intl.get('totalDeal'),
        3: this.intl.get('reseted'),
        4: this.intl.get('reseting'),
        5: this.intl.get('overed'),
        6: this.intl.get('partDeal'),
        7: this.intl.get('partDeal'),
        8: this.intl.get('order-pro-failed'),
      },
      orderDetailHead : {
        orderCurrent: [{name: this.intl.get('time')}, {name: this.intl.get('pair')}, {name: this.intl.get('type')}, {name: this.intl.get('price')}, {name: this.intl.get('amount')}, {name: this.intl.get('order-entrust')}, {name: this.intl.get('dealed')}, {name: this.intl.get('order-unDeal')}, {name: this.intl.get('state')}, {name: this.intl.get('action')},],
        orderHistory: [{name: this.intl.get('time')}, {name: this.intl.get('pair')}, {name: this.intl.get('type')}, {name: this.intl.get('price')},{name: this.intl.get('avgPrice')}, {name: this.intl.get('amount')}, {name: this.intl.get('dealed')},  {name: this.intl.get('order-deal-money')}, {name: this.intl.get('state')}, {name: this.intl.get('action')},],
        orderDeal: [{name: this.intl.get('time')}, {name: this.intl.get('pair')}, {name: this.intl.get('type')}, {name: this.intl.get('avgPrice')}, {name: this.intl.get('order-deal-number')}, {name: this.intl.get('order-deal-money')}, {name: this.intl.get('fee')},],
      },
      orderInfoHead : [
        // {name: this.intl.get('order-buy')}, {name: this.intl.get('order-sell')},
        {name: this.intl.get('order-deal-time')}, {name:  this.intl.get('order-deal-price')}, {name: this.intl.get('order-deal-number')}, {name: this.intl.get('order-deal-money')},
      ],
      proNone: {
        orderCurrent: {
          title: this.intl.get("order-pro-none-cur"),
        },
        orderHistory: {
          title: this.intl.get("order-pro-none-his")
        },
        orderDeal: {
          title: this.intl.get("order-pro-none-deal")
        }
      }, // 无数据处理
    };
    const {controller} = this.props;
    //绑定view
    controller.setView(this);
    //初始化数据，数据来源即store里面的state
    this.state = Object.assign(this.state, controller.initState);
    this.orderListHandle = controller.orderListHandle.bind(controller);
    // this.checkoutDetail = controller.getOrderDetail.bind(controller)
    this.exportHistory = controller.exportHistory.bind(controller);
    // this.getCurrent = controller.getCurrentOrder.bind(controller)
  }

  componentWillMount() {

  }

  componentDidMount() {
    const {pairIdMsg} = this.props;
    let orderStatus = [];
    this.props.type === 'orderHistory' && (orderStatus = [2, 3, 4, 5, 6, 7, 8]) && (this.setState({orderStatus}));
    this.props.type === 'orderDeal' && (orderStatus = [2, 5, 6, 7]) && (this.setState({orderStatus}));
    let params = {
      orderCurrent: {
        idArray: this.state.idArray, orderType: this.state.orderType, hideOther: this.state.hideOther
      },
      orderHistory: {
        idArray: this.state.idArray, orderType: this.state.orderType, orderStatus, startTime: this.state.startTime, endTime: this.state.endTime, page: this.state.page, pageSize: this.state.pageSize
      },
    };
    params.orderDeal = params.orderHistory;
    this.orderListHandle(this.props.type, params[this.props.type]);
    let coinArray = pairIdMsg.pairIdCoin && Object.keys(pairIdMsg.pairIdCoin);
    let marketArray = pairIdMsg.pairIdMarket && Object.keys(pairIdMsg.pairIdMarket);
    marketArray && marketArray.unshift(this.intl.get('all'));
    coinArray && coinArray.unshift(this.intl.get('all'));
    this.setState({
      coinArray,
      marketArray
    });
    this.customScrollO = new scrollbot('#content_info_table_tbody');
    this.customScrollO.setStyle({
      block: {
        backgroundColor: '#aaa',
        borderRadius: '5px',
      },//滑块样式
      groove: {
        backgroundColor: '#eee',
        borderRadius: '5px',
      }//滚动槽样式
     })
    // this.props.controller.configController.sendStatis(
    //     {
    //       event: 'orderListPV',//操作代码
    //       type: this.props.pvType,//tab
    //     }
    // )
  }
  componentDidUpdate(preProps, preState) {
    if(this.state.detailFlag){
      this.customScrollO && this.customScrollO.refresh();
    }
  }

  resetFilter() {
    this.setState({
      startTime: Math.floor(new Date().getTime() / 1000) - 7 * 24 * 60 * 60,
      endTime: Math.floor(new Date().getTime() / 1000),
      idArray: [],
      coinSelect: this.intl.get('all'),
      marketSelect: this.intl.get('all'),
      orderType: 2,
      typeSelect: this.intl.get('all'),
    },this.searchFilter);
  }

  hideReset() {
    this.setState({
      hiddenFlag: !this.state.hiddenFlag
    },()=>{
      let orderStatus = this.state.hiddenFlag ? [ 2, 4, 5, 6, 7] : [2, 3, 4, 5, 6, 7, 8];
      let params = {
        orderCurrent: {
          idArray: this.state.idArray, orderType: this.state.orderType, hideOther: this.state.hideOther
        },
        orderHistory: {
          idArray: this.state.idArray,
          orderType: this.state.orderType,
          orderStatus: orderStatus,
          startTime: this.state.startTime,
          endTime: this.state.endTime,
          page: 1,
          pageSize: this.state.pageSize
        }
      };
      this.setState(
          { orderStatus,
            total: 0,
            searchSaveFlag: true,
            page: 1
          }
      );
      this.orderListHandle(this.props.type, params[this.props.type])
    })
  }

  changeCoin(e) {
    const {pairIdMsg} = this.props;
    let marketArray = [];
    if(e === this.state.coinSelect){
      return
    }
    let coinValue = (e === this.intl.get('order-all')) ? '' : e;
    let marketValue = (this.state.marketSelect === this.intl.get('order-all')) ? '' : this.state.marketSelect;
    let idArray = [];
    let hideOther = 1;
    if (coinValue) {
      marketArray = pairIdMsg.pairNameCoin[coinValue.toLowerCase()];
      // marketArray.unshift(this.intl.get('all'));
      marketValue && (idArray.push(pairIdMsg.pairIdCoin[coinValue.toLowerCase()][marketValue.toLowerCase()])) || (idArray = Object.values(pairIdMsg.pairIdCoin[coinValue.toLowerCase()]));
    }
    else {
      marketValue && (idArray = Object.values(pairIdMsg.pairIdMarket[marketValue.toLowerCase()])) || (idArray = []);
    // && (marketArray = pairIdMsg.pairNameMarket[marketValue])
      marketArray = Object.keys(pairIdMsg.pairIdMarket)
      coinValue = this.intl.get('order-all');
    }
    marketArray.indexOf(this.intl.get('order-all')) === -1 && marketArray.unshift(this.intl.get('order-all'));
    this.setState(
        {
          marketArray,
          idArray,
          coinSelect: coinValue,
          hideOther
        }
    )
  }

  changeMarket(e) {
    const {pairIdMsg} = this.props;
    let coinArray = [];
    if(e === this.state.marketSelect){
      return
    }
    let marketValue = (e === this.intl.get('order-all')) ? '' : e;
    let coinValue = (this.state.coinSelect === this.intl.get('order-all')) ? '' : this.state.coinSelect;
    let idArray = [];
    let hideOther = 1;
    if (marketValue) {
      coinArray = pairIdMsg.pairNameMarket[marketValue.toLowerCase()];
      coinValue && (idArray.push(pairIdMsg.pairIdMarket[marketValue.toLowerCase()][coinValue.toLowerCase()])) || (idArray = Object.values(pairIdMsg.pairIdMarket && pairIdMsg.pairIdMarket[marketValue.toLowerCase()]));
    }
    else {
    // && (idArray = Object.values(pairIdMsg.pairIdCoin[coinValue]))
      coinValue  && (coinArray = pairIdMsg.pairNameCoin[coinValue.toLowerCase()]) && (idArray = Object.values(pairIdMsg.pairIdCoin[coinValue.toLowerCase()])) || (idArray = []);
      coinArray = pairIdMsg.pairIdCoin && Object.keys(pairIdMsg.pairIdCoin)
      marketValue = this.intl.get('order-all')
    }
    coinArray.indexOf(this.intl.get('order-all')) === -1 && coinArray.unshift(this.intl.get('order-all'));
    this.setState(
        {
          coinArray,
          idArray,
          marketSelect: marketValue,
          hideOther
        }
    )
  }

  changeOrderType(e) {
    const allKey = this.intl.get('all');
    const buyKey = this.intl.get('buy');
    const sellKey = this.intl.get('sell');
    let typeObj = {
    };
    typeObj[this.intl.get('order-all')] = 2;
    typeObj[this.intl.get('buy')] = 0;
    typeObj[this.intl.get('sell')] = 1;
    this.setState(
        {orderType: typeObj[e], typeSelect: e}
    )
  }

  searchFilter() {
    this.setState(
        {
          total: 0,
          orderListArray:[],
          searchSaveFlag:true,
          page: 1,
        }
    );
    const params = {
      orderCurrent: {
        idArray: this.state.idArray, orderType: this.state.orderType, hideOther: this.state.hideOther
      },
      orderHistory: {
        idArray: this.state.idArray,
        orderType: this.state.orderType,
        orderStatus: this.state.orderStatus,
        startTime: this.state.startTime,
        endTime: this.state.endTime,
        // page: this.state.page,
        page: 1,
        pageSize: this.state.pageSize
      },
      orderDeal: {
        idArray: this.state.idArray,
        orderType: this.state.orderType,
        orderStatus: this.state.orderStatus,
        startTime: this.state.startTime,
        endTime: this.state.endTime,
        // page: this.state.page,
        page: 1,
        pageSize: this.state.pageSize
      }
    };
    this.props.type === 'orderCurrent' && this.orderListHandle(this.props.type, params[this.props.type]);
    this.props.type !== 'orderCurrent' && this.orderListHandle(this.props.type, params[this.props.type])
  }

  startTime(e) {
    this.setState({
      startTime: parseInt(e / 1000)
    })
  }

  endTime(e) {
    this.setState({
      endTime: parseInt(e / 1000)
    })
  }

  async checkoutDetail(v) {
    if (v.orderStatus === 2 || v.orderStatus === 6  || v.orderStatus === 7) {
      this.setState({
        orderId: v.orderId,
        // detailFlag: true
      })
     await this.props.controller.getOrderDetail(v.orderId);
    }
  }
  cancelOrder(v){
    let orderId, opType, dealType,tradePairId;
    orderId = v.orderId;
    opType = 0;
    dealType =v.orderType;
    tradePairId = v.tradePairId;
    this.props.controller.cancelOrder(orderId, opType, dealType, tradePairId)
  }
  changePage(page){
    const params = this.state.searchSaveFlag ? {
      idArray: this.state.idArray,
      orderType: this.state.orderType,
      orderStatus: this.state.orderStatus,
      startTime: this.state.startTime,
      endTime: this.state.endTime,
      page,
      pageSize: this.state.pageSize
    } : {
        startTime: Math.floor(new Date().getTime() / 1000) - 7 * 24 * 60 * 60,
        endTime: Math.floor(new Date().getTime() / 1000),
        idArray: [],
        orderType: 2,
        typeSelect: this.intl.get('order-all'),
        orderStatus: this.state.orderStatus,
        page,
        pageSize: this.state.pageSize
    };
    this.orderListHandle(this.props.type, params);
    this.setState({
      page
    })
  }
  render() {
    const {type} = this.props;
    return (
        <div className='order-detail'>
          <div className='order-title'>
            {/*<h3>{this.state.orderNavItems[type].title}</h3>*/}
            <div style={{display: 'flex', alignItems: 'center'}}>
              {type === 'orderHistory' && <div className='filter-reset'>
                <span onClick={this.hideReset.bind(this)}>
                  {!this.state.hiddenFlag && <img src={COMMON_CHECKBOX_NORMAL} alt=""/>}
                  {this.state.hiddenFlag && <img src={COMMON_CHECKBOX_SELECT} alt=""/>}
                </span>
                {/* <input type="checkbox" onClick={this.hideReset.bind(this)}/> */}
                <span>{this.intl.get('hideReset')}</span>
              </div>}
            {type !== 'orderCurrent' && <Button type="export" onClick={() => { this.exportHistory(type) }} title={type === 'orderHistory' ? this.intl.get("exportOrderRecord") : this.intl.get("exportDealRecord")} className='export-record'/>}
            </div>

          </div>
          <ul className={`order-filter ${type === 'orderCurrent' ? 'current' : ''}`}>
            <li className='order-pair'>
              <span>{this.intl.get("pair")}</span>
              <SelectButton
                  title={this.state.coinSelect.toUpperCase()}
                  type="main"
                  className="select"
                  onSelect={(e) => this.changeCoin(e)}
                  valueArr={this.state.coinArray && this.state.coinArray.map(v=>v.toUpperCase())}
              />
              <em>/</em>
              <SelectButton
                  title={this.state.marketSelect.toUpperCase()}
                  type="main"
                  className="select"
                  onSelect={(e) => this.changeMarket(e)}
                  valueArr={this.state.marketArray && this.state.marketArray.map(v=>v.toUpperCase())}
              />
            </li>
            <li>
              <span>{this.intl.get('type')}</span>
              <SelectButton
                  title={this.state.typeSelect}
                  type="main"
                  className="select"
                  valueArr={[this.intl.get('order-all'), this.intl.get('buy'), this.intl.get('sell')]}
                  onSelect={(e) => this.changeOrderType(e)}
              />
            </li>
            {type !== 'orderCurrent' && <li className='data-filter'>
              <DatePicker
                startTime={this.state.startTime}
                endTime={this.state.endTime}
                onChangeStart={(e) => this.startTime(e)}
                onChangeEnd={(e) => this.endTime(e)}
              />
            </li>}
            <li className='filter-handle'>
              <Button type="base" title={this.intl.get('search')} className="search" onClick={this.searchFilter.bind(this)}/>
              {type !== 'orderCurrent' && <Button type="base" title={this.intl.get('reset')} className="reset" onClick={this.resetFilter.bind(this)}/>}
            </li>
          </ul>
            <table className='order-detail-table'>
              <thead>
              <tr>
                {this.state.orderDetailHead[type].map((v, index) => {
                  return (
                      <td key={index}>{v.name}</td>
                  )
                })}
              </tr>
              </thead>
            {this.state.orderListArray.length > 0 && (<tbody>
              {this.state.orderListArray && this.state.orderListArray.map((v, index) => {
                let tradePairUpcase = v.tradePairName.toUpperCase();
                let tradePairArr = tradePairUpcase.split('/');
                return (
                    <tr key={index}>
                      <td>{Number(v.orderTime).toDate()}</td>
                      <td>{v.tradePairName.toUpperCase()}</td>
                      <td style={{color: `${v.orderType ? '#F25C48' : '#24B36A'}`}}>{v.orderType ? this.intl.get('sell') : this.intl.get('buy')}</td>
                      {/*todo 颜色改类名统一处理*/}
                      {/*价格*/}
                      {type === 'orderCurrent' && <td>{Number(v.price).format()} {v.tradePairName.split('/')[1].toUpperCase()}</td>}
                      {type === 'orderHistory' && <td>{v.priceType ? this.intl.get('marketPrice') : `${Number(v.price).format({number:'digital'})} ${v.tradePairName.split('/')[1].toUpperCase()}`}</td>}
                      {type === 'orderHistory' && <td>{Number(v.avgPrice).format({number: 'digital'})}</td>}
                      {type === 'orderDeal' && <td>{Number(v.avgPrice).format()} {v.tradePairName.split('/')[1].toUpperCase()}</td>}
                      {/*数量*/}
                      {type !== 'orderDeal' && <td>{Number(v.count).format()} {v.tradePairName.split('/')[0].toUpperCase()}</td> || <td>{Number(v.dealDoneCount).format()} {v.tradePairName.split('/')[0].toUpperCase()}</td>}
                      {type === 'orderCurrent' && <td>{ (Number(Number(v.price).multi(v.count)).format({number: 'property'}))} {v.tradePairName.split('/')[1].toUpperCase()}</td>}
                      {type === 'orderDeal' && <td>{Number(v.turnover).format({number: 'property'})} {v.tradePairName.split('/')[1].toUpperCase()}</td>}
                      {type === 'orderDeal' && <td>{Number(v.fee).format({number: 'property'})} {v.orderType ? tradePairArr[1] : tradePairArr[0]}</td>}
                      {type !== 'orderDeal' && <td>{Number(v.dealDoneCount).format()}</td>}
                      {type === 'orderHistory' && <td>{Number(v.turnover).format({number: 'property'})} {v.tradePairName.split('/')[1].toUpperCase()}</td>}
                      {type === 'orderCurrent' && <td>{Number(v.undealCount).format()}</td>}
                      {type !== 'orderDeal' && <td>{this.state.orderStatusItems[v.orderStatus]}</td>}
                      {type === 'orderCurrent' && <td style={{color:'#FF9E2F', cursor:'pointer'}} onClick={this.cancelOrder.bind(this, v)}>{this.intl.get('cancel')}</td> || type === 'orderHistory' && <td onClick={this.checkoutDetail.bind(this, v)} style={{color: (v.orderStatus === 2 || v.orderStatus === 6 || v.orderStatus === 7) ? '#FF9E2F' : '#F25C48', cursor: (v.orderStatus === 2 || v.orderStatus === 6 || v.orderStatus === 7) ? 'pointer' : 'auto'}}>{(v.orderStatus === 2 || v.orderStatus === 6 || v.orderStatus === 7) ? this.intl.get('detail') : '—'}</td>}

                    </tr>
                )
              })}
              </tbody>)}
            </table>
           {this.state.orderListArray.length <= 0 && <div className="no-order-detail-list">{this.intl.get('noRecords')}</div>}
          <div className='order-page'>
            {(this.props.type !== 'orderCurrent' && this.state.total) && <Pagination total={this.state.total} showTotal={true} pageSize={20} onChange={page => {this.changePage(page)}} showQuickJumper={true} currentPage={this.state.page}/> || ''}
          </div>
          <div className='history-order-detail' style={{display: this.state.detailFlag ? 'block' : 'none'}}>
            <div className='history-order-detail-content'>
              <div className='detail-content-title'>
                <h3>{this.intl.get('orderDetail')}</h3>
                <i onClick={() => this.setState({detailFlag: false})}></i>
              </div>
              <div className='content-info-thead'>
                {this.state.orderInfoHead.map((v, index) => {
                  return (
                      <span key={index}>{v.name}</span>
                  )
                })}
              </div>
              <div id='content_info_table_tbody' style={{maxHeight: '434px'}}>
                <div>
                  <table>
                    <tbody>
                    {this.state.orderDetail.orderList && this.state.orderDetail.orderList.map((v, index) => {
                      return (
                          <tr key={index}>
                            {/*<td>{v.buyer}</td>*/}
                            {/*<td>{v.seller}</td>*/}
                            <td>{Number(v.orderTime).toDate()}</td>
                            <td>{Number(v.price).format({number:'digital'})}</td>
                            <td>{Number(v.volume).format()}</td>
                            <td>{Number(v.turnover).format({number:'property'})}</td>
                          </tr>
                      )
                    })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
    )
  }
}