import React, {Component} from 'react';
import ExchangeViewBase from "@/components/ExchangeViewBase";
import UserNoticeContent from '@/view/message/component/component/UserNoticePop.jsx'
import BasePopup from "@/common/baseComponent/Popup";
import {AsyncAll, ChangeFontSize, Storage} from '@/core'
import './style/header.styl'

import {
  resolveAssetPath,
  resolveFundPath,
  resolveHomePath,
  goHomePath,
  resolveLoginPath,
  goLoginPath,
  resolveMessagePath,
  resolveOrderPath,
  resolveOtcPath,
  resolveRegisterPath,
  resolveTradePath,
  resolveUserPath,
  goUserPath,
  goOtcPath
} from "@/config/UrlConfig"
import {HEADER_CN, HEADER_EN} from '@/config/ImageConfig';

const scrollbot = require('simulate-scrollbar');

export default class Header extends ExchangeViewBase {
  constructor(props) {
    super(props);
    this.name = "header";
    this.errObj = {
      2006: this.intl.get("login-miss"),
      2007: this.intl.get("login-severErr"),
      120: this.intl.get("login-other")
      // 605: this.intl.get("login-userErr")
    };
    this.state = {
      navClass: 'homeNav',
      languageIndex: 0,
      showBind: true,
      hasStore: undefined,
      navArrayLeft: [
        {
          label: this.intl.get('header-exchange'),
          to: resolveTradePath(),
          select: false,
          linkUser: false,
        },
        {
          label: this.intl.get('header-legal'),
          to: 'javascript:void(0)',
          select: true,
          linkUser: false,
          childrenName: 'otc-child',
          childrenList: [
            {to: '', label: this.intl.get('header-legal'), target: '_self'},
            {to: '/fastBuy', label: this.intl.get('header-legal-quick'), target: '_self'},
            {to: '/publishAdvertising', label: this.intl.get('header-legal-ad'), target: '_blank', business: true},
            {to: '/myAd', label: this.intl.get('header-legal-my'), target: '_blank', business: true}
          ]
        },
        {
          label: this.intl.get('header-fund'),
          to: resolveFundPath(),
          select: false,
          linkUser: false
        }
      ],
      navArrayRight: [
        {
          label: `${this.intl.get('header-order2')}`,
          to: "javascript:void(0)",
          select: true,
          tokenShow: false,
          class: "order-li",
          childrenList: [
            {to: resolveOrderPath('/qb/detail/current'), label: this.intl.get('header-order-coin')},
            {to: resolveOrderPath('/otc/detail/current'), label: this.intl.get('header-order-legal')},
            {to: resolveOrderPath('/fund/detail/pay'), label: this.intl.get('header-order-tlb')}
          ]
        },
        {
          label: `${this.intl.get('header-assets2')}`,
          to: "javascript:void(0)",
          select: true,
          tokenShow: false,
          class: "asset-li",
          childrenList: [
            {to: resolveAssetPath('/exchange/balance'), label: this.intl.get('header-assets-coin')},
            {to: resolveAssetPath('/otc/balance'), label: this.intl.get('header-assets-legal')},
            {to: resolveAssetPath('/taolibao/balance'), label: this.intl.get('header-assets-tlb')}
          ]
        },
        {
          label: `${this.intl.get('user-invite')}`,
          to: resolveUserPath('/invite'),
          select: false,
          tokenShow: false,
          class: "invite-li"
        }
      ],
      userNoticeHeader: {}, // 头部用户消息
      userInfo: {}, // 头部用户消息
      userNoticePop: false, // 弹窗信息
      userContent: "", // 弹窗信息
      showNews: false, // 消息下拉
      otherLogin: false, // 提示登录弹窗
      otherLoginCon: "", // 提示登录弹窗内容
      languageArr: [
        {imgUrl: HEADER_CN, content: '简体中文', value: "zh-CN"},
        // {imgUrl: '/static/img/home/chinese.svg', content: '繁體中文'},
        {imgUrl: HEADER_EN, content: 'ENGLISH', value: "en-US"}
      ]
    };
    this.configController = this.props.configController;
    this.loginController = this.props.loginController;
    this.userController = this.props.userController;
    this.noticeController = this.props.noticeController;
    this.changeLanguage = this.configController.changeLanguage.bind(this.configController); // 改变语言
    this.clearLoginInfo = this.loginController.clearLoginInfo.bind(this.loginController); // 退出登录
    this.getUserNoticeHeader = this.noticeController.getUserNoticeHeader.bind(this.noticeController); // 获取通知列表
    this.readAllUserNotifications = this.noticeController.readAllUserNotifications.bind(this.noticeController); //  全部已读
    this.upDateUserNoctice = this.noticeController.upDateUserNoctice.bind(this.noticeController); // 消息变成已读
    this.changeNotice = this.noticeController.changeNotice.bind(this.noticeController); // 改变列表页信息
    this.changeAllNotice = this.noticeController.changeAllNotice.bind(this.noticeController); // 全部已读改变列表页信息
    this.userInitData = this.userController.initData.bind(this.userController); // 用户信息
    this.hasStore = this.userController.hasStore.bind(this.userController);//是否有发布广告权限
    //绑定view
    this.noticeController.setHeaderView(this);
    //绑定view
    this.loginController.setHeaderOutView(this);
    //绑定view
    this.userController.setHeaderUserView(this);
    //初始化数据，数据来源即store里面的state
    this.state = Object.assign(this.state, this.noticeController.store.state.userNoticeHeader);
    // this.matched = '/home';

    // 点击其他部分隐藏消息弹窗
    this.hideNotice = (event) => {
      let el = event.target;
      while (el) {
        if (el.classList && el.classList.contains("new-li")) return;
        el = el.parentNode;
      }
      this.setState({showNews: false});
    };
  }

