import React, {Component} from 'react';

import ExchangeViewBase from "@/components/ExchangeViewBase";
import Button from '@/common/baseComponent/Button/index.jsx'
import Input from '@/common/baseComponent/Input/index.jsx'
import SelectButton from "@/common/baseComponent/SelectButton";
import {GUANBI_HEI, USER_LOADING} from '@/config/ImageConfig';
import {Regular} from '@/core'

const scrollbot = require('simulate-scrollbar');

export default class PayTypePopup extends ExchangeViewBase {
  constructor(props) {
    super(props);
    this.state = {
      payTypeTile: this.intl.get("user-check-pay"),
      payTypeList: [
        {name: this.intl.get("user-pay-bank"), flag: 4},
        {name: this.intl.get("user-pay-alipay"), flag: 1},
        {name: this.intl.get("user-pay-wechat"), flag: 2},
        {name: this.intl.get("user-pay-usd"), flag: 8},
      ],
      payType: 0,
      nextShow: false, // 下一步按钮
      erweimaImg: "", // 二维码图片
      accountValue: "", // 账户信息
      bankValue: "", // 银行
      bankNameValue: "", // 开户行
      bankAddrValue: "", // 银行卡地址
      SWIFTValue: "",
      IBANValue: "",
      ADAValue: "",
      pwdValue: "", // 资金密码
      inputObj: {
        // type: 0, // 账号类型1248
        // number: "", // 卡号/账号
        // name: "", // 账户名
        // bank: "", // 银行名
        // remark: "", // 备注信息
        // qr_code : "", // 二维码id
        // addr: "",
        // swift: "",
        // iban: "",
        // aba: "",
        // fundpass: "",
      },
      errCard: "",
      uploadFlag: true
    };
    this.uploadErweima = this.props.controller.uploadErweima.bind(this.props.controller); // 上传图片
  }

  componentDidMount() {
    this.customScroll = new scrollbot('#pay_info', 8);
    let payScroll = document.getElementById('pay_scroll');
    payScroll.style.overflow = this.state.nextShow ? 'hidden auto' : 'unset';
    this.customScroll.setStyle({
      block: {
        backgroundColor: '#aaa',
        borderRadius: '10px',
      },//滑块样式
      groove: {
        backgroundColor: '#eee',
        // borderRadius: '10px',
      }//滚动槽样式
    })
    let payTypeList = this.state.payTypeList;
    if (this.props.payPopupType) {
      payTypeList = payTypeList.filter(item => {
        return item.flag === this.props.payType
      });
      this.setState({
        nextShow: true,
        payTypeTile: payTypeList[0].name,
        accountValue: this.props.payNum,
        payType: this.props.payType,
        bankValue: this.props.bank, // 银行
        bankNameValue: this.props.bankName, // 开户行
        bankAddrValue: this.props.bankAddr, // 银行卡地址
        SWIFTValue: this.props.SWIFT,
        IBANValue: this.props.IBAN,
        ADAValue: this.props.ADA,
      })
    }
    // this.props.errState && this.props.resetCode();
  }

  componentDidUpdate(preProps, preState) {
    let payScroll = document.getElementById('pay_scroll');
    payScroll.style.overflow = this.state.nextShow ? 'hidden auto' : 'unset';
    if((preState.payType !== this.state.payType) || (preState.nextShow !== this.state.nextShow)){
      this.customScroll && this.customScroll.refresh();
    }
  }

  changePay = e => { // 选择方式
    let inputObjChange = {};
    inputObjChange.type = e.flag
    this.setState({
      payTypeTile: e.name,
      payType: e.flag,
      erweimaImg: "",
      accountValue: "", // 账户信息
      bankValue: "", // 银行
      bankNameValue: "", // 开户行
      bankAddrValue: "", // 银行卡地址
      SWIFTValue: "",
      IBANValue: "",
      ADAValue: "",
      pwdValue: "", // 资金密码
      inputObj: inputObjChange
    })
  };

  handlerPayType = () => {
    if (this.state.payTypeTile === this.intl.get("user-check-pay")) return;
    let payScroll = document.getElementById('pay_scroll');
    payScroll.style.overflow = 'scroll';
    this.setState({
      nextShow: true,
    })
  };

  changeBankValue = (value) => { // 开户银行
    let inputObj = this.state.inputObj
    inputObj.bank = value.trim()
    this.setState({
      bankValue: value.trim(),
      inputObj
    });
  };


  changeBankNameValue = (value) => { // 开户支行
    let inputObj = this.state.inputObj
    inputObj.addr = value.trim()
    this.setState({
      bankNameValue: value.trim(),
      inputObj
    });
  };

  changeAccountValue = (value) => { // 账号
    let inputObj = this.state.inputObj
    inputObj.number = value.replace(/\s/g, '')
    this.setState({
      accountValue: ([4, 8].includes(this.state.payType) && /\S{5}/.test(value)) ? value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ') : value.trim(),
      errCard: '',
      inputObj
    });
  };

