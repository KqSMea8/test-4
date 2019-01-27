import React, {Component} from 'react';
import ExchangeViewBase from '@/components/ExchangeViewBase'

import Button from '@/common/baseComponent/Button'
import BasePopup from "@/common/baseComponent/Popup/index";
import PayTypePopup from '../../userPopup/PayTypePopup.jsx'

import {AsyncAll, Regular} from '@/core'

import {
  resolveUserPath,
  goOtcPath
} from "@/config/UrlConfig"

import { OTC_USER_BANK, OTC_USER_ALIPAY, OTC_USER_WECHAT, COMMON_RADIO_GET, COMMON_RADIO, OTC_USER_USD } from '@/config/ImageConfig.js';

export default class PayInfo extends ExchangeViewBase {
  constructor(props) {
    super(props);
    this.state = {
      payImgList: {
        1: {pay: this.intl.get("user-pay-alipay"), url: OTC_USER_ALIPAY},
        2: {pay: this.intl.get("user-pay-wechat"), url: OTC_USER_WECHAT},
        4: {pay: this.intl.get("user-pay-bank"), url: OTC_USER_BANK},
        8: {pay: this.intl.get("user-pay-usd"), url: OTC_USER_USD}
      },
      showPayPopup: false,
      payPopupType: 0, // 0 添加, 1修改
      payName: "",
      payNum: "",
      payType: 0,
      showBasePopup: false,
      basePopupFlag: 0, // 0 实名认证 1 添加 2 删除
      basePopupType: "custom",
      basePopupMsg: "",
      basePopupConfirm: "",
      basePopupCancel: "",
      deletItem: 0,
      handlerId: 0,
      bank: "", // 银行
      bankName: "", // 开户行
      bankAddr: "", // 银行卡地址
      SWIFT: "",
      IBAN: "",
      ADA: "",
      autoClose: false
    }
  }

  handlerPayToggle =  async (item) => { // 开启关闭支付方式
    let openList = this.props.payList.filter(item => {return item.usable === 1});
    this.props.setToggleFlag()
    if (openList.length >= 4 && item.usable === 0) {
      this.setState({
        basePopupType: "tip3",
        basePopupMsg: this.intl.get("user-pay-open-rule"),
        showBasePopup: true,
        autoClose: true,
      })
      return
    }
    let result = await this.props.setPayment(item.id, 1 - item.usable)
    if (result === null) {
      this.setState({
        basePopupType: "tip1",
        basePopupMsg: this.intl.get("user-modifiedSucc"),
        showBasePopup: true,
        autoClose: true,
      })
    }
  };

  addPayType = () => { // 添加收款方式
    this.setState({
      basePopupFlag: 0,
      payPopupType: 0,
      showPayPopup: this.props.userAuth == 2  ? true : false,
      basePopupType: "confirm",
      basePopupMsg: this.intl.get("user-new"),
      basePopupConfirm: this.intl.get("user-name"),
      basePopupCancel: this.intl.get("close"),
      showBasePopup: this.props.userAuth == 2  ? false : true,
      autoClose: false
    })
  };

  deletPay = (item, index) => { // 删除收款方式
    this.setState({
      basePopupType: "confirm",
      basePopupMsg: this.intl.get("user-pay-cancel"),
      basePopupConfirm: this.intl.get("sure"),
      basePopupCancel: this.intl.get("cance"),
      showBasePopup: true,
      basePopupFlag: 2,
      deletItem: index,
      handlerId: item.id,
      autoClose: false
    })
  };

  alterPay = (item) => { // 修改收款方式
    this.setState({
      showPayPopup: true,
      payPopupType: 1,
      payName: item.name,
      payNum: ([4, 8].includes(item.type) && /\S{5}/.test(item.number)) ? item.number.replace(/\s/g, '').replace(/(.{4})/g, '$1 ') : item.number,
      payType: item.type,
      handlerId: item.id,
      bank: item.bank, // 银行
      bankName: item.addr, // 开户行
      bankAddr: item.addr, // 银行卡地址
      SWIFT: item.swift,
      IBAN: item.iban,
      ADA: item.aba,
    })
  };

