import React, { Component } from "react";
import Login from './component/Passport'

import ActivityController from "@/class/activity/ActivityController";

let configController,
    userController,
    loginController,
    noticeController,
    activityController,
    popupController;

export default class PassportCon extends Component {
  constructor(props) {
    super(props);
    configController = props.configController;
    userController = props.userController;
    loginController = props.loginController;
    noticeController = props.noticeController;
    popupController = props.popupController;
    activityController = new ActivityController();

    loginController.activityController = activityController;

    userController.activityController = activityController;
    
    activityController.configController = configController;
    activityController.userController = userController;
  }

  
  render() {
    return (
        <Login
            controller={loginController}
        />
    );
  }
}
