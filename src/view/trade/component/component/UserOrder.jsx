import ExchangeViewBase from '@/components/ExchangeViewBase'
import React, {Component} from "react";
import TradePopup from '@/common/component/TradePopup/index.jsx'
import Asset from '@/view/asset/component/component/SimplePro'
import {
  resolveOrderPath,
  goOrderPath
} from "@/config/UrlConfig"
import {
  YIWEN_ACTIVE,
} from '@/config/ImageConfig'

const scrollbot = require('simulate-scrollbar');
//
export default class userOrder extends ExchangeViewBase {
  constructor(props) {
    super(props);
    this.name = 'tradeOrderPro';
    this.tradePairName = '';
    this.state = {
      orderItemsType: 0, //tab切换选中类型
      orderItems: [
        {name: this.intl.get('trade-pro-cur'), type: 0, address: resolveOrderPath('/qb/detail/current')},
        {name: this.intl.get('trade-pro-his'), type: 1, address: resolveOrderPath('/qb/detail/history')},
        {name: this.intl.get('trade-deal'), type: 2, address: resolveOrderPath('/qb/detail/deal')},
        {name: this.intl.get('header-pro-assets'), type: 3},
      ], // nav导航栏项目
      hideOther: false, //隐藏其他交易对开关
      hideLittle: false,
      // 订单表头项目明细
      headType: [
        [
          {name: this.intl.get('trade-pro-time')},
          {name: this.intl.get('pair')},
          {name: this.intl.get('trade-pro-type')},
          {name: this.intl.get('trade-pro-price'), unit: 'price', msg: true},
          {name: this.intl.get('trade-pro-amount'), unit: 'number'},
          {name: this.intl.get('trade-pro-turnover'), unit: 'price'},
          {name: this.intl.get('dealed')},
          {name: this.intl.get('unDeal')},
          {name: this.intl.get('trade-pro-can'), type: 'button'},
        ],
        [
          {name: this.intl.get('trade-pro-time')},
          {name: this.intl.get('pair')},
          {name: this.intl.get('trade-pro-type')},
          {name: this.intl.get('trade-pro-price'), unit: 'price', msg: true},
          {name: this.intl.get('trade-pro-amount'), unit: 'number'},
          {name: this.intl.get('dealed')},
          {name: this.intl.get('avgPrice'), unit: 'price', msg: true},
          {name: this.intl.get('fee')},
          {name: this.intl.get('state')}
        ],
        [
          {name: this.intl.get('trade-deal-time')},
          {name: this.intl.get('pair')},
          {name: this.intl.get('trade-pro-type')},
          {name: this.intl.get('avgPrice'), unit: 'price', msg: true},
          {name: this.intl.get('amount'), unit: 'price'},
          {name: this.intl.get('total'), unit: 'number'},
          {name: this.intl.get('fee')},
        ]
      ],
      // 订单状态类型
      orderStatus: {
        0: this.intl.get('unDeal'),
        1: this.intl.get('partDeal'),
        2: this.intl.get('totalDeal'),
        3: this.intl.get('reseted'),
        4: this.intl.get('reseting'),
        5: this.intl.get('overed'),
        6: this.intl.get('partDeal'),
        7: this.intl.get('partDeal'),
        8: this.intl.get('trade-pro-failed')
      },
      // 订单详情明细表头
      orderInfoHead: [
        {name: this.intl.get('trade-deal-time')},
        {name: this.intl.get('trade-deal-price')},
        {name: this.intl.get('trade-deal-number')},
        {name: this.intl.get('trade-deal-money')},
      ],
      detailFlag: false, //订单详情显示开关
      orderDetail: {}, // 订单详情内容
      currentOrder: [],
      historyOrder: [],
      proOrderData: [],
      resetPopFlag: false,
      resetPopMsg: '',
      statusIndex: -1,
      orderCancelType: 'positi',// 弹窗提示类型
    };
    const {controller} = this.props;
    this.noticeController = controller.noticeController;
    // this.getOrderHeight = this.noticeController.getOrderHeight.bind(this.noticeController) // 获取通知列表
    //绑定view
    controller.setView(this);
    //初始化数据，数据来源即store里面的state
    this.state = Object.assign(this.state, controller.initState);
    //更改订单类型
    this.changeItemsType = controller.changeItemsType.bind(controller);
    //隐藏其他交易对
    this.hideOther = controller.hideOther.bind(controller)
    this.hideLittleAsset = () => {
      this.setState({
        hideLittle: !this.state.hideLittle
      })
    }
  }

// 撤销订单
  cancelOrder(cancelType, v, flag = true, e) {
    if (!flag)
      return;
    e && e.preventDefault();
    e && e.stopPropagation();
    let orderId, opType, dealType, tradePairId, currentOrder;
    orderId = cancelType ? 0 : v.orderId;
    opType = cancelType;
    dealType = cancelType ? 0 : v.orderType;
    tradePairId = cancelType ? -1 : v.tradePairId;
    currentOrder = this.state.currentOrder;
    if (opType === 0) {
      this.props.controller.cancelOrder(orderId, opType, dealType, tradePairId, 0)
    }
    if (opType === 3) {
      this.state.proOrderData.map(vv => {
        tradePairId !== vv.tradePairId && (tradePairId = vv.tradePairId) && this.props.controller.cancelOrder(orderId, opType, dealType, tradePairId, 0)
      })
    }
  }
  
