import React, { Component } from "react";
import UserNotice from './component/Message'

let noticeController;

export default class UserNoticeCon extends Component {
  constructor(props) {
    super(props);

    noticeController = props.noticeController;
  }


  render() {
    return (
      <UserNotice
        controller={noticeController}
      />
    );
  }
}
