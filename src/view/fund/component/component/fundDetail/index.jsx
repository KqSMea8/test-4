import React, {Component} from 'react';
import ExchangeViewBase from "@/components/ExchangeViewBase";
import FundProduct from './component/FundProduct.jsx'
import FundRisk from './component/FundRisk.jsx'
import FundStable from './component/FundStable.jsx'
import AmountInput from '@/common/component/AmountInput/index.jsx'
import Progress from '@/common/component/Progress/index.jsx'
import Popup from '@/common/baseComponent/Popup/index.jsx'
import {NavLink} from "react-router-dom";
import './style/index.styl'
import {TLB_TITLE} from '@/config/ImageConfig.js';
import Sleep from '@/core/libs/Sleep';

import {
  resolveLoginPath,
  resolveRegisterPath,
  resolveUserPath,
  goOrderPath,
  resolveAssetPath,
  goAssetPath,
  getQueryFromPath
} from "@/config/UrlConfig"

export default class FundDetail extends ExchangeViewBase {
  constructor(props) {
    super(props);
    this.isLogin = this.props.controller.userController.userId;
    this.name = 'fundDetail';
    this.common = {
      nav: [this.intl.get('tlb-product'), this.intl.get('tlb-safe'), this.intl.get('tlb-steady')],
      yields: this.intl.get('tlb-yields'),
      investLimit: this.intl.get('tlb-investLimit'),
      investTime: this.intl.get('tlb-investLimitLive'),
      redeem: this.intl.get('tlb-redeemTime'),
      redeemTime: this.intl.get('tlb-redeemTimeLive'),
      remainderNum: this.intl.get('tlb-remainPercent'),
      mangager: this.intl.get('tlb-manager'),
      interestTime: this.intl.get('tlb-earnStart'),
      earnStart: [this.intl.get('tlb-earnStartNow'), this.intl.get('tlb-earnStartNext')],
      fee: this.intl.get('tlb-fee'),
      risk: this.intl.get('tlb-riskLevel'),
      riskLevel: [this.intl.get('tlb-riskLevelLow')],
      startTime: this.intl.get('tlb-establish')
    };
    this.state = {
      profitTime: Math.floor(new Date().getTime() / 1000) + 60 * 60 * 24, // 收益时间
      redeemTime: Math.floor(new Date().getTime() / 1000) + 60 * 60 * 24 * 2, // 到账时间
      fund: 'BTC',
      navSelect: 0, // tab选中
      totalPrice: 0, // 付款金额
      amountInput: 0, // 买入份数
      assetAmount: 0, //账户余额
      buyPercent: 0, //申购百分比
      popType: 'confirm', //弹窗类型
      popIcon: "warning", // 图标类型
      cancelHide: true,// 取消图标隐藏
      closeButton: true,// 关闭图标
      confirmText: '知道了', // 确认按钮文案
      cancelText: '取消', // 取消按钮文案
      autoClose: false, // 自动关闭弹窗
      popMsg: '您好, 请先登录后才能申购', //弹窗文案
      popShow: false,// 弹窗显示
      confirmType: 'hide', //确认按钮点击参数
      closeType: 'hide', //取消按钮点击参数
      fundSure: false, // 申购确认弹窗
      fundPass: '', //资金密码
      cancelFlag: false,
      clickOutSide: false,
      // jumpFlag: false, //取消按钮跳转开关
      name: '',
      buyFlag: true // 申购防连点
    };
    // type="confirm"
    // icon="warning"
    // confirmText={this.intl.get('deal-go')}
    // concelText={this.intl.get('cance')}
    // className="trade-intro"
    // autoClose={false}
    // msg={this.intl.get('deal-set')}
    // onClose={() => {this.setState({introPop: false})}}
    // onConfirm={() => {this.props.history.push('/user/safe')}}
    const {controller} = this.props;
    //绑定view
    controller.setView(this);
    //初始化数据，数据来源即store里面的state
    // this.state = Object.assign(this.state, controller.initState);
    this.getFundAccount = controller.assetController.getFundAccount.bind(controller.assetController)
  }

