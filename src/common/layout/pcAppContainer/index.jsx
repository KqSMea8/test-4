import React, {Component} from "react";
// import {BrowserRouter as Router} from "react-router-dom";

import Translate from '@/core/libs/Translate'


import "@/common/css/base.styl";
import "@/common/css/reset.styl";
import "@/common/component/style/index.styl";

import ConfigController from "@/class/config/ConfigController";
import PopupController from "@/class/popup/PopupController";
import UserController from "@/class/user/UserController";
import LoginController from "@/class/login/LoginController";
import NoticeController from "@/class/notice/NoticeController";

import Header from './component/Header'
import Footer from "./component/Footer.jsx";
import Popup from "@/common/component/viewsPopup/Popup.jsx"

let configController,
  popupController,
  userController,
  noticeController,
  loginController;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      init: false
    }
    configController = new ConfigController();
    popupController = new PopupController();
    userController = new UserController();
    noticeController = new NoticeController();
    loginController = new LoginController();

    noticeController.configController = configController;
    noticeController.userController = userController;
    noticeController.popupController = popupController;

    userController.configController = configController;

    loginController.userController = userController;
    loginController.configController = configController;
    loginController.noticeController = noticeController;
    loginController.popupController = popupController;
  }

  componentWillMount() {
  }

  async componentDidMount() {
    configController.setOs(3);
    await configController.getActivityState();
    // await configController.checkVersion();
    this.initApp()
  }

  initApp = () => {
    this.setState({init: true})
  }

  render() {
    return this.state.init && (
        <div className='web-wrap'>
          <div>
            <Header
              navClass={"homeNav"}
              userController={userController}
              noticeController={noticeController}
              configController={configController}
              loginController={loginController}
              popupController={popupController}/>
            <div style={{height: "60px"}}/>
          </div>
          <div
            style={{
              minHeight: `${window.innerHeight - 210}px`,
              width: "100%"
            }}
          >
            {React.cloneElement(this.props.children, {
              configController,
              popupController,
              loginController,
              noticeController,
              userController
            })}
          </div>
          <Footer serviceFlag={this.props.serviceFlag} configController={configController}/>
          <Popup controller={popupController}></Popup>
        </div>
    ) || null;
  }
}

export default Translate(App)