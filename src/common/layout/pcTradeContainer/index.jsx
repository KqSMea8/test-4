import React, { Component } from "react";

import Translate from '@/core/libs/Translate'


import "@/common/css/base.styl";
import "@/common/css/reset.styl";
import "@/common/component/style/index.styl";

import ConfigController from "@/class/config/ConfigController";
import PopupController from "@/class/popup/PopupController";
import UserController from "@/class/user/UserController";
import LoginController from "@/class/login/LoginController";
import MarketController from "@/class/market/MarketController";
import NoticeController from "@/class/notice/NoticeController";
import DealController from "@/class/deal/DealController"
import AssetController from "@/class/asset/AssetController";

import Header from './component/Header'
// import Footer from "./component/Footer.jsx";
import Popup from "@/common/component/viewsPopup/Popup.jsx"


let configController,
    popupController,
    userController,
    noticeController,
    marketController,
    tradeDealController,
    assetController,
    loginController;

class App extends Component {
  constructor(props) {
    super(props);
    configController = new ConfigController();
    popupController = new PopupController();
    userController = new UserController();
    noticeController= new NoticeController();
    loginController= new LoginController();
    marketController= new MarketController('market');
    tradeDealController= new DealController();
    assetController = new AssetController();
    
    noticeController.configController = configController;
    noticeController.userController = userController;
    
    userController.configController = configController;
    
    loginController.userController = userController;
    loginController.configController = configController;
    loginController.noticeController = noticeController;
    loginController.popupController = popupController;
  
    assetController.configController = configController;
    assetController.userController = userController;
    assetController.marketController = marketController;
    // assetController.activityController = activityController;
    assetController.popupController = popupController;
  
    marketController.userController = userController;
    marketController.configController = configController;
    marketController.assetController = assetController;
    marketController.tradeDealController = tradeDealController;
  
    tradeDealController.configController = configController;
    tradeDealController.marketController = marketController;
  }
  
  async componentDidMount() {
    configController.setOs(3);
    await configController.getActivityState();
    await configController.checkVersion();
  }
  
  
  render() {
    return (
          <div className='web-wrap' style={{minWidth: '1280px'}}>
            <div>
              <Header
                  navClass={"tradeNav"}
                  userController={userController}
                  noticeController={noticeController}
                  configController={configController}
                  loginController={loginController}
                  marketController={marketController}
                  dealController={tradeDealController}
              />
            </div>
            <div
                style={{
                  width: "100%"
                }}
            >
              {React.cloneElement(this.props.children, {configController, popupController, userController, marketController, assetController, tradeDealController})}
            </div>
            {/*<Footer configController={configController}/>*/}
            <Popup controller={popupController}></Popup>
          </div>
    );
  }
}

export default Translate(App)