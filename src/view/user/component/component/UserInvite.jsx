import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import ExchangeViewBase from '@/components/ExchangeViewBase'
// import "../stylus/activityFresh.styl"
import Button from "@/common/baseComponent/Button";
import Popup from "@/common/baseComponent/Popup";
// import QRCode from "qrcode-react"
import QRCode from "@/common/component/QRcodeCreater";
import Pagination from '@/common/baseComponent/Pagination/index.jsx'
import {AsyncAll} from "@/core";
// import ServerConfig from "@/config/ServerConfig";
import {
  COMMON_NOTHING_WHITE,
  POST_BG_ZH,
  POST_BG_EN,
  POST_LOGO } from '@/config/ImageConfig';


// const ruleList = [
//   '3. 同一认证用户，只可参与一次免手续费活动',
//   '4. 如果已完成实名认证，并在活动期内的新用户，但是仍然扣除交易手续费，请您联系客服',
//   '5. 活动到期结束后，交易手续费请参照网站公布费率标准，若有调整，以网站公告为准。',
//   '6. 一经发现作弊行为，QB有权收回给您的奖励，并对账号进行相应处理',
//   '7. 该活动最终解释权规QB所有'
// ]

export default class UserInvite extends ExchangeViewBase {
  constructor(props) {
    super(props);
    this.state = {
      showPopup: false,
      page: 1,
      poster: '',
      showPoster: false,
      inviteCode: '',
      imgFlag: false,
      popupType: 'tip1'
    }
    const {controller} = props
    // 绑定view
    controller.setView(this)
    // 初始化数据，数据来源即store里面的state
    this.state = Object.assign(this.state, controller.initState);
    this.getInvited = controller.getInvited.bind(controller);
    this.getInviteCode = controller.getInviteCode.bind(controller);
    this.sendStatis = controller.configController.sendStatis.bind(controller.configController)
  }


  async componentDidMount() {
    // this.props.sendStatis({
    //   event: 'activityPV',//操作代码
    //   type: 'activity',//tab
    // })
    await AsyncAll([this.getInvited(), this.getInviteCode()])

  }

  getPoster = ()=>{ // 分享海报
    this.sendStatis({
      event: 'activityClick',//操作代码
      type: 'Activity_C_Poster_Web',//tab
    });
    if(this.state.poster) {
      this.setState({
        showPoster: true
      });
      return
    }
    if(!this.state.inviteCode) {
      this.setState({
        showPopup: true,
        popupType: 'tip3',
        copySuccess: this.intl.get("code-error"),
      });
      return
    }
    let canvas = document.querySelector('#webInvite-poster'),
        // image = document.querySelector('.poster'),
        code = document.querySelector('.qrcode').querySelector('canvas'),
        ctx = canvas.getContext('2d'),
        lang = this.props.controller.configController.language,
        postBg = this.props.controller.configController.language === 'zh-CN' ? POST_BG_ZH : POST_BG_EN;
    const image = new Image();
    fetch(postBg, {
      // mode: 'cors',
      // headers: {
      //   "Content-Type": "application/json",
      // },
    }).then(response=>response.blob()).then(myBlob=> {
      let objectURL = URL.createObjectURL(myBlob);
      image.onload = () => {
        ctx.drawImage(image, 0, 0);
        const activityState = this.props.controller.configController.activityState;
        lang=== 'zh-CN' && ctx.drawImage(code, 205, 750, 165, 165);
        lang=== 'en-US' && ctx.drawImage(code, 207, 752, 165, 165);
        let src = canvas.toDataURL();
        this.setState({
          poster: src,
          showPoster: true,
          succPopup: false
        })
      };
      image.src =objectURL
    })
  };

  copy = el => { // 复制链接
    this.sendStatis({
      event: 'activityClick',//操作代码
      type: 'Activity_C_Link_Web',//tab
    });
    if(!this.state.inviteCode) {
      this.setState({
        showPopup: true,
        popupType: 'tip3',
        copySuccess: this.intl.get("code-error"),
      });
      return
    }
    let link = this.shareLink();
    el.value = `${link} ${el.value}`;
    this.setState({
      showPopup: true,
      popupType: this.props.controller.copy(el) ? 'tip1' : 'tip3',
      copySuccess: this.props.controller.copy(el) ? this.intl.get("user-copySuccess") : this.intl.get("asset-option-failed")
    });
  };

