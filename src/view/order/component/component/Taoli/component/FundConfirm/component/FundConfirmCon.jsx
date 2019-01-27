import React, {Component} from "react";
import ExchangeViewBase from "@/components/ExchangeViewBase";
import Button from '@/common/baseComponent/Button/index.jsx'
import FundOrderTitle from '../../../../common/OtcOrderTitle'
import Popup from '@/common/baseComponent/Popup/index.jsx'
import {getQueryFromPath, formatQueryToPath} from '@/config/UrlConfig'
import {AsyncAll} from '@/core'

export default class FundConfirmCon extends ExchangeViewBase {

  constructor(props) {
    super(props);
    this.content = [
      this.intl.get('fund-step1'),
      this.intl.get('fund-step2'),
      this.intl.get('fund-step3')
    ];
    const {controller} = this.props;
    this.state={
      orderId: getQueryFromPath('id'),
      flag: Number(getQueryFromPath('flag')), // 1: 美元 2: 人民币
      popMsg: '',
      confirmText:`${this.intl.get('ok')}${this.intl.get('cance')}`,
      cancelText:this.intl.get('fund-order-confirm-think'),
      cancelConfirm: false,
      autoClose: false
    };
    this.markFundOrder = controller.markFundOrder.bind(controller);
  }

  orderHandler = (msg, result) => {
    let obj = {
      msg,
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
  };

  confirmFundOrder = async () => {
    let result = await this.markFundOrder({
      orderId: JSON.parse(this.state.orderId),
      type: 1
    });
    this.orderHandler(`${this.intl.get('fund-confirm-sure')}${this.intl.get('tip-success')}`, result);
    if(result.ret !== 1434 && result.r !== 0){
      return
    }
    await this.props.controller.Sleep(1000);
    this.props.history.push('/fund/detail/confirm')
  };

  cancelOrder = () => {
    let unit = this.state.flag === 1 ? 'usd' : 'cny'
    this.setState({
      cancelConfirm: true,
      selectId: this.props.propsState.orderId,
      autoClose: false,
      // popMsg: `确定取消订单编号为${id}的 ${} ${unit.toUpperCase()}吗？`,
      popMsg: this.intl.getHTML('fund-order-confirm-popMsg', {
        id: this.props.propsState.orderId,
        money: this.props.propsState.money.format({number:'legal', style:{forceStyle: true, name: unit}}),
        unit: unit.toUpperCase()
      })
    })
  };

  popupConfirm = async () => {
    this.setState({
      cancelConfirm: false,
      popMsg: '',
    });
    let result = await this.markFundOrder({
          orderId: this.props.propsState.orderId,
          type: 2 //1.标记已付款，2-取消
        });
    // 失败处理
    this.orderHandler(`${this.intl.get('cance')}${this.intl.get('tip-success')}`, result);
    if(result.ret !== 1434 && result.r !== 0){
      return
    }
    await this.props.controller.Sleep(1000);
    this.props.history.push('/fund/detail/cancel');
  };

  popupClose = () => {
    this.setState({
      cancelConfirm: false,
      popMsg: '',
    })
  };

  render() {
    const {controller, propsState} = this.props;
    return (
      <div className="fund-confirm-con">
        <FundOrderTitle
          content={JSON.parse(this.state.flag) === 1 ? this.intl.get('fund-order-confirm-titleUsd') : this.intl.get('fund-order-confirm-titleCny')}
        />
        <div className="fund-confirm-info">
          <div className="fund-confirm-info-top">
            <ul>
              <li>{controller.configController.language === 'zh-CN' ? propsState.productNameCn && propsState.productNameCn.toUpperCase() : propsState.productNameEn && propsState.productNameEn.toUpperCase()}</li>
              <li>{`${this.intl.get('fund-order-already')} | ${this.intl.get('fund-order-num')}`}
                <span>{JSON.stringify(propsState.orderId)}</span>
              </li>
            </ul>
            <table>
              <tbody>
              <tr>
                <td>{propsState.profitRate}%</td>
                <td>{propsState.purchasingAmount}</td>
                <td>{JSON.parse(this.state.flag) === 1 ? '$' : '￥'}{propsState.money}</td>
              </tr>
              <tr>
                <td>{this.intl.get('fund-order-profit')}</td>
                <td>{this.intl.get('fund-order-apply')}</td>
                <td>{this.intl.get('fund-order-amount')}</td>
              </tr>
              </tbody>
            </table>
          </div>
          <div className="fund-confirm-info-bottom">
            <table>
              <tbody>
                <tr>
                  <td>{this.intl.get('fund-confirm-payee-name')}</td>
                  <td>{propsState.cardName}</td>
                </tr>
                <tr>
                  <td>{this.intl.get('fund-confirm-payee-card')}</td>
                  <td>{propsState.cardNo}</td>
                </tr>
                <tr>
                  <td>{this.intl.get('fund-confirm-payee-addr')}</td>
                  <td>{propsState.cardBank}{this.state.address}</td>
                </tr>
                <tr>
                  <td>{this.intl.get('fund-confirm-payee-info')}</td>
                  <td>{JSON.stringify(propsState.orderId)} {this.intl.get('fund-confirm-remarks')}</td>
                </tr>
              </tbody>
            </table>
            <ol>
              <li>
                <b>{this.intl.get('fund-confirm-pay')} {JSON.parse(this.state.flag) === 1 ? '$' : '￥'}</b>
                <i>{propsState.money && propsState.money.toFixedUp(2)}</i>
              </li>
              <li>
                <span onClick={this.cancelOrder}>{this.intl.get('fund-confirm-cancel')}</span>
                <Button
                    onClick={this.confirmFundOrder}
                    title={this.intl.get('fund-confirm-sure')}
                />
              </li>
            </ol>
          </div>
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
      </div>
    )
  }
}