  // checkAccount = () => { // 检查银行卡
  //   let regBank = Regular('regBank', this.state.accountValue.replace(/\s/g, ''));
  //   if ([4].includes(this.state.payType) && !regBank) {
  //     this.setState({
  //       errCard: this.intl.get("user-card-err")
  //     });
  //   }
  // };

  changeBanAddrkValue = (value) => { // 银行卡地址
    let inputObj = this.state.inputObj
    inputObj.addr = value.trim()
    this.setState({
      bankAddrValue: value.trim(),
      inputObj
    });
  };

  changeSWIFTValue = (value) => {
    let inputObj = this.state.inputObj
    inputObj.swift = value.trim()
    this.setState({
      SWIFTValue: value.trim(),
      inputObj
    });
  };

  changeIBANValue = (value) => {
    let inputObj = this.state.inputObj
    inputObj.iban = value.trim()
    this.setState({
      IBANValue: value.trim(),
      inputObj
    });
  };

  changeADAValue = (value) => {
    let inputObj = this.state.inputObj
    inputObj.aba = value.trim()
    this.setState({
      ADAValue: value.trim(),
      inputObj
    });
  };

  changePwdValue = (value) => { // 资金密码
    this.props.resetCode && this.props.resetCode()
    let inputObj = this.state.inputObj
    inputObj.fundpass = value.trim()
    this.setState({
      pwdValue: value.trim(),
      inputObj
    });
  };

  getObjectURL(file) { // 图片预览选择
    let url = null;
    if (window.createObjectURL != undefined) { // basic
      url = window.createObjectURL(file);
    } else if (window.URL != undefined) { // mozilla(firefox)
      url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) { // webkit or chrome
      url = window.webkitURL.createObjectURL(file);
    }
    return url;
  }

  selectPhoto = async () => { // input上传图片
    let file = this.refs.files.files[0],
        inputObj = this.state.inputObj;
    if (!file) return; // 无图片处理
    if (file && file.size > 10485760) return;
    inputObj.qr_code = ''
    this.setState({
      uploadFlag: false,
      erweimaImg: this.getObjectURL(file),
      inputObj
    });
    inputObj.qr_code = await this.uploadErweima(file)
    this.setState({
      inputObj,
      uploadFlag: true
    })
  };

  canClick = () => {
    let {erweimaImg, accountValue, bankValue, pwdValue, bankAddrValue, SWIFTValue, IBANValue, ADAValue, payType, errCard} = this.state;
    if (errCard || this.props.errState) return false;
    if ((payType === 1 || payType === 2) && accountValue && pwdValue && erweimaImg) return true;
    if (payType === 4 && accountValue && pwdValue && bankValue) return true;
    if (payType === 8 && accountValue && pwdValue && bankValue && bankAddrValue && SWIFTValue && IBANValue && ADAValue) return true;
    return false
  };

  handlerPayment = async () => {
    if (this.props.payPopupType) {
      let resultUp = await this.props.updatePayment(this.state.inputObj, this.props.handlerId, this.props.authName);
      if (resultUp === null) {
        this.props.closeBasePopup()
      }
      return
    }
    let resultAdd = await this.props.addPayment(this.state.inputObj, this.props.authName);
    if (resultAdd === null) {
      this.props.openGoOtcBasePopup()
    }
  };

