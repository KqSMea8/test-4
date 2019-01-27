import React, {Component} from 'react';
import ExchangeViewBase from '@/components/ExchangeViewBase'

import Input from '@/common/baseComponent/Input'
import Button from '@/common/baseComponent/Button'

import {AsyncAll, Regular} from '@/core'

export default class BaseInfo extends ExchangeViewBase {
  constructor(props) {
    super(props);
    this.state={
      ipValue: '', // 输入ip内容
      errIp: '',  // 错误ip显示
    };
    const {controller} = props;
    this.getIPAddr = controller.getIPAddr.bind(controller); // 获取当前ip
    this.addIp = controller.addIp.bind(controller); // 添加ip白名单
    this.delIp = controller.delIp.bind(controller); // 删除ip白名单
  }

  ipInput(value) { // 输入白名单
    this.setState({
      ipValue: value
    });
    this.state.errIp && (this.setState({errIp: ""}))
  }

  checkIp = () => { // 校验Ip
    let reg = Regular('regIp', this.state.ipValue);
    if (!reg) {
      this.setState({
        errIp: this.intl.get("user-errIp")
      })
    }
  };

  render() {
    const {ipList} = this.props;
    return (
      <div className="name-list model-div clearfix">
        <h2>{this.intl.get("user-ipWhite")}</h2>
        <div className="fl">
          <p>
            {this.intl.get("user-ipAddRemind")}
            <em onClick={this.getIPAddr} className="ip-show">{this.intl.get("user-ipAddRemind3")}</em>
            {this.intl.get("user-ipAddRemind2")}
          </p>
          <b>{this.intl.get("user-ipRemind")}</b>
          <div className="add-div clearfix">
            <div className="input-wrap err-parent">
              <input style={{position: 'absolute', "zIndex": -10}} />
              <Input
                placeholder={this.intl.get("user-ipAddr")}
                onInput={value => {this.ipInput(value)}}
                onBlur={this.checkIp}/>
              {this.state.ipValue && this.state.errIp && <em className="err-children">{this.state.ipValue && this.state.errIp}</em>}
            </div>
            <Button title={this.intl.get("add")}
                    className={`${this.state.ipValue ? 'name-btn-active' : ''} name-btn`}
                    onClick={() => this.state.ipValue && !this.state.errIp && this.addIp(this.state.ipValue)}/>
          </div>
          <span>{this.intl.get("user-ipExample")}</span>
          <table>
            <thead>
            <tr>
              <th>{this.intl.get("user-ipAddr")}</th>
              <th>{this.intl.get("addTime")}</th>
              <th>{this.intl.get("action")}</th>
            </tr>
            </thead>
            <tbody>
            {ipList && ipList.length ? ipList.map((v, index) => (
              <tr key={index}>
                <td>{v.IPAddress}</td>
                <td>{v.createAt && v.createAt.toDate('yyyy-MM-dd')}</td>
                <td onClick={() => this.delIp(v.IPId, v.IPAddress, index)} className="delIp">{this.intl.get("delete")}</td>
              </tr>)) : (<tr className="nothing-text">
              <td colSpan="3">{this.intl.get('user-none')}</td>
            </tr>)
            }
            </tbody>
          </table>
        </div>

      </div>
    );
  }
}