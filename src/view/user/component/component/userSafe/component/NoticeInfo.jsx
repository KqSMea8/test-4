import React, {Component} from 'react';
import ExchangeViewBase from '@/components/ExchangeViewBase'

import {AsyncAll, Regular} from '@/core'
import { COMMON_RADIO_GET, COMMON_RADIO } from '@/config/ImageConfig';

export default class NoticeInfo extends ExchangeViewBase {
  constructor(props) {
    super(props);
    this.state = {
      noticeList: [ // 通知内容
        {
          name: this.intl.get("user-noticeEmail"), // 邮箱绑定名称
          flag: 1,  // 邮箱通知后台返回标识
          noBindName: this.intl.get("user-bindEmail"), // 邮箱未绑定名称
          checkType: 'email' // 通知类型邮箱后台返回字段
        },
        {
          name: this.intl.get("user-noticePhone"), // 手机绑定名称
          flag: 0, // 手机通知后台返回标识
          noBindName: this.intl.get("user-bindPhone"), // 手机未绑定名称
          checkType: 'phone' // 通知类型手机后台返回字段
        }
      ],
    };
    this.setUserNotify = this.props.controller.setUserNotify.bind(this.props.controller); //  修改通知方式
  }

  render() {
    const {userInfo, controller} = this.props;
    let language = controller.configController.language;
    return (
      <div className="notify model-div clearfix">
        <h2>{this.intl.get("user-noticeSet")}</h2>
        <div className="fl">
          <ul className={`${language === 'zh-CN' ? '' : 'en-ul'} clearfix`}>
            <li>{this.intl.get("user-noticeRemind")}</li>
            <li className="select-notify">
              {this.state.noticeList.map((value, index) => (
                <span key={index} onClick={content => this.setUserNotify(value, index)}>
                      {value.flag === userInfo.notifyMethod ?
                        <img src={COMMON_RADIO_GET} alt=""/> :
                        <img src={COMMON_RADIO} alt=""/>}
                  <b className={userInfo[value.checkType] ? '' : 'no-bind-b'}>{userInfo[value.checkType] ? value.name : value.noBindName}</b>
                </span>)
              )}
            </li>
          </ul>
          {/*{this.state.noticeIndex === 0 && <ol className="fish-code clearfix">*/}
          {/*<li>防钓鱼码</li>*/}
          {/*{!this.state.showFishCode && <li className="open-li" onClick={() => {this.setState({showFishCode: !this.state.showFishCode})}}>*/}
          {/*<img src={this.$imagesMap.$common_radio} alt=""/>*/}
          {/*<span>开启</span>*/}
          {/*</li>}*/}
          {/*</ol>}*/}
          {/*{this.state.showFishCode && <div className="fish-code-set clearfix">*/}
          {/*<Input value={this.state.fishCodeValue}*/}
          {/*onInput={value => this.changeFishCode(value)}*/}
          {/*onBlur={this.checkFishCode}/>*/}
          {/*<Button className="ok-btn" title={this.intl.get("ok")}/>*/}
          {/*<Button className="cancel-btn" title={this.intl.get("cance")} onClick={() => {*/}
          {/*this.setState({showFishCode: false});*/}
          {/*}}/>*/}
          {/*</div>}*/}
        </div>
      </div>
    );
  }
}