  async componentDidMount() {
    const {controller} = this.props;
    let coinId = Number(getQueryFromPath('id'));
    let result = await controller.initData(coinId);
    let stateObj = result && result.fundList[0] || {};
    if (stateObj.fundType && this.isLogin) {
      let assetAmount = await this.getFundAccount(stateObj.coinId);
      stateObj.assetAmount = assetAmount.fundAccount.accountList[0].availableCount
    }
    if (stateObj.isOver === 2) {
      this.setState({
        popShow: true,
        popType: 'tip3',
        closeButton: false,
        popMsg: this.intl.get('tlb-over-title'),
        autoClose: true
      });
      await Sleep(1000);
      goAssetPath('/taolibao/balance')
      return
    }
    this.setState(Object.assign(this.state, stateObj));
  }

  // 切换tab选中
  changeNav(index) {
    this.setState({
      navSelect: index
    })
  }

  amountInputAdd() {
    let value = this.state.amountInput * 1 + 1;
    // let reg = /^[1-9]\d*$/;
    // if (!reg.test(value))
    //   return
    if (!['CNY', 'USD'].includes(this.state.fund) && this.state.assetAmount < this.state.investBase) { // 余额不足，请先进行充值。
      this.setState(
        {
          popShow: true,
          closeButton: false,
          popMsg: this.intl.get('tlb-remindBalance'),
          confirmText: this.intl.get('charge'),
          cancelText: this.intl.get('cance'),
          cancelHide: false,
          autoClose: false,
          cancelFlag: false,
          clickOutSide: false,
          confirmType: resolveAssetPath('/exchange/charge', {currency: this.state.fund}), //确认按钮点击参数
          closeType: 'hide', //取消按钮点击参数
        }
      );
      return
    }
    let max = ['CNY', 'USD'].includes(this.state.fund) ? this.state.remainAmount : Math.floor(this.state.assetAmount.div(this.state.investBase));
    this.state.remainAmount < max && (max = this.state.remainAmount)
    value > max && (value = max)
    this.setState({
      amountInput: value,
      totalPrice: Number(Number(value).multi(this.state.investBase))
    })
  }

  amountInputMinus() {
    let value = this.state.amountInput - 1;
    // let reg = /^[1-9]\d*$/;
    // if (!reg.test(value))
    //   return
    value < 0 && (value = 0)
    this.setState({
      amountInput: value,
      totalPrice: Number(Number(value).multi(this.state.investBase))
    })
  }

  amountInputChange(value) {
    let reg = /^[1-9]\d*$/;
    if (!reg.test(value) && value !== '')
      return
    if (!['CNY', 'USD'].includes(this.state.fund) && this.state.assetAmount < this.state.investBase) { // 余额不足，请先进行充值。
      this.setState(
        {
          popShow: true,
          closeButton: false,
          popMsg: this.intl.get('tlb-remindBalance'),
          confirmText: this.intl.get('charge'),
          cancelText: this.intl.get('cance'),
          cancelHide: false,
          autoClose: false,
          cancelFlag: false,
          clickOutSide: false,
          confirmType: resolveAssetPath('/exchange/charge', {currency: this.state.fund}), //确认按钮点击参数
          closeType: 'hide', //取消按钮点击参数
        }
      );
      return
    }
    let max = ['CNY', 'USD'].includes(this.state.fund) ? this.state.remainAmount : Math.floor(this.state.assetAmount.div(this.state.investBase));
    this.state.remainAmount < max && (max = this.state.remainAmount)
    value * 1 > max && (value = max)
    this.setState({
      amountInput: value,
      totalPrice: Number(Number(value).multi(this.state.investBase))
    })
  }

  amountAllIn() {
    if (!this.isLogin)
      return
    let assetAmount = this.state.assetAmount,
      investBase = this.state.investBase,
      maxNum = Math.floor(assetAmount / investBase) > this.state.remainAmount ? this.state.remainAmount : Math.floor(assetAmount / investBase);
    this.setState({
      amountInput: maxNum,
      totalPrice: maxNum * this.state.investBase
    })
  }

