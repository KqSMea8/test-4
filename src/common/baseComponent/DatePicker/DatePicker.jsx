/*
  onChangeStart 绑定获取开始时间
  onChangeEnd 绑定获取结束时间
  startTime 开始时间
  endTime 结束时间
 */

import React, { Component } from "react";
import Calendar from "../Calendar/Calendar.jsx"

export default class DateInterval extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: 0,
      endTime: 0,
      showOtherNum: 0
    };
  }

  seletTimeStart(state) {
    let startTime = new Date(state + ' 00:00:00').getTime()
    this.setState({
      startTime: startTime
    });
    // console.log(new Date(startTime))
    this.props.onChangeStart(startTime)
  }
  seletTimeEnd(state) {
    let endTime = new Date(state + ' 00:00:00').getTime()
    this.setState({
      endTime: endTime
    });
    // console.log(new Date(endTime + 86399000))
    this.props.onChangeEnd(endTime + 86399000)
  }
  render() {
    return (
      <div className="date-interval clearfix">
        <div className="start-time fl">
          <Calendar onChange={(state) => this.seletTimeStart(state)} endTime={this.props.endTime ? this.props.endTime * 1000 : this.state.endTime} startInputTime={this.props.startTime}/>
        </div>
        <div className="end-time fl">
          <Calendar onChange={(state) =>{this.seletTimeEnd(state)}} startTime={this.props.startTime ? this.props.startTime * 1000 : this.state.startTime} endInputTime={this.props.endTime}/>
        </div>
      </div>
    );
  }
}
