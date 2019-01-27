import React, { Component } from "react";
import Login from './component/Login'
import ActivityController from "@/class/activity/ActivityController";

let configController,
    userController,
    loginController,
    noticeController,
    activityController,
    popupController;

export default class LoginCon extends Component {
  constructor(props) {
    super(props);
    
    configController = props.configController;
    popupController = props.popupController;
    userController = props.userController;
    loginController = props.loginController;
    noticeController = props.noticeController;
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
