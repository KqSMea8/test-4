import ExchangeViewBase from '@/components/ExchangeViewBase'
import React, {Component} from "react";
import Pagination from "@/common/baseComponent/Pagination";
import Button from "@/common/baseComponent/Button";
import PropTypes from "prop-types"
import {formatQueryToPath} from '@/config/UrlConfig'
import Popup from '@/common/baseComponent/Popup/index.jsx'
import Sleep from '@/core/libs/Sleep'
import {COMMON_NOTHING_WHITE} from '@/config/ImageConfig';


export default class OrderFundInfo extends ExchangeViewBase {
  static defaultProps = {
    personType: 0,
  };
  static propTypes = {
    routeType: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    const {controller} = this.props;
    //绑定view
    controller.setView(this);
    this.tableHead = [
      {name: this.intl.get('date')},
      {name: this.intl.get('order-no')},
      {name: this.intl.get('order-product')},
      {name: this.intl.get('type')},
      {name: this.intl.get('order-fund-amount')},
      {name: this.intl.get('money')},
      {name: this.intl.get('option')},
    ];
    this.fundType = [this.intl.get('fund-buy'), this.intl.get('fund-sell')];
    // this.person = [this.intl.get('order-bussiness'),this.intl.get('order-user')]
    this.orderStatue = {
      orderWaitPay: 0,
      orderWaitConfirm: 1,
      orderDeal: 2,
      orderCancel: 3,
    };
    //初始化数据，数据来源即store里面的state
    this.state = {
      fundOrderContent: [],
      pageNo: 1,
      pageAll: 0,
      popMsg: '',
      confirmText: `${this.intl.get('ok')}${this.intl.get('cance')}`,
      cancelText: this.intl.get('fund-order-confirm-think'),
      alertPopup: false,
      cancelConfirm: false,
      selectId: null,
      autoClose: false
    };
    this.getFundOrder = controller.getFundOrder.bind(controller);
    this.markFundOrder = controller.markFundOrder.bind(controller);
  }

  async componentDidMount() {
    this.initData(1)
  }

  initData = async (page) => {
    let result = await this.getFundOrder({
      pageNo: page,
      OrderStatus: this.orderStatue[this.props.routeType],
      pageSize: 10
    });
    this.setState({
      fundOrderContent: result.data,
      pageNo: result.page.curPageNo,
      pageAll: result.page.total,
    })
  };

  changePage = (page) => {
    this.initData(page)
  };

  checkOrder = (id, flag) => {
    let num = flag === 'usd' ? 1 : 2
    this.props.history.push(formatQueryToPath('/fund/confirm', {id, flag: num}))
  };

  cancelOrder = (id, money, unit) => {
    this.setState({
      cancelConfirm: true,
      selectId: id,
      autoClose: false,
      // popMsg: `确定取消订单编号为${id}的 ${} ${unit.toUpperCase()}吗？`,
      popMsg: this.intl.getHTML('fund-order-confirm-popMsg', {
        id,
        money: money.format({number: 'legal', style: {forceStyle: true, name: this.getCoin(unit)}}),
        unit: unit.toUpperCase()
      })
    });
  };

  getCoin = (text) => { // 从字符串中截取英文
    return text.replace(/[^A-Z]+/ig, "");
  };

  popupConfirm = async () => {
    this.setState({
      cancelConfirm: false,
      popMsg: '',
    });
    let result = await this.markFundOrder({
        orderId: this.state.selectId,
        type: 2 //1.标记已付款，2-取消
      }),
      obj = {
        msg: `${this.intl.get('cance')}${this.intl.get('tip-success')}`,
        type: 'tip1',
      };
    // 失败处理
    if(result.ret){
      obj.type = 'tip3';
      obj.msg = result.msg;
    }
    this.props.controller.popupController.setState(Object.assign({
      isShow: true,
      autoClose: true
    }, obj));

    if(result.ret !== 1434 && result.r !== 0){
      return
    }
    await this.props.controller.Sleep(1000);
    this.props.history.push('/fund/detail/cancel');


  };

  popupClose = () => {
    this.setState({
      cancelConfirm: false,
      alertPopup: false,
      popMsg: '',
      selectId: null
    })
  };


  render() {
    const {
      routeType,
      controller
    } = this.props;
    return (
      <div className='order-fund-info'>
        <table>
          <thead>
          <tr>
            {this.tableHead.map((v, index) => (routeType === 'orderWaitPay' || index < 6) ? (
              <td key={index}>
                {v.name}
              </td>
            ) : null)}
          </tr>
          </thead>
          <tbody>
            {this.state.fundOrderContent.length ? this.state.fundOrderContent.map((v, index) => (
              <tr key={index}>
                <td>{Number(v.createTime).toDate('yyyy-MM-dd HH:mm:ss')}</td>
                <td>{JSON.stringify(v.orderId)}</td>
                <td>{controller.configController.language === 'zh-CN' ? v.productNameCn : v.productNameEn}</td>
                <td>{this.fundType[v.orderType]}</td>
                <td>{v.purchasingAmount}</td>
                <td className={v.orderType ? 'order-fund-green' : 'order-fund-red'}>{v.money.format({
                  number: 'legal',
                  style: {forceStyle: true, name: this.getCoin(v.productNameCn)}
                })}</td>
                {routeType === 'orderWaitPay' ? (<td>
                  <Button
                    onClick={() => this.checkOrder(v.orderId, this.getCoin(v.productNameCn))}
                    title={this.intl.get('order-check')}
                    className='order-fund-button'/>
                  <Button
                    onClick={() => this.cancelOrder(v.orderId, v.money, v.productNameCn)}
                    title={this.intl.get('cance')}
                    className='order-fund-button'/>
                </td>) : null}
              </tr>
            )) : (<tr className="nothing-tr">
              <td colSpan={routeType === 'orderWaitPay' ? 7 : 6}>
                <img src={COMMON_NOTHING_WHITE} alt=""/>
                <p>{this.intl.get('fund-order-none')}</p>
              </td>
            </tr>)}
          </tbody>
        </table>
        <div className='order-page'>
          {this.state.pageAll &&
          <Pagination total={this.state.pageAll} showTotal={true} pageSize={10} onChange={page => {
            this.changePage(page)
          }} currentPage={this.state.pageNo}/> || ''}
        </div>
        {this.state.cancelConfirm && <Popup
          type='confirm'
          icon={'warning'}
          confirmText={this.state.confirmText}
          cancelText={this.state.cancelText}
          msg={this.state.popMsg}
          className='fund-deal-pop'
          onConfirm={this.popupConfirm}
          onClose={this.popupClose}
        />}
        {this.state.alertPopup && <Popup
          type='tip1'
          autoClose={true}
          msg={this.state.popMsg}
          className='fund-deal-pop'
          onClose={this.popupClose}
        />}
      </div>
    )
  }
}