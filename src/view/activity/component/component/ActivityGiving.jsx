import React, {Component} from 'react';
import intl from "react-intl-universal";
import "../style/activityGiving.styl"
import Popup from '@/common/baseComponent/Popup/index.jsx'
import {
  ACT_REG_SERVIVE,
  ACT_REG_TELEGRAM,
  ACTIVTY_GIVING_BG,
  ACT_REG_CH,
  ACT_REG_EN
} from '@/config/ImageConfig';

import {
  goUserPath,
  goRegisterPath,
  getQueryFromPath
} from "@/config/UrlConfig"

export default class ActivityGiving extends Component {
  constructor(props) {
    super(props);
    this.intl = intl;
    this.state = {
      ruleList: [
        `1.${this.intl.get('activity-rule-1')}`,
        `2.${this.intl.get('activity-rule-2')}`,
        `3.${this.intl.get('activity-rule-3')}`,
        `4.${this.intl.get('activity-rule-4')}`,
        `5.${this.intl.get('activity-rule-5')}`,
        `6.${this.intl.get('activity-rule-6')}`,
      ],
      address:'',
      bannerImgUrl: '',
      popType: "tip1",
      popMsg: this.intl.get("activity-reg-have"),
      showPopup: false,
      quid: getQueryFromPath('in') ? getQueryFromPath('in') : getQueryFromPath('uid')
    }
  }

  async componentDidMount() {
    this.props.sendStatis({
      event: 'activityPV',//操作代码
      type: 'activity',//tab
    })
  }

  inviteNowHandle = () => {
    let userToken = this.props.controller.userController.userToken;
    if(userToken){
      goUserPath('/invite');
      return;
    }
    goRegisterPath('', {in: this.state.quid})
  };

  renderWechart = () => {
    return <div className='activity-giving-rule-content-weChart'>
      <img src={ACT_REG_SERVIVE} alt=""/>
      <p>{this.intl.get('activity-reg-service-name')} {this.intl.get('activity-reg-service')}</p>
    </div>
  };

  renderTelegram = () => {
    return <div className='activity-giving-rule-content-telegram'>
      <img src={ACT_REG_TELEGRAM} alt=""/>
      <p>{this.intl.get('activity-reg-service-name')}</p>
      <p>{this.intl.get('activity-reg-service')}</p>
    </div>
  };

  renderService = (language) => {
    if(language === 'en-US'){
      return this.renderTelegram()
    }
    return this.renderWechart()
  };

  render() {
    const {controller} = this.props;
    let language = controller.configData.language,
        userToken = this.props.controller.userController.userToken;
    return (
        <div className="active-giving">
          <div className="activity-giving-container" >
            <div className="activity-giving-banner" >
              <img src={language === 'en-US' ? ACT_REG_EN : ACT_REG_CH} alt=""/>
            </div>
            {!userToken && <div className="activity-giving-gift">
              <h2>{this.intl.get('activity-dou-gift-title')}</h2>
              <p>{this.intl.getHTML('activity-reg-gift')}</p>
              <button onClick={this.inviteNowHandle}>{this.intl.get('activity-regist')}</button>
            </div>}
            <div className="activity-giving-invite">
              <h2>{this.intl.get('activity-invite-award2')}</h2>
              <p>{this.intl.getHTML('activity-invite-award-web')}</p>
              <button onClick={this.inviteNowHandle}>{this.intl.get('activity-invite-now')}</button>
            </div>
            <div className='activity-giving-rule'>
              <h2>{this.intl.get('activity-reg-rule-title')}</h2>
              <div className='activity-giving-rule-content'>
                <div className='activity-giving-rule-content-container clearfix'>
                  <div className='activity-giving-rule-content-rule'>
                    <p>1、{this.intl.get('activity-reg-rule1')}</p>
                    <p>2、{this.intl.get('activity-reg-rule2')}</p>
                    <p>3、{this.intl.get('activity-reg-rule3')}</p>
                    <p>4、{this.intl.get('activity-reg-rule4')}</p>
                    <p>5、{this.intl.get('activity-reg-rule6')}</p>
                  </div>
                  {this.renderService(language)}
                </div>
              </div>
            </div>
          </div>
          {this.state.showPopup && (
            <Popup
              type={this.state.popType}
              msg={this.state.popMsg}
              onClose={() => {
                this.setState({showPopup: false});
              }}
              autoClose={true}
            />
          )}
        </div>
    );
  }
}
