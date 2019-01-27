import React, {Component} from 'react';
import ExchangeViewBase from '@/components/ExchangeViewBase'


import {AsyncAll, Regular} from '@/core'
import { COMMON_RADIO, COMMON_RADIO_GET, USER_RECOMMEND_CN, USER_RECOMMEND_EN } from '@/config/ImageConfig';

export default class VerifyInfo extends ExchangeViewBase {
  constructor(props) {
    super(props);
    this.state={
      verifyList: [ // 两步认证内容
        {
          title: this.intl.get("user-loginVerify"), // 登录验证标题
          flagType: 'loginVerify',
          showNo: true // 是否显示无
        },
        {
          title: this.intl.get("user-cashVerify"), // 提现验证标题
          flagType: 'withdrawVerify',
          showNo: false
        },
        {
          title: this.intl.get("user-fundVerify"), // 修改资金验证标题
          flagType: 'fundPassVerify',
          showNo: false
        }
      ],
      verifyContentList: [
        {
          name: this.intl.get("user-googleVerify"), // 谷歌验证绑定名称
          flag: 2, // 谷歌验证后台返回标识
          imgFlag: true, // 是否显示图片
          checkType: 'googleAuth', // 谷歌验证后台返回字段
          noBindName: this.intl.get("user-googleVerify"), // 谷歌验证未绑定名称
        },
        {
          name: this.intl.get("user-email"), // 邮箱验证绑定名称
          flag: 1, // 邮箱验证后台返回标识
          imgFlag: false, // 是否显示图片
          checkType: 'email', // 邮箱验证后台返回字段
          noBindName: this.intl.get("user-bindEmail") // 邮箱验证未绑定名称
        },
        {
          name: this.intl.get("user-msg"), // 手机验证绑定名称
          flag: 3,  // 手机验证后台返回标识
          imgFlag: false, // 是否显示图片
          checkType: 'phone', // 手机验证后台返回字段
          noBindName: this.intl.get("user-bindPhone") // 手机验证未绑定名称
        },
        {
          name: this.intl.get("none"), // 无验证绑定名称
          flag: 0,  // 无验证后台返回标识
          imgFlag: false, // 是否显示图片
          noBindName: this.intl.get("none") // 无验证未绑定名称
        }
      ]
    }
  }

  render() {
    const {userInfo, selectType} = this.props;
    let language = this.props.controller.configController.language;
    return (
      <div className="verify model-div clearfix">
        <h2>{this.intl.get("twoStep")}</h2>
        <div className="fl">
          <p>{this.intl.get("user-twoVerify")}</p>
          {this.state.verifyList.map((v, i) => (
            <dl className="clearfix" key={i}>
              <dt>{v.title}</dt>
              {this.state.verifyContentList.map((item, index) => (index === 3 && !v.showNo) ? null : (
                <dd key={index}
                    className={language === 'zh-CN' ? '' : 'dd-en'}
                    onClick={content => selectType && selectType(i, v, item)}
                >
                  {item.flag === userInfo[v.flagType] ?
                    <img src={COMMON_RADIO_GET} alt=""/>
                    : <img src={COMMON_RADIO} alt=""/>
                  }
                  <span className={(item.checkType ? userInfo[item.checkType] : true) ? '' : 'no-bind-span'}>
                      {userInfo[item.checkType] ? item.name : item.noBindName}
                    {item.imgFlag && <img
                      src={language === 'zh-CN' ? USER_RECOMMEND_CN : USER_RECOMMEND_EN}
                      className={language === 'zh-CN' ? 'img-cn' : 'img-en'} alt=""/>}
                    </span>
                </dd>)
              )}
            </dl>)
          )}
        </div>
      </div>
    );
  }
}