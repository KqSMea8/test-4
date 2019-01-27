import React, { Component } from "react";
import intl from "react-intl-universal";
import HomeRecommend from './component/HomeRecommend.jsx' //交易盘市场
import HomeMarket from './component/HomeMarket.jsx' //交易盘市场
import HomeNotice from './component/HomeNotice.jsx' // 首页公告
import HomeActivityBanner from './component/HomeActivityBanner.jsx' // 首页活动
import HomeSuperiority from './component/HomeSuperiority.jsx'
import BasePopup from "@/common/baseComponent/Popup/index";
import Storage from "@/core/storage";

import MarketController from '@/class/market/MarketController'

let recommendController;

import "./stylus/index.styl"
import Translate from "@/core/libs/Translate";
import HomeLang from "../lang";

import {
  goUserPath
} from "@/config/UrlConfig"

class Home extends Component {
  constructor(props) {
    super(props);
    this.name = 'home';
    this.intl = intl;
    this.state = {
      popupShow: true
    };
    recommendController = new MarketController('recommend');
    recommendController.configController = props.marketController.configController
    this.sendStatis = props.marketController.configController.sendStatis.bind(props.marketController.configController)
  }

  async componentDidMount() {
    this.sendStatis({
      event: 'homePV',//操作代码
      type: 'home',//tab
    })
  }


  hideBind = () => {
    this.props.userController.changeUserIsNew();
    Storage.mo.removeAll();
    this.setState({
      popupShow: false
    })
  };

  goBind = () => {
    this.props.userController.changeUserIsNew();
    Storage.mo.removeAll();
    goUserPath('/identity')
  };

  render() {
    return (
      <div className="home-wrap-pro">
        <div className="home-top">
          <HomeActivityBanner controller={this.props.activityController}/>
          <HomeNotice controller={this.props.noticeController}/>
        </div>
        <div className="home-bottom">
          <HomeRecommend controller={recommendController}/>
          <HomeMarket controller={this.props.marketController}/>
          <HomeSuperiority controller={this.props.activityController}/>
        </div>
        {this.props.userController.userIsNew && this.state.popupShow && <BasePopup
          type="confirm"
          msg={this.intl.get('home-new')}
          onClose={this.hideBind}
          onConfirm={this.goBind}
          confirmText={this.intl.get('user-name')}
          cancelText={this.intl.get('cance')}
        />}
      </div>
    );
  }
}

export default Translate(Home, HomeLang)