  async componentDidMount() {
    this.customScroll = document.getElementById('notice_bar') && new scrollbot('#notice_bar');
    let changeBase = this.props.navClass === 'tradeNav' ? 1440 * 2 : 1440
    ChangeFontSize(1440 * 0.8, changeBase)
    this.props.userController.userToken && await AsyncAll([this.getUserNoticeHeader(1, 0, 0), this.userInitData()]);
    this.state.languageArr.forEach((v, index) => {
      v.value === this.configController.language && this.setState({languageIndex: index})
    });
    // this.state.navArrayLeft.forEach(v => {
    //   this.userToken && (v.tokenShow = false);
    //   this.userToken && v.to === "https://mixotc.com/" && (v.to = `https://mixotc.com/?token=${this.userToken}`)
    // });
    // this.state.navArrayRight.forEach(v => {
    //   this.props.userController.userToken && (v.tokenShow = true);
    // });
    document.addEventListener("click", this.hideNotice)
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.hideNotice);
  }

  componentWillUpdate(props, state, next) {
    if (props.navClass === 'tradeNav') {
      ChangeFontSize(1440 * 0.8, 1440 * 2)
    }
  }

  componentDidUpdate() {
    this.customScroll && this.customScroll.refresh();
  }

  loginOut = () => { // 退出登录
    this.clearLoginInfo();
    goHomePath()
    // let navArrayLeft = this.state.navArrayLeft
    // navArrayLeft[2].tokenShow = true
    // this.setState({navArrayLeft})
  };

  checkAll = () => { // 全部已读
    let userNoticeHeader = this.state.userNoticeHeader;
    userNoticeHeader = {};
    this.setState({
      userNoticeHeader,
      showNews: false
    });
    this.readAllUserNotifications();
    this.changeAllNotice()
  };

  changeHeaderNotice(v, index) { // 改变头部消息数量
    let userNoticeHeader = this.state.userNoticeHeader;
    userNoticeHeader.list.length && userNoticeHeader.list.splice(index, 1);
    this.setState({
      userContent: this.props.configController.language === 'zh-CN' ? v.content.contentCN : v.content.contentEN,
      userNoticePop: true,
      userNoticeHeader,
      showNews: false
    });
    this.changeNotice(v);
    this.upDateUserNoctice(v.id)
  }

  hideBind = () => {
    Storage.mo.removeAll();
    this.setState({
      showBind: false
    })
  };

  goBind = () => {
    Storage.mo.removeAll();
    goUserPath()
  };

  noBusinessTip = (to) => {
    this.props.popupController.setState({
      isShow: true,
      type: 'confirm',
      msg: to === '/myAd' ? this.intl.get('my-ad-auth') : this.intl.get('publish-ad-auth'),
      onConfirm: () => {
        this.props.popupController.setState({isShow: false})
      }
    })
  };

  verifyStore = async (to) => {
    if (this.state.hasStore === true) {
      goOtcPath(to);
      return;
    }
    if (this.state.hasStore === false) {
      this.noBusinessTip(to)
      return;
    }
    let result = await this.hasStore();
    if (result === true) {
      this.setState({hasStore: true}, () => goOtcPath(to))
      return;
    }
    if (result && result.hasStore === false) {
      this.noBusinessTip(to)
      this.setState({hasStore: false})
      return;
    }
    result && result.msg && this.props.popupController.setState({
      isShow: true,
      type: 'confirm',
      msg: result.msg,
      onConfirm: () => {
        this.props.popupController.setState({isShow: false})
      }
    })
  };

  handlerLogin = () => {
    Storage.path.set(window.location.href);
    goLoginPath()
  };

  render() {
    let userToken = this.props.userController.userToken || null,
      userName = this.props.userController.userName || null,
      isNew = this.props.userController.userIsNew || null,
      language = this.props.configController.language,
      bindFlagS = Storage.mo.get();
    this.state.navArrayLeft.forEach(v => {
      userToken && v.to === "https://mixotc.com/" && (v.to = `https://mixotc.com/?token=${userToken}`)
    });
    this.state.navArrayRight.forEach(v => {
      userToken && (v.tokenShow = true);
    });
    return (
      <div className={`${this.props.navClass} clearfix`} id="header">
        <div className="home-header-con clearfix">
          <ul className="clearfix">
            <li className='nav-logo'>
              <a href={resolveHomePath()}></a>
            </li>
            {this.state.navArrayLeft.map((v, index) => (
              <li key={index}
                  className={`header-nav${(location.hostname === resolveHomePath() || location.href.includes(v.to)) ? '-active' : ''} ${v.select ? 'select-list' : ''}`}>
                <a href={v.to}>{v.label.toUpperCase()}</a>
                {/*<img src={this.$imagesMap.$nomal_down} alt=""/>*/}
                {v.select && (
                  <ul className={`${language === 'zh-CN' ? '' : 'en-ul'} ${v.childrenName} select-router`}>
                    {v.childrenList.map((v, index) => {
                      return (
                        !v.business ?
                          <li key={index}>
                            <a href={resolveOtcPath(v.to)} target={v.target}>{v.label.toUpperCase()}</a>
                          </li>
                          :
                          <li key={index} onClick={() => {
                            userToken ? this.verifyStore(v.to) : goLoginPath()
                          }}>
                            <a>{v.label.toUpperCase()}</a>
                          </li>
                      )
                    })}
                  </ul>
                )}
              </li>)
            )}
          </ul>
          <ol>
            {this.state.navArrayRight.map((v, index) => (
              v.tokenShow && <li key={index} className={`${v.select ? 'select-list' : ''} ${v.class}`}>
                <a href={v.to}
                   className={window.location.href.includes(v.to) ? 'active' : ''}>{v.label.toUpperCase()}</a>
                {v.select && (
                  <ul className={`${language === 'zh-CN' ? '' : 'en-ul'} select-router`}>
                    {v.childrenList.map((v, index) => {
                      return (
                        <li key={index}>
                          <a href={v.to}>{v.label.toUpperCase()}</a>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </li>
            ))}
            {userToken && <li className="new-li">
              <div className={`${this.state.showNews ? 'new-active-div' : ''} new-li-img`}
                   onClick={() => {
                     this.setState({showNews: !this.state.showNews});
                   }}>
                {/*<img src={this.state.showNews ? this.$imagesMap.$header_news_active : this.$imagesMap.$header_news} alt=""/>*/}
                <i
                  className={Object.keys(this.state.userNoticeHeader || {}).length && this.state.userNoticeHeader.list && this.state.userNoticeHeader.list.length ? '' : 'hide'}>{Object.keys(this.state.userNoticeHeader || {}).length && this.state.userNoticeHeader.list && this.state.userNoticeHeader.list.length}</i>
              </div>
              {<div className={`new-li-content ${this.state.showNews ? '' : 'hide'}`}>
                <p className="clearfix">
                  <span>{this.intl.get("userNotice")}</span>
                  <em onClick={this.checkAll}>{this.intl.get("notice-allRead")}</em>
                </p>
                <div id="notice_bar" style={{width: '100%', overflow: 'hidden', maxHeight: '150px'}}>
                  <div>
                    <div>
                      {Object.keys(this.state.userNoticeHeader || {}).length && this.state.userNoticeHeader.list && this.state.userNoticeHeader.list.length ? (
                        <ul id="notice_bar_con">
                          {Object.keys(this.state.userNoticeHeader || {}).length && this.state.userNoticeHeader.list && this.state.userNoticeHeader.list.map((v, index) => (
                            <li key={index} onClick={value => this.changeHeaderNotice(v, index)} className="clearfix">
                              <span>{language === 'zh-CN' ? v.content.contentCN.replace(/<br\s*\/>/g, '...') : v.content.contentEN.replace(/<br\s*\/>/g, '...')}</span>
                              <b>{v.createAt.toDate('yyyy-MM-dd HH:mm:ss')}</b>
                            </li>))
                          }
                        </ul>) : (<div className="nothing-div">{this.intl.get("notice-none")}</div>)
                      }
                    </div>
                  </div>
                </div>
                <a href={resolveMessagePath()} className="check-all"
                   onClick={e => this.setState({showNews: false})}>{this.intl.get("asset-viewAll")}</a>
              </div>}
            </li>}
            {!userToken && <li className="login-li">
              <a href={resolveRegisterPath()}
                 className={window.location.href.includes('/reg') ? 'active' : ''}>{this.intl.get('header-regist').toUpperCase()}</a>／
              <span className={window.location.href.includes('/login') ? 'active' : ''}
                     onClick={this.handlerLogin}>
                {this.intl.get('login').toUpperCase()}
              </span>
            </li>}
            {userToken && <li className="user-li">
              <p>{userName}</p>
              <ul className={`login-ul ${language === 'zh-CN' ? '' : 'en-ul'}`}>
                <li>
                  <a href={resolveUserPath('/safe')}>{`${this.intl.get('header-set').toUpperCase()}`}</a>
                </li>
                <li>
                  <a href={resolveUserPath('/identity')}>{`${this.intl.get('header-idVerify').toUpperCase()}`}</a>
                </li>
                <li className="login-out" onClick={this.loginOut}>{this.intl.get("header-logOut").toUpperCase()}</li>
              </ul>
            </li>}
            <li className="language-li">
              <p>
                {/*<img src={this.state.languageArr[this.state.languageIndex].imgUrl} alt=""/>*/}
                <span>{this.state.languageArr[this.state.languageIndex].content}</span>
              </p>
              <ul className="language-ul">
                {this.state.languageArr.map((v, index) => (
                  <li key={index} className={this.state.languageIndex === index ? 'hide' : ''} onClick={i => {
                    this.changeLanguage(v.value)
                  }}>
                    {/*<img src={v.imgUrl} alt=""/>*/}
                    <span>{v.content}</span>
                  </li>))}
              </ul>
            </li>
          </ol>
        </div>
        {this.state.userNoticePop && <UserNoticeContent
          onClose={() => {
            this.setState({userNoticePop: false});
          }}
          content={this.state.userContent}/>}
        {this.state.otherLogin && <div className="other-login">
          {/*<p>{this.state.otherLoginCon === 2006 ? this.intl.get("login-miss") : (this.state.otherLoginCon === 120 ? this.intl.get("login-other") : this.intl.get("login-severErr"))}</p>*/}
          <p>{this.errObj[this.state.otherLoginCon]}</p>
        </div>}
        {!isNew && bindFlagS && this.state.showBind && [0, 1].includes(this.state.userInfo && this.state.userInfo.loginVerify) &&
        <BasePopup
          type="confirm"
          msg={this.intl.get('home-bind')}
          onClose={this.hideBind}
          onConfirm={this.goBind}
          confirmText={this.intl.get('home-goBind')}
          cancelText={this.intl.get('asset-nextTime')}
        />}
      </div>
    )
  }
}