  shareLink = () => { // 根据活动开关确定分享链接内容
    let linkList = {
      qe: this.intl.get("user-activity-invite"),
      sd: this.intl.get("user-activity-invite-11")
    };
    let link = '';
    for (let key in this.props.controller.configController.activityState) {
      if (this.props.controller.configController.activityState[key] === 1) {
        link = linkList[key];
        break;
      }
    }
    return link
  };

  render() {
    // const questionList = [
    //   '您对本次活动有任何疑问，请与我们取得联系咨询：',
    //   `客服电话：${this.props.controller.configData.servicePhone}`,
    //   `客服QQ：${this.props.controller.configData.serviceQQ}`
    // ]
    const {controller} = this.props;
    let coin = this.props.controller.configController.nameCny;
    const activityState = this.props.controller.configController.activityState;
    return (
      <div className="user-invite-wrap">
        <h1>{this.intl.get("user-invite")}</h1>
        <div className="clearfix invite-link">
          <h2>{this.intl.get("user-inviteLind")}</h2>
          <div className="fl">
            <input
              type="text"
              ref="address"
              value={controller.shareAddress(this.state.inviteCode)}
              readOnly="readonly"
              className={`active-clip-input-active`}
            />
            <Button
              className="poster-btn"
              title={this.intl.get("createPoster")}
              type="base"
              onClick={this.getPoster}
            />
            <Button
              className="copy-btn"
              title={this.intl.get("copyLink")}
              type="base"
              onClick={() => {
                this.copy(this.refs.address);
              }}
            />
          </div>
        </div>
        <div className="clearfix invite-info">
          <h2>{this.intl.get("user-inviteInfo")}</h2>
          <div className="fl">
            <p>
              <span>{this.intl.get("user-inviteGetCoin")}</span>
              <b>{this.state.inviteNum}</b>
            </p>
            <p>
              <span>{this.intl.get("user-inviteNum")}</span>
              <b>{this.state.countAll}{this.intl.get('user-inviteUnit')}</b>
            </p>
          </div>
        </div>
        <div className="clearfix invit-record">
          <h2>{this.intl.get("user-inviteRecord")}</h2>
          <div className="table-con">
            <table>
              <thead>
              <tr>
                <th>{this.intl.get("user-inviteAccount")}</th>
                <th>{this.intl.get("user-inviteTime")}</th>
                <th>{this.intl.get("user-inviteGet")}</th>
                {/*<th>{this.intl.get("user-name")}</th>*/}
              </tr>
              </thead>
              <tbody>
              {this.state.list && this.state.list.length ? this.state.list.map((v, index) => (
                <tr key={index}>
                  <td>{v.inviterAccount}</td>
                  <td>{v.time.toDate('yyyy-MM-dd HH:mm:ss')}</td>
                  <td>{v.addCount}{coin}</td>
                  {/*<td>{v.verify ? this.intl.get("yes") : this.intl.get("no")}</td>*/}
                </tr>)) : (<tr className="nothing-tr">
                  <td colSpan="3">
                    <img src={COMMON_NOTHING_WHITE} alt=""/>
                    <p>{this.intl.get('user-none')}</p>
                  </td>
              </tr>)}
              </tbody>
            </table>
          </div>
          {this.state.countAll && <Pagination total={this.state.countAll || 0}
                                              pageSize={10}
                                              showTotal={true}
                                              onChange={page => {
                                                this.setState({page});
                                                this.getInvited(page)
                                              }}
                                              currentPage={this.state.page}
                                              showQuickJumper={true}/> || null}
        </div>
        {this.state.showPopup && (
          <Popup
            type={this.state.popupType}
            msg={this.state.copySuccess}
            onClose={() => {
              this.setState({showPopup: false});
            }}
            autoClose={true}
          />
        )}
        <div style={{display: 'none'}}>
          {/*<img className='poster' src={((activityState.qe && this.poster_bg_1) || ( activityState.sd && this.poster_bg_2))}/>*/}
          {/*<img className='poster' src={POST_BG} onLoad={this.loadImg} crossOrigin="anonymous"/>*/}
          <div className="qrcode">
          {this.state.inviteCode &&
            <QRCode value={controller.shareAddress(this.state.inviteCode)}
                    size={400}
                    logo={POST_LOGO}/>}
          </div>
          <canvas id="webInvite-poster" width="578" height="1026" ></canvas>
        </div>
        {
          this.state.showPoster && <div className="post-wrap" onClick={()=>{this.setState({showPoster: false})}}>
            <img src={this.state.poster} crossOrigin="anonymous" alt="" onClick={(e)=>{e.stopPropagation()}}/>
          </div>
        }
      </div>
    );
  }
}
