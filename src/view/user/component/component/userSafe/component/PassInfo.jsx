import React, {Component} from 'react';
import ExchangeViewBase from '@/components/ExchangeViewBase'
import { COMMON_RADIO_GET, COMMON_RADIO } from '@/config/ImageConfig';


export default class PassInfo extends ExchangeViewBase {
  constructor(props) {
    super(props);
    this.state = {
      timeLimitArr: [ // 密码时限设置数组 flag为后台返回标识字段
        {name: this.intl.get("user-deal-every"), flag: 0},
        {name: this.intl.get("user-deal-2h"), flag: 1},
        {name: this.intl.get("user-deal-never"), flag: 2}
      ],
    }
  }

  render() {
    const {userInfo, fundPwdInterval, changeSetPopup, handlerPwdLimit} = this.props;
    let language = this.props.controller.configController.language;
    return (
      <div className="change-pass model-div clearfix">
        <h2>{this.intl.get("user-changePwd")}</h2>
        <div className="fl">
          <ol className="clearfix">
            <li>{this.intl.get("loginPwd")}</li>
            <li
              onClick={state => userInfo.loginPwd ? changeSetPopup && changeSetPopup(3) : changeSetPopup && changeSetPopup(4)}>{userInfo.loginPwd === 0 ? this.intl.get("alter") : this.intl.get("set")}</li>
          </ol>
          <ul className="clearfix">
            <li>{this.intl.get("fundPass")}</li>
            <li
              onClick={state => userInfo.fundPwd ? changeSetPopup && changeSetPopup(5) : changeSetPopup && changeSetPopup(6)}>{userInfo.fundPwd === 0 ? this.intl.get("alter") : this.intl.get("set")}</li>
            <li>{this.intl.get("user-setFund")}</li>
          </ul>
          <dl className="clearfix">
            <dt>{this.intl.get("user-passLimit")}</dt>
            {this.state.timeLimitArr.map((item, index) => (
              <dd key={index}
                  className={`${language === 'zh-CN' ? '' : 'en-set-dd'}`}
                  onClick={content => handlerPwdLimit && handlerPwdLimit(item, index)}
              >
                {item.flag === fundPwdInterval ? <img src={COMMON_RADIO_GET} alt=""/> :
                  <img src={COMMON_RADIO} alt=""/>}
                <span>{item.name}</span>
              </dd>)
            )}
          </dl>
        </div>
      </div>
    );
  }
}