import React, { Component } from "react";
import Register from './component/Register'
import ActivityController from "@/class/activity/ActivityController";

let configController,
    userController,
    loginController,
    noticeController,
    activityController,
    popupController;

export default class RegisterCon extends Component {
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
        <Register
            controller={loginController}
        />
    );
  }
}