  render() {
    let {onClose, payPopupType, errCode, errState, authName} = this.props;
    return (
      <div className='pay-type-wrap'>
        <div className='pay-type-con'>
          <div className={`${this.state.nextShow ? "active-title" : ""} title-wrap clearfix`}>
            <img src={GUANBI_HEI} alt="" className="close-popup" onClick={() => {
              onClose && onClose()
            }}/>
            <h1
              className="pop-title">{payPopupType ? this.intl.get('user-pay-alter') : this.intl.get('user-pay-add')}</h1>
          </div>
          <div style={{overflow: this.state.nextShow ? 'hidden' : 'unset', position: 'relative', maxHeight: '415px'}}
               id="pay_info">
            <div id="pay_scroll">
              <div className="pay-info">
                <ul className="first-ul">
                  <li>
                    <p className="title-p">{this.intl.get("user-pay-pop-type")}</p>
                    {!payPopupType && <SelectButton
                      title={this.state.payTypeTile}
                      type="main"
                      className={this.state.payTypeTile === this.intl.get("user-check-pay") ? 'placeholder-input' : ''}
                      onSelect={(e) => this.changePay(e)}
                      valueArr={this.state.payTypeList}
                    /> || null}
                    {payPopupType && <p className="disabled-p">{this.state.payTypeTile}</p> || null}
                  </li>
                  {!this.state.nextShow && <li
                    className={`${this.state.payTypeTile === this.intl.get("user-check-pay") ? '' : 'active'} next-li`}
                    onClick={this.handlerPayType}>{this.intl.get("user-check-pay-next")}</li>}
                </ul>
                {this.state.nextShow && (
                  <ol className="type-ol">
                    <li>
                      <p>{this.intl.get("user-pay-pop-name")}</p>
                      <Input value={authName} disabled/>
                    </li>
                    {[4, 8].includes(this.state.payType) && (
                      <li>
                        <ol>
                          <li>
                            <p>{this.intl.get("user-pay-pop-bank")}</p>
                            <Input
                              placeholder={this.intl.get("user-pay-pop-bankInput")}
                              value={this.state.bankValue}
                              onInput={value => this.changeBankValue(value)}/>
                          </li>
                          {this.state.payType === 4 && (<li>
                            <p>{this.intl.get("user-pay-pop-bankPosition")}</p>
                            <Input
                              placeholder={this.intl.get("user-pay-pop-bankPositionInput")}
                              value={this.state.bankNameValue}
                              onInput={value => this.changeBankNameValue(value)}/>
                          </li>) || null}
                        </ol>
                      </li>
                    )}
                    <li className="err-parent">
                      <p>{this.intl.get("user-pay-pop-account", {name: this.state.payType === 8 ? this.intl.get("user-pay-bank") : this.state.payTypeTile})}</p>
                      <Input
                        placeholder={this.intl.get("user-pay-pop-accountInput", {name: this.state.payType === 8 ? this.intl.get("user-pay-bank") : this.state.payTypeTile})}
                        value={this.state.accountValue}
                        onInput={value => this.changeAccountValue(value)}/>
                      {/*{this.state.accountValue && this.state.errCard && <em className="err-children">{this.state.errCard}</em>}*/}
                    </li>
                    {[1, 2].includes(this.state.payType) &&
                    <li>
                      <p>{this.intl.get("user-pay-pop-erweima")}</p>
                      <div className="upload-div" onClick={() => this.state.uploadFlag && this.refs.files.click()}>
                        {this.state.erweimaImg && <img src={this.state.erweimaImg} alt="" className="up-img"/>}
                        {!this.state.erweimaImg &&
                          <div>
                            <Button title={this.intl.get("user-pay-pop-erweimaUp")}/>
                            <span>{this.intl.get("user-pay-pop-erweimaRule", {name: this.state.payTypeTile})}</span>
                          </div>
                        }
                        {this.state.erweimaImg && !this.state.inputObj.qr_code && <div className="loading-wrap">
                          <img src={USER_LOADING} alt="" />
                        </div>}
                      </div>
                    </li>}
                    {(this.state.payType === 8) && (
                      <li>
                        <ol>
                          <li>
                            <p>{this.intl.get("user-pay-pop-bankAddr")}</p>
                            <Input
                              placeholder={this.intl.get("user-pay-pop-bankAddrInput")}
                              value={this.state.bankAddrValue}
                              onInput={value => this.changeBanAddrkValue(value)}/>
                          </li>
                          <li>
                            <p>SWIFT</p>
                            <Input
                              placeholder={this.intl.get("user-pay-pop-SWIFTInput")}
                              value={this.state.SWIFTValue}
                              onInput={value => this.changeSWIFTValue(value)}/>
                          </li>
                          <li>
                            <p>IBAN</p>
                            <Input
                              placeholder={this.intl.get("user-pay-pop-IBANInput")}
                              value={this.state.IBANValue}
                              onInput={value => this.changeIBANValue(value)}/>
                          </li>
                          <li>
                            <p>ADA</p>
                            <Input
                              placeholder={this.intl.get("user-pay-pop-ADAInput")}
                              value={this.state.ADAValue}
                              onInput={value => this.changeADAValue(value)}/>
                          </li>
                        </ol>
                      </li>
                    )}
                    <li className="err-parent">
                      <p>{this.intl.get("user-pay-pop-asset")}</p>
                      <Input
                        placeholder={this.intl.get("user-pay-pop-assetInput")}
                        value={this.state.pwdValue}
                        oriType="password"
                        onInput={value => this.changePwdValue(value)}/>
                      {[601, 612, 616].includes(errCode) && this.state.pwdValue && <em className="err-children">{errState}</em>}
                    </li>
                  </ol>
                )}
              </div>
            </div>
          </div>
          {this.state.nextShow &&
          <div className="ok-btn-wrap">
            <Button
              className={`${this.canClick() ? 'active' : ''} ok-btn`}
              disable={this.canClick() ? false : true}
              title={this.intl.get('ok')}
              onClick={this.handlerPayment}
            />
          </div>}
        </div>
        <div style={{display: 'none'}}>
          <input name="uploadimage" type='file' ref="files" accept="image/png, image/jpeg" onChange={this.selectPhoto}/>
        </div>
      </div>
    );
  }
}