  componentDidMount() {
    this.customScroll = new scrollbot('#trade_order_pro_user_order')
    this.customScrollD = new scrollbot('#trade_order_detail_content')
  }
  
  componentWillUnmount() {
    this.props.controller.store.state.unitsType = ''
  }
  
  tradeOrderDetail(v, index) {
    if ([1, 2, 6, 7].indexOf(v.orderStatus) !== -1) {
      this.setState({
        orderDetailType: v.orderType,
        statusIndex: index
      });
      this.tradePairName = v.tradePairName;
      this.props.controller.getOrderDetail(v.orderId)
    }
    
  }
  
  componentDidUpdate(preProps, preState) {
    if (this.length !== this.state.proOrderData.length || this.state.orderItemsType !== preState.orderItemsType) {
      this.length = this.state.proOrderData.length
      this.customScroll && this.customScroll.refresh();
    }
    if (this.state.detailFlag) {
      document.getElementById('trade_order_detail_content').style.height = document.getElementById('trade_order_detail_content').clientHeight >= 434 ? '434px' : 'auto'
      this.customScrollD && this.customScrollD.refresh();
    }
    
  }
  
  render() {
    let accuracyList = this.props.controller.store.state.accuracyList || {};
    return (
        <div id="trade_order_pro">
          <div className='trade-order-pro-title'>
            <div className='order-pro-item'>
              {this.state.orderItems.map((v, index) => {
                return <div className={`order-pro-items order-pro-items-${this.state.orderItemsType === index ? 'active' : ''}`} key={index} onClick={this.changeItemsType.bind(this, v)}>
                  {v.name}
                </div>
              })}
            </div>
            <div className='order-pro-hide'>
              {this.state.orderItemsType !== 3 && <a href={this.state.orderItems[this.state.orderItemsType].address}>
                {this.intl.get('more')}
              </a>}
              {this.state.orderItemsType !== 3 && <label>
                <input type="checkbox" checked={this.state.hideOther} onChange={this.hideOther.bind(this)}/>
                {this.intl.get('trade-pro-hide')}
              </label>}
              {this.state.orderItemsType === 3 && <label>
                <input type="checkbox" checked={this.state.hideLittle} onChange={this.hideLittleAsset}/>
                {this.intl.get('asset-hideLittle')}
              </label>}
            </div>
          </div>
          <div className={`order-pro-content order-pro-content-${this.state.orderItemsType}`}>
            <div style={{display: this.state.orderItemsType !== 3 ? 'block' : 'none'}}>
              {this.state.orderItemsType !== 3 && <div className='thead'>
                {this.state.headType[this.state.orderItemsType].map((v, index) => {
                  return (
                      <p key={index}><span className={`${v.type ? 'cancel-pro' : ''} ${(v.type && !this.state.proOrderData.length) ? 'cancel-pro-dis' : ''}`}
                                           onClick={v.type && this.cancelOrder.bind(this, 3, 0)}>{v.name}</span>
                        {v.msg && <b className="pop-parent">
                          <img src={YIWEN_ACTIVE}/>
                          <em className="pop-trade-children uppop-trade-children">{this.intl.get("deal-digital-tip")}</em>
                        </b>}
                      </p>
                  )
                })}
              </div>}
              <div id="trade_order_pro_user_order" style={{width: '100%', height: '239px', overflow: 'hidden'}}>
                <div>
                  <table style={{width: document.getElementById('trade_order_pro') && document.getElementById('trade_order_pro').clientWidth}}>
                    <tbody>
                    {this.state.proOrderData.map((v, index) => {
                      return (
                          <tr key={index}>
                            <td>{v.orderTime && Number(v.orderTime).toDate('yy-MM-dd HH:mm:ss') || ''}</td>
                            <td>{v.tradePairName && v.tradePairName.toUpperCase() || ''}</td>
                            <td>{v && (v.orderType ? this.intl.get('sell') : this.intl.get('buy')) || ''}</td>
                            {this.state.orderItemsType === 1 && <td>{v && (v.priceType ? this.intl.get('marketPrice') : v.priceR) || ''}</td>}
                            {this.state.orderItemsType === 2 && <td>{v.avgPriceR || ''}</td>}
                            {this.state.orderItemsType === 0 && <td>{v.priceR || ''}</td>}
                            <td>{v.countR || ''}</td>
                            {this.state.orderItemsType !== 1 && <td>{v.turnoverR || ''}</td>}
                            {this.state.orderItemsType === 1 && <td>{v.dealDoneCountR || ''}</td>}
                            {this.state.orderItemsType === 0 && <td>{v.dealDoneCountR || ''}</td>}
                            {this.state.orderItemsType === 1 && <td>{v.avgPriceR || ''}</td>}
                            {this.state.orderItemsType !== 0 && <td>{v.fee || ''}</td>}
                            {this.state.orderItemsType === 0 && <td>{v.undealCountR || ''}</td>}
                            {this.state.orderItemsType === 0 && <td className='pro-order-cancel' onClick={this.cancelOrder.bind(this, 0, v, v)}>{v && this.intl.get('cancel') || ''}</td>}
                            {this.state.orderItemsType === 1 &&
                            <td onClick={this.tradeOrderDetail.bind(this, v, index)} className={this.state.statusIndex === index || [1, 2, 6, 7].indexOf(v.orderStatus) !== -1 ? 'checking' : ''}
                                style={{cursor: `${[1, 2, 6, 7].indexOf(v.orderStatus) !== -1 ? 'pointer' : 'auto'}`}}>{v.orderStatus && this.state.orderStatus[v.orderStatus] || ''}</td>}
                          </tr>
                      )
                    })}
                    </tbody>
                  </table>
                  <div className='trade-pro-order-none' style={{display: this.state.orderItemsType !== 3 && (!this.state.proOrderData || !this.state.proOrderData.length) ? 'block' : 'none'}}>
                    <p style={{width: '100%'}}>{this.intl.get('noRecords')}</p>
                  </div>
                </div>
              </div>
            </div>
            <div style={{display: this.state.orderItemsType === 3 ? 'block' : 'none'}}>
              <Asset controller={this.props.assetController} hideLittle={this.state.hideLittle} show={this.state.orderItemsType === 3 ? true : false}></Asset>
            </div>
          </div>
          {
            <div className='trade-order-pro-shadow' style={{display: this.state.detailFlag ? 'block' : 'none'}}>
              <div className='trade-order-shadow' style={{display: this.state.detailFlag ? 'block' : 'none'}}>
                <div className='trade-order-detail'>
                  <div className='trade-order-detail-title'>
                    <span>{this.intl.get('trade-pro-detail')}</span>
                    <em onClick={() => this.setState({detailFlag: false, statusIndex: -1})}></em>
                  </div>
                  <div className='trade-order-detail-thead'>
                    {this.state.orderInfoHead.map((v, index) =>
                        <div key={index}>{v.name}</div>
                    )
                    }
                  </div>
                  <div id='trade_order_detail_content' style={{width: '100%', overflow: 'hidden', height: this.state.detailFlag ? 'auto' : '0'}}>
                    <div>
                      <table>
                        <tbody>
                        {this.state.orderDetail.orderList && this.state.orderDetail.orderList.map((v, index) => {
                          return (
                              <tr key={index}>
                                <td>{v.orderTime && Number(v.orderTime).toDate() || ''}</td>
                                <td>{v.price && Number(v.price).format({number: 'digital', style: {decimalLength: accuracyList[this.tradePairName] && accuracyList[this.tradePairName].pb}}) || ''}</td>
                                <td>{v.volume && Number(v.volume).formatFixNumberForAmount(accuracyList[this.tradePairName] && accuracyList[this.tradePairName].vb, false) || ''}</td>
                                <td>{v.turnover && Number(v.turnover).format({
                                  number: 'property',
                                  style: {decimalLength: (accuracyList[this.tradePairName] && accuracyList[this.tradePairName].pb) + (accuracyList[this.tradePairName] && accuracyList[this.tradePairName].vb)}
                                }) || ''}</td>
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
          }
          <div className='reset-pop'>
            {this.state.resetPopFlag && <TradePopup msg={this.state.resetPopMsg} onClose={() => {
              this.setState({resetPopFlag: false})
            }} className='reset-pop-location' theme={this.state.orderCancelType} type='ico'/>}
          </div>
        </div>
    )
  }
}
//
