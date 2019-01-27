import React, {Component} from 'react';
import ExchangeViewBase from "@/components/ExchangeViewBase";
import './style/footer.styl'

import {
  resolveHelpPath,
  resolveNotificationPath
} from "@/config/UrlConfig"

import {
  ACT_REG_SERVIVE,
  USER_ID01,
  USER_DRIVER03,
  FOOTER_TWITTER_PRO,
  FOOTER_FACEBOOK_PRO,
  FOOTER_TELEGRAM_PRO,
  FOOTER_WB_PRO,
  FOOTER_WECHAT_PRO,
  ACT_REG_TELEGRAM,
  LOGO_DOWNLOAD
} from '@/config/ImageConfig';

export default class Footer extends ExchangeViewBase {
  constructor() {
    super()
    this.footerArray = [
      {label: this.intl.get('help-fees'), to: resolveHelpPath('/pricing')},
      {label: this.intl.get('footer-coin'), to: resolveHelpPath('/currency')},
      {label: this.intl.get('footer-request'), to: resolveHelpPath('/apply')},
      {label: this.intl.get('footer-protocol'), to: resolveHelpPath('/terms')},
      {label: this.intl.get('header-notice'), to: resolveNotificationPath()},
      // {label: this.intl.get('help-api-title'), to: '/help/api'}
    ];
    this.onScroll = () => {
      let headerName = document.getElementById('header'), activeHeight = document.getElementById('active');
      let buttonTop = document.querySelector('.aside-nav-top');
      let buttonKf = document.querySelector('.aside-nav-desk');
      let buttonErweima = document.querySelector('.aside-nav-erweima');
      let buttonApp = document.querySelector('.aside-nav-app');
      let buttonUp = document.querySelector('.top-aside');
      let buttonDown = document.querySelector('.down-aside');
      let buttonK = document.getElementById('udesk_container');
      let scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

      // if (activeHeight) {
      //   if(scrollTop >= activeHeight.offsetHeight - 120) {
      //     headerName.className = 'headerNav clearfix'
      //   } else {
      //     headerName.className = 'homeNav clearfix'
      //   }
      // }

      if (scrollTop >= document.documentElement.clientHeight / 2) {
        buttonTop.style.display = "block";
        buttonKf.style.display = "block";
        buttonErweima.style.display = "block";
        buttonApp.style.display = "block";
        buttonUp.style.display = "block";
        buttonDown.style.display = "block";
        buttonK && (buttonK.style.display = "block");
      } else {
        buttonTop.style.display = "none";
        buttonKf.style.display = "none";
        buttonErweima.style.display = "none";
        buttonApp.style.display = "none";
        buttonUp.style.display = "none";
        buttonDown.style.display = "none";
        buttonK && (buttonK.style.display = "none");
      }
    };
  }

  componentDidMount() {
    let lang = this.props.configController.language;
    // 加载客服
    (function (a, h, c, b, f, g) {
      a["UdeskApiObject"] = f;
      a[f] = a[f] || function () {
        (a[f].d = a[f].d || []).push(arguments)
      };
      g = h.createElement(c);
      g.async = 1;
      g.charset = "utf-8";
      g.src = b;
      c = h.getElementsByTagName(c)[0];
      c.parentNode.insertBefore(g, c)
    })(window, document, "script", "https://assets-cli.udesk.cn/im_client/js/udeskApi.js", "ud");
    ud({
      "code": "278eh9c7",
      "link": "https://qbservice.udesk.cn/im_client/?web_plugin_id=" + (lang === "zh-CN" ? "49139" : "50065")
    });
    window.addEventListener("scroll", this.onScroll);
  }

  componentWillUnmount() {
    let buttonK = document.getElementById('udesk_container');
    buttonK && (buttonK.style.display = "none");
    window.removeEventListener("scroll", this.onScroll);
  }

  render() {
    let language = this.props.configController.language,
        serviceImgFlag = this.props.serviceFlag ? this.props.serviceFlag : 0, // 0 通用 1otc 2套利宝
        serviceImgList = [ACT_REG_SERVIVE, USER_ID01, USER_DRIVER03]
    return (
      <div className="footer-wrap">
        <div className="footer-top-wrap">
          <div className="clearfix footer-top">
            <ul>
              {this.footerArray.map((item, index) => (<li key={index}>
                <a href={item.to} target="_blank">{item.label}</a>
              </li>))}
              <li><a href="http://qbservice.udesk.cn/hc" target='_blank'>{this.intl.get('normalProblem')}</a></li>
            </ul>
            <ol className="clearfix">
              <li>
                <a href="https://twitter.com/QB_Exchange" target="_blank">
                  <img src={FOOTER_TWITTER_PRO} alt=""/>
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/qbexchange/" target="_blank">
                  <img src={FOOTER_FACEBOOK_PRO} alt=""/>
                </a>
              </li>
              <li>
                <a href="https://t.me/QB_ExchangeEN" target="_blank">
                  <img src={FOOTER_TELEGRAM_PRO} alt=""/>
                </a>
              </li>
              <li>
                <a href="https://weibo.com/u/6596593083/home?wvr=5" target="_blank">
                  <img src={FOOTER_WB_PRO} alt=""/>
                </a>
              </li>
              <li>
                <img src={FOOTER_WECHAT_PRO} alt="" className="wx-img"/>
                <i className="wx-qrCode"></i>
              </li>
            </ol>
          </div>
        </div>
        <p>© 2018 QB.com All rights reserved</p>
        <div className='aside-nav'>
          <div className="top-aside">
            <div className='aside-nav-app'>
              <div className='erweima'>
                <img src={LOGO_DOWNLOAD} alt=""/>
                <span>{this.intl.get("download-erweima")}</span>
              </div>
            </div>
            <div className="aside-nav-erweima">
              <div className='erweima'>
                <img src={language === "en-US" ? ACT_REG_TELEGRAM : serviceImgList[serviceImgFlag]} alt=""/>
                <span>{this.intl.get("footer-service")}</span>
              </div>
            </div>
            <div className='aside-nav-desk'></div>
          </div>
          <div className="down-aside">
            <div className='aside-nav-top' onClick={() => {
              window.scroll(0, 0)
            }}></div>
          </div>
        </div>
      </div>
    )
  }
}

