import React, { Component } from "react";
import Activity from './component/Activity'
import ActivityController from "@/class/activity/ActivityController";

let configController,
    userController,
    activityController;

export default class ActivityCon extends Component {
  constructor(props) {
    super(props);

    activityController = new ActivityController();
    configController = props.configController;
    userController = props.userController;

    activityController.configController = configController;
    activityController.userController = userController;
  }

  
  render() {
    return (
        <Activity
            controller={activityController}
        />
    );
  }
}
