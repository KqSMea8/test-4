import React, {Component} from 'react';
import './style/headerTrade.styl'
import ExchangeViewBase from "@/components/ExchangeViewBase";
import {ChangeFontSize} from '@/core'
import TradePairDeal from '@/view/trade/component/component/TradePairDeal.jsx'
import TradeMarket from '@/view/trade/component/component/TradeMarket.jsx'
import BasePopup from "@/common/baseComponent/Popup";

import Translate from '@/core/libs/Translate'
import TradeLang from '@/view/trade/lang'

import {
  resolveHomePath,
  resolveLoginPath,
  resolveRegisterPath,
  resolveUserPath,
  goUserPath,
  goLoginPath
} from "@/config/UrlConfig"
import { HEADER_EXCHANGE_SELECT } from '@/config/ImageConfig';


class TradeHeader extends ExchangeViewBase {
  constructor(props) {
    super(props)
    this.state = {
      navClass: 'headerNav',
      languageIndex: 0,
      userNoticeHeader: {},
      // userNoticePop: false, // 弹窗信息
      // userContent: "", // 弹窗信息
      showNews: false, // 消息下拉
      otherLogin: false, // 提示登录弹窗
      otherLoginCon: "", // 提示登录弹窗内容
      languageArr: [
        {content: '简体中文', value: "zh-CN"},
        {content: 'English', value: "en-US"}
      ],
      status: false,
      showBind: true
    };
    this.configController = this.props.configController;
    this.loginController = this.props.loginController;
    this.userController = this.props.userController;
    this.noticeController = this.props.noticeController;
    this.changeLanguage = this.configController.changeLanguage.bind(this.configController); // 改变语言
    this.clearLoginInfo = this.loginController.clearLoginInfo.bind(this.loginController); // 退出登录
    this.userInitData = this.userController.initData.bind(this.userController); // 用户信息
    this.handleMarket = this.handleMarket.bind(this); // 点击市场
    this.hideMarket = this.hideMarket.bind(this);
    this.loginOut = this.loginOut.bind(this);
    //绑定view
    this.noticeController.setHeaderView(this);
    //绑定view
    this.loginController.setHeaderOutView(this);
    //绑定view
    this.userController.setHeaderUserView(this);
    //初始化数据，数据来源即store里面的state
    this.state = Object.assign(this.state, this.noticeController.store.state.userNoticeHeader);
    this.matched = '/home'
  }

  async componentDidMount() {
    this.props.userController.userToken && await this.userInitData();
    this.state.languageArr.forEach((v, index) => {
      v.value === this.configController.language && this.setState({languageIndex: index})
    })
  }

  loginOut() {
    this.clearLoginInfo()
  }

  handleMarket() {
    let statusBefore = this.state.status
    this.setState({
      status: !statusBefore
    })
  }

  hideMarket() {
    this.setState({
      status: false
    })
  }

  hideBind = () => {
    this.Storage.mo.removeAll();
    this.setState({
      showBind: false
    })
  };

  goBind = () => {
    this.Storage.mo.removeAll();
    goUserPath()
  };

  handlerLogin = () => {
    this.Storage.path.set(window.location.href);
    goLoginPath()
  };

  render() {
    let userToken = this.props.userController.userToken || null,
      userName = this.props.userController.userName || null,
      language = this.props.configController.language,
      status = this.state.status,
      bindFlagS = this.Storage.mo.get();
    return (
      <div className={`${this.props.navClass} clearfix`} id="header">
        <ul className="clearfix">
          <li className='nav-logo'>
            <a href={resolveHomePath()}></a>
          </li>
        </ul>
        <div className='trade-exchange'>
          <TradePairDeal status={status} onMarketChange={this.handleMarket} controller={this.props.dealController}/>
        </div>
        <div className='trade-pro-market'>
          <TradeMarket status={status} onMarketChange={this.handleMarket} onHideMarket={this.hideMarket}
                       controller={this.props.marketController}/>
        </div>
        <ol>
          {!userToken && <li className="login-li">
            <a href={resolveRegisterPath()} className={window.location.href.includes('/register') ? 'active' : ''}>{this.intl.get('header-regist')}</a>／
            <span onClick={this.handlerLogin} className={window.location.href.includes('/login') ? 'active' : ''}>{this.intl.get('login')}</span>
          </li>}
          {userToken && <li className="user-li">
            <p>{userName}</p>
            <ul className={`login-ul ${language === 'zh-CN' ? '' : 'en-ul'}`}>
              <li>
                <a href={resolveUserPath('/safe')}>{`${this.intl.get('header-set')}`}</a>
              </li>
              <li>
                <a href={resolveUserPath('/identity')}>{`${this.intl.get('header-idVerify')}`}</a>
              </li>
              <li className="login-out" onClick={this.loginOut}>{this.intl.get("header-logOut")}</li>
            </ul>
          </li>}
          <li className="language-li">
            <p>
              <span>{this.state.languageArr[this.state.languageIndex].content}</span>
            </p>
            <ul className="language-ul">
              {this.state.languageArr.map((v, index) => (<li key={index} onClick={i => {
                this.state.languageIndex !== index && this.changeLanguage(v.value)
              }}>
                <span>{v.content}</span>
                {this.state.languageIndex === index && <img src={HEADER_EXCHANGE_SELECT} alt=""/>}
              </li>))}
            </ul>
          </li>
        </ol>
        {this.state.otherLogin && <div className="other-login">
          <p>{this.state.otherLoginCon === 2006 ? this.intl.get("login-miss") : (this.state.otherLoginCon === 120 ? this.intl.get("login-other") : this.intl.get("login-severErr"))}</p>
        </div>}
        {bindFlagS && this.state.showBind && [0, 1].includes(this.state.userInfo && this.state.userInfo.loginVerify) &&
        <BasePopup
          type="confirm"
          msg={this.intl.get('home-bind')}
          onClose={this.hideBind}
          onConfirm={this.goBind}
          className="trade-intro"
          confirmText={this.intl.get('home-goBind')}
          cancelText={this.intl.get('asset-nextTime')}
        />}
      </div>
    )
  }
}

export default Translate(TradeHeader, TradeLang)