  hideBind = () => {
    this.setState({
      showBasePopup: false
    })
  };

  goBind = () => {
    let confirmClickArr = [
      () => {this.props.history.push('/identity')}, // 跳转到实名
      () => {goOtcPath()}, // 开关支付
      () => {this.props.delPayment(this.state.handlerId, this.state.deletItem)} // 删除支付方式
    ];
    this.setState({
      showBasePopup: false
    });
    return confirmClickArr[this.state.basePopupFlag]()
  };

  closeBasePopup = () => {
    this.setState({
      showPayPopup: false
    })
  };

  openGoOtcBasePopup = () => {
    this.setState({
      basePopupType: "custom",
      basePopupMsg: this.intl.get("user-pay-open"),
      basePopupConfirm: this.intl.get("user-pay-open-confrim"),
      basePopupCancel: this.intl.get("close"),
      showBasePopup: true,
      basePopupFlag: 1,
      autoClose: false,
      showPayPopup: false,
    })
  };

  render() {
    const {userInfo, changeSetPopup, payList, addPayment, updatePayment} = this.props;
    return (
      <div className="pay-type model-div clearfix">
        <h2>{this.intl.get("user-pay-title")}</h2>
        <div className="fl pay-con clearfix">
          <Button title={this.intl.get("user-pay-add")} onClick={this.addPayType}/>
          {payList.length && <table>
            <tbody>
            {payList.map((item, index) => (
              <tr key={index}>
                <td>
                  <img src={this.state.payImgList[item.type].url} alt=""/>
                  <span>{this.state.payImgList[item.type].pay}</span>
                </td>
                <td>{item.name}</td>
                <td>{([4, 8].includes(item.type) && /\S{5}/.test(item.number)) ? item.number.replace(/\s/g, '').replace(/(.{4})/g, '$1 ') : item.number}</td>
                <td>
                  <span onClick={state => !item.usable && this.handlerPayToggle(item)}>
                    {item.usable ? <img src={COMMON_RADIO_GET} alt=""/> : <img src={COMMON_RADIO}/>}
                    {this.intl.get("user-pay-start")}
                  </span>
                </td>
                <td>
                  <span onClick={state => item.usable && this.handlerPayToggle(item)}>
                    {!item.usable ? <img src={COMMON_RADIO_GET} alt=""/> : <img src={COMMON_RADIO}/>}
                    {this.intl.get("close")}
                  </span>
                </td>
                <td className="set-td">
                  <span onClick={state => this.alterPay(item)}>{this.intl.get("alter")}</span>
                </td>
                <td className="set-td">
                  <span onClick={state => this.deletPay(item, index)}>{this.intl.get("delete")}</span>
                </td>
              </tr>
            ))}
            </tbody>
          </table> || null}
        </div>
        {this.state.showPayPopup && <PayTypePopup
          onClose={() => {this.setState({showPayPopup: false});}}
          payPopupType = {this.state.payPopupType}
          authName = {this.props.userAuthName}
          payNum = {this.state.payNum}
          payType = {this.state.payType}
          bank = {this.state.bank}
          bankName = {this.state.bankName}
          bankAddr = {this.state.bankAddr}
          SWIFT = {this.state.SWIFT}
          IBAN = {this.state.IBAN}
          ADA = {this.state.ADA}
          addPayment = {addPayment}
          updatePayment={updatePayment}
          handlerId={this.state.handlerId}
          controller={this.props.controller}
          closeBasePopup={this.closeBasePopup}
          openGoOtcBasePopup={this.openGoOtcBasePopup}
          resetCode={this.props.resetCode}
          errCode={this.props.errCode}
          errState={this.props.errState}
        />}
        {this.state.showBasePopup && <BasePopup
          type={this.state.basePopupType}
          msg={this.state.basePopupMsg}
          onClose={this.hideBind}
          onConfirm={this.goBind}
          confirmText={this.state.basePopupConfirm}
          cancelText={this.state.basePopupCancel}
          autoClose={this.state.autoClose}
        />}
      </div>
    );
  }
}