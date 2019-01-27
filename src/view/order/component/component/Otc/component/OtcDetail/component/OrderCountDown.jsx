import ExchangeViewBase from '@/components/ExchangeViewBase'
import React, {Component} from "react";
import PropTypes from "prop-types";
import Sleep from '@/core/libs/Sleep'

export default class OrderCountDown extends ExchangeViewBase{
  static defaultProps = {
    // time: new Date().getTime() + 10 * 60 * 1000,
    loopKey: 'otcOrderCountDown'
  };
  static propTypes = {
    // time: PropTypes.number.isRequired
  }
  constructor(){
    super();
    this.state = {
      minute: 0,
      second: 0
    };
    this.destoryFlag = false;
  }
  componentDidMount(){
    const time = this.props.time;
    this.countDown(time)
  }
  componentWillUnmount(){
    this.destoryFlag = true;
  }
  async countDown(time) {
    let sys_second = Number(time * 1000) - new Date().getTime();
    while(1) {
      if(sys_second < 1000 || this.destoryFlag){
        break;
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
        <span style={{fontSize: '14px'}}>
          {this.destoryFlag ? '' : `${this.state.minute}:${this.state.second}`}
        </span>
    )
  }
}