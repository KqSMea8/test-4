import ExchangeViewBase from '@/components/ExchangeViewBase'
import React, {Component} from "react";
import PropTypes from "prop-types";
import Sleep from '@/core/libs/Sleep'

export default class OrderCountDown extends ExchangeViewBase{
  static defaultProps = {
    time: 600,
    loopKey: 'otcOrderCountDown'
  };
  static propTypes = {
    time: PropTypes.number.isRequired
  }
  constructor(){
    super();
    this.state = {
      minute: 0,
      second: 0,
      destoryFlag: false
    };
    this.destoryFlag = false;
  }
  componentDidMount(){
    const time = this.props.time;
    this.countDown(time)
  }
  componentWillUnmount(){
    this.setState({
      destoryFlag: true
    })
    this.destoryFlag = true;
  }
  async countDown(time) {
    let sys_second = time * 1000;
    if(sys_second < 1000){
      this.setState({
        destoryFlag: true
      })
      return
    }
    while(1) {
      if(sys_second < 1000 || this.destoryFlag){
        !this.destoryFlag && this.props.delayHandler && this.props.delayHandler();
        this.setState({
          destoryFlag: true
        })
        break;
      }
      if(sys_second <= 1000 * 60 && sys_second > 1000 * 59){
        this.props.countPopHandler && this.props.countPopHandler();
      }
      sys_second -= 1000;
      let minute = Math.floor((sys_second / 1000 / 60) % 60);
      if(minute < 10){
        minute = `0${minute}`
      }
      let second = Math.floor(sys_second / 1000 % 60);
      if(second < 10){
        second = `0${second}`
      }
      this.destoryFlag || this.setState({
        minute,
        second
      });
      await Sleep(1000);
    }
    
  }
  render(){
    return(
        <span>
          {this.state.destoryFlag ? '-' : `${this.state.minute}:${this.state.second}`}
        </span>
    )
  }
}