import React, { Component } from "react";
import User from './component/User'
import ActivityController from "@/class/activity/ActivityController";
import OtcController from "@/class/otc/OtcController";

let configController,
    userController,
    activityController,
    otcController,
    popupController;

export default class UserCon extends Component {
  constructor(props) {
    super(props);
    
    configController = props.configController;
    userController = props.userController;
    popupController = props.popupController;
    activityController = new ActivityController();
    otcController = new OtcController();

    userController.activityController = activityController;
    userController.otcController = otcController;
    userController.popupController = popupController;

    otcController.userController = userController;

    activityController.configController = configController;
    activityController.userController = userController;
  }

  
  render() {
    return (
        <User
            controller={userController}
        />
    );
  }
}
