import React, { Component } from "react";
import Notification from './component/Notification'

let noticeController;

export default class NotificationCon extends Component {
  constructor(props) {
    super(props);

    noticeController = props.noticeController;
  }

  render() {
    return (
      <Notification
        controller={noticeController}
      />
    );
  }
}