  fundDeal = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!this.state.isOpen || (this.state.remainAmount <= 0)) {
      return null
    }
    if (!this.isLogin) { // 未登录
      this.setState(
        {
          popShow: true,
          closeButton: true,
          popMsg: this.intl.get('tlb-remindLogin'),
          confirmText: this.intl.get('tlb-remindLoginGo'),
          cancelText: this.intl.get('tlb-remindLoginReg'),
          cancelHide: false,
          cancelFlag: true,
          onCancel: this.closePopup,
          autoClose: false,
          confirmType: resolveLoginPath(), //确认按钮点击参数
          closeType: resolveRegisterPath(), //取消按钮点击参数
        }
      );
      return
    }
    let fundPwdInterval = await this.props.controller.userController.getFundPwdInterval();
    if (fundPwdInterval.mode === -1) { // 未设置资金密码
      this.setState(
        {
          popShow: true,
          closeButton: false,
          popMsg: this.intl.get('tlb-remindPass'),
          confirmText: this.intl.get('tlb-remindPassSet'),
          cancelText: this.intl.get('cance'),
          cancelFlag: false,
          cancelHide: false,
          autoClose: false,
          confirmType: resolveUserPath('/safe'), //确认按钮点击参数
          closeType: 'hide', //取消按钮点击参数
        }
      );
      return
    }
    let totalPrice = this.state.totalPrice,
      assetAmount = this.state.assetAmount;
    if (totalPrice === 0) { // 请输入整数份额
      this.setState(
        {
          popShow: true,
          popType: 'tip2',
          closeButton: false,
          popMsg: this.intl.get('tlb-remindInteger'),
          cancelHide: false,
          autoClose: true,
          cancelFlag: false,
        }
      );
      return
    }
    if (this.state.fundType && totalPrice > assetAmount) { // 余额不足，请先进行充值。
      this.setState(
        {
          popShow: true,
          closeButton: false,
          popMsg: this.intl.get('tlb-remindBalance'),
          confirmText: this.intl.get('charge'),
          cancelText: this.intl.get('cance'),
          cancelHide: false,
          autoClose: false,
          cancelFlag: false,
          confirmType: resolveAssetPath('/exchange/charge', {currency: this.state.fund}), //确认按钮点击参数
          closeType: 'hide', //取消按钮点击参数
        }
      );
      return
    }
    this.setState(
      {fundSure: true}
    )
  }

  async fundDealSubmit(e) { // 立即申购
    e.preventDefault();
    e.stopPropagation();
    let productId = this.state.id,
      amount = Number(this.state.amountInput),
      fundPass = this.state.fundPass;
    if (!this.state.fundPass) { // 资金密码未输入
      this.setState(
        {
          popShow: true,
          popType: 'tip3',
          closeButton: false,
          popMsg: this.intl.get('tlb-pass-empty'),
          autoClose: true
        }
      );
      return
    }
    if (amount > this.state.remainAmount) { // 您申请的份额不足，请重新填写
      this.setState(
        {
          fundSure: false,
          fundPass: '',
          popShow: true,
          popType: 'tip3',
          closeButton: false,
          popMsg: this.intl.get('tlb-remindProduceMore'),
          autoClose: true,
        }
      );
      return
    }
    if (!this.state.buyFlag) {
      return;
    }
    this.setState({
      buyFlag: false
    });
    let result = await this.props.controller.fundDeal(productId, amount, fundPass);
    // console.log('result', result)
    if (result.orderId) {
      this.setState(
        {
          fundSure: false,
          fundPass: '',
          popShow: true,
          popType: 'tip1',
          closeButton: false,
          popMsg: this.intl.get('tlb-getSucc'),
          autoClose: true,
          cancelFlag: false,
          buyFlag: true
        }
      );
      await Sleep(1000);
      // console.log(this.state.fundType, this.state.fund);
      if (this.state.fundType) {
        // console.log('goOrderPath')
        goOrderPath('/fund/detail/deal')
        return
      }
      let flag = 1;
      if (this.state.fund === 'CNY') {
        flag = 2
      }
      goOrderPath('/fund/confirm', {id: JSON.stringify(result.orderId), flag})
      return
    }
    this.setState(
      {
        popShow: true,
        popType: 'tip3',
        closeButton: false,
        popMsg: result.msg,
        autoClose: true,
        buyFlag: true
      }
    )
  }

  popupConfirm() {
    let type = this.state.confirmType;
    if (type === 'hide') {
      this.setState(
        {popShow: false}
      )
      return
    }
    // this.props.history.push(type);
    window.location.href = type
  }

  popupClose() {
    let type = this.state.closeType;
    if (type === 'hide') {
      this.setState(
        {popShow: false}
      )
      return
    }
    window.location.href = type
  }

  closePopup = () => {
    this.setState(
      {popShow: false}
    )
  }

  // popupJump() {
  //   let type = this.state.closeType;
  //   this.props.history.push(`/${type}`);
  // }

  render() {
    const language = this.props.controller.configController.language;
    return (
      <div className='fund-detail'>
        <div className='fund-detail-content'>
          <div className='fund-detail-c'>
            <div className='fund-intro'>
              <div className='fund-name'>
                <img src={TLB_TITLE} alt="" className='fl'/>
                <h3 className='fl'>{this.state.name}</h3>
                {/*<span className='fr'>{this.common.mine}</span>*/}
              </div>
              <div className='fund-type'>
                <div className='fund-type-items fund-type-yields'>
                  <p>{this.state.yields}<em> %</em></p>
                  <span>{this.common.yields}</span>
                </div>
                <div className='fund-type-items'>
                  <p>{this.common.investTime}</p>
                  <span>{this.common.investLimit}</span>
                </div>
                <div className='fund-type-items'>
                  <p>{this.common.redeemTime}</p>
                  <span>{this.common.redeem}</span>
                </div>
              </div>
              <div className='fund-intro-items'>
                <div className='fund-limit'>
                  <Progress percent={this.state.remainPercent} position={false} width={400}/>
                  <span>{this.common.remainderNum} {this.state.remainPercent}%</span>
                </div>
                <ul className={`${language === 'en-US' ? 'ul-en' : ''} clearfix`}>
                  <li>{this.common.mangager}: {this.state.manager}</li>
                  <li>{this.common.risk}: {this.common.riskLevel[this.state.riskLevel]}</li>
                  <li>{this.common.startTime}: {this.state.establish && this.state.establish.toDate('yyyy-MM-dd')}</li>
                  <li>{this.common.fee}: {this.intl.get('tlb-fee-none')}</li>
                  <li>{this.common.interestTime}: {this.common.earnStart[this.state.earnStart]}</li>
                </ul>
              </div>
            </div>
            <div className='fund-buy'>
              <p className='fund-remain'>
                <span>{this.intl.get('tlb-residue')}</span><span> {this.state.remainAmount}{this.intl.get('tlb-investNum')}</span>
              </p>
              <div className='fund-asset'>
                <span>{this.intl.get('tlb-investAmount')}: {this.state.investNum}{this.intl.get('tlb-investNum')} ({this.intl.get('tlb-investNumEvery', {
                  num: this.state.investBase,
                  name: this.state.fund
                })})</span>
                {this.state.fundType && <a
                  href={this.isLogin ? resolveAssetPath('/exchange/charge', {currency: this.state.fund}) : resolveLoginPath()}>{this.intl.get('tlb-charge')}</a>}
              </div>
              <div className='fund-detail-input'>
                <AmountInput
                  className='fund-detail-input'
                  value={this.state.amountInput || ''}
                  add={this.amountInputAdd.bind(this)}
                  minus={this.amountInputMinus.bind(this)}
                  onInput={this.amountInputChange.bind(this)}
                />
                <b>{this.intl.get('tlb-investNum')}</b>
              </div>
              {this.state.fundType && <div className='fund-detail-price'>
                {!this.isLogin ? (<span className='fund-buy-login'>{this.intl.get('tlb-login')}</span>) :
                  <span>{this.intl.get('tlb-account')} {this.state.assetAmount} {this.state.fund}</span>}
                {this.isLogin && <em onClick={this.amountAllIn.bind(this)}>{this.intl.get('tlb-accountAll')}</em>}
              </div> || null}
              <p className='fund-buy-remind fund-buy-remind-first'>
                {this.intl.get('tlb-paymentAmount')}
                {this.state.totalPrice && Number(this.state.totalPrice).format({
                  number: ['CNY', 'USD'].includes(this.state.fund) ? "legal" : "property",
                  style: {decimalLength: ['CNY', 'USD'].includes(this.state.fund) ? 2 : 8}
                })}
                {this.state.fund}
              </p>
              <p className='fund-buy-remind fund-buy-remind-second'>
                {this.intl.get('tlb-profitTime', {
                  startTime: language === 'en-US' ? this.state.profitTime.toDate('yyyy-MM-dd') : this.state.profitTime.toDate('MM-dd').replace('-', this.intl.get('month')) + this.intl.get('Su'),
                  getTime: language === 'en-US' ? this.state.redeemTime.toDate('yyyy-MM-dd') : this.state.redeemTime.toDate('MM-dd').replace('-', this.intl.get('month')) + this.intl.get('Su')
                })}
              </p>
              <p
                className={`${(this.state.isOpen && (this.state.remainAmount > 0)) ? '' : 'disable-p'} ${language === 'en-US' ? 'fund-buy-now-en' : ''} fund-buy-now`}>
                <span onClick={this.fundDeal}>
                  {this.state.isOpen ? (this.isLogin ? this.intl.get('tlb-open-btn') : this.intl.get('tlb-login-btn')) : this.intl.get('tlb-unopen-title')}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className='fund-explain'>
          <div className='fund-nav-c'>
            {this.common.nav.map((v, index) => {
                return (
                  <p className={this.state.navSelect === index ? 'nav-active' : ''} key={index}
                     onClick={this.changeNav.bind(this, index)}>{v}</p>
                )
              }
            )}
          </div>
          <div className='fund-explain-content'>
            {this.state.navSelect === 0 && <FundProduct
              manager={this.state.manager}
              fund={this.state.fund}
              profitTime={this.state.profitTime}
              redeemTime={this.state.redeemTime}
              earnStart={this.common.earnStart[this.state.earnStart]}
              controller={this.props.controller}
            />}
            {this.state.navSelect === 1 && <FundRisk
              manager={this.state.manager}
              fund={this.state.fund}
              earnStart={this.common.earnStart[this.state.earnStart]}
            />}
            {this.state.navSelect === 2 && <FundStable/>
            }
          </div>
        </div>
        {this.state.popShow &&
        <Popup
          cancelFlag={this.state.cancelFlag}
          onCancel={this.closePopup}
          type={this.state.popType}
          icon={this.state.popIcon}
          confirmText={this.state.confirmText}
          cancelText={this.state.cancelText}
          clickOutSide={this.state.clickOutSide}
          autoClose={this.state.autoClose}
          msg={this.state.popMsg}
          closeButton={this.state.closeButton}
          className='fund-deal-pop'
          onConfirm={this.popupConfirm.bind(this)}
          onClose={this.popupClose.bind(this)}
          // jumpFlag={this.state.jumpFlag}
        />
        }
        {this.state.fundSure &&
        <div className='fund-sure-content'>
          <div className='fund-sure'>
            <div className='fund-sure-title'>
              <span>{this.intl.get('tlb-comfirm', {
                num: this.state.totalPrice && Number(this.state.totalPrice).format({
                  number: ['CNY', 'USD'].includes(this.state.fund) ? "legal" : "property",
                  style: {decimalLength: ['CNY', 'USD'].includes(this.state.fund) ? 2 : 8}
                }),
                name: this.state.fund,
                amount: this.state.amountInput
              })}</span>
              <em onClick={() => this.setState({fundSure: false, fundPass: ''})}>
              </em>
            </div>
            <p>{this.intl.get('fundPass')}</p>
            <input type="password" placeholder={this.intl.get('inputFundPassword')} value={this.state.fundPass}
                   onChange={(e) => {
                     this.setState({fundPass: e.target.value})
                   }}/>
            <div className='fund-sure-sub'>
              <button onClick={this.fundDealSubmit.bind(this)}>{this.intl.get('ok')}</button>
            </div>
          </div>
        </div>
        }
      </div>
    )
  }
}
