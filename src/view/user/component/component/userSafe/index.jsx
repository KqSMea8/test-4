import React, {Component} from 'react';
// import {Link} from 'react-router-dom'
import ExchangeViewBase from '@/components/ExchangeViewBase'
// import Button from '@/common/baseComponent/Button'
// import Input from '@/common/baseComponent/Input'
import RemindPopup from '@/common/baseComponent/Popup'
import BasePopup from '@/common/baseComponent/Popup'
import GooglePopup from '../userPopup/GooglePopup.jsx'
import PassPopup from '../userPopup/SetPassPopup.jsx'
import ChangeVerifyPopup from '@/common/component/viewsPopup/TwoVerifyPopup.jsx'
import ModifyGooglePopup from '../userPopup/ModifyGooglePopup.jsx'
import PwdLimitPopup from '../userPopup/PwdLimitPopup.jsx'

import BaseInfo from './component/BaseInfo' // 基本资料
import PassInfo from './component/PassInfo' // 修改密码
import VerifyInfo from './component/VerifyInfo' // 两步验证
import PayInfo from './component/PayInfo' // 支付方式
// import ApplyInfo from './component/ApplyInfo' // 申请OTC店铺
import NoticeInfo from './component/NoticeInfo' // 通知设置
import IpWhiteInfo from './component/IpWhiteInfo' // 获取ip白名单
import DeviceInfo from './component/DeviceInfo' // 退出其他登录
import RecordInfo from './component/RecordInfo' // 最近10条记录
// import TimeInfo from './component/TimeInfo' // 时区

import {AsyncAll} from '@/core'
import { GUANBI_HEI } from '@/config/ImageConfig.js';

export default class UserSafe extends ExchangeViewBase {
  constructor(props) {
    super(props);
    this.state = {
      // timeAddrList: ['1111', '2222', '3333'], // 时区
      showGoogle: false, // 是否显示谷歌验证码弹窗
      showSet: false, // 是否显示设置／绑定弹窗
      showChange: false, // 是否显示两步认证弹窗
      showTimePwdPopup: false, // 修改密码时限弹窗
      modifyGoogle: false, // 修改谷歌验证弹窗
      otherShow: false, // 打开其他安全设置
      type: 0, // 设置密码弹窗所需参数
      changeType: 0, // 更改两步验证弹窗所需参数 根据后台返回确定每种验证对象
      isTwoVerify: 0, // 确认两步验证类型
      sureTwoVerify: 0, // 点击更改验证类型
      timeAddr: '', // 时区
      noticeIndex: 0, // 选择通知设置
      noticeContent: {}, // 选择通知内容
      twoVerifyTitle: {}, // 点击类别
      twoVerifyCon: {}, // 具体点击项
      remindPopup: false, // 公共提示弹窗
      popType: 'tip1', // 公共提示弹窗类型
      popMsg: '验证成功', // 公共提示弹窗内容
      // ipValue: '', // 输入ip内容
      // errIp: '',  // 错误ip显示
      showIp: false, // 当前ip弹窗
      verifyNum: this.intl.get("sendCode"), // 倒计时内容
      ipAddr: "", // 获取当前ip
      setPassFlag: true, // 设置／绑定防连点
      verifyFlag: true, // 两步验证防连点
      bindOrigin: 0, // 判断绑定邮箱／手机来源 0 普通绑定 1 两步验证绑定 2 通知设置绑定
      showFishCode: false, // 是否显示钓鱼码
      errFishCode: "",  // 钓鱼码错误提示
      fishCodeValue: "", // 输入钓鱼码
      errState: '', // 根据错误定位提示
      errCode: '', // 根据错误定位提示
      pwdLimitAfter: 0, // 选择的资金密码时限限制
      noneFlag: false, // 点击为无时提醒
      addPayFlag: true, // 添加收款方式防连点,
      toggleFlag: false // 开启支付方式是否需要弹窗
    };
    const {controller} = props;
    //绑定view
    controller.setView(this);
    //初始化数据，数据来源即store里面的state
    this.state = Object.assign(this.state, controller.initState);

    this.getVerify = controller.getVerify.bind(controller); // 发送短信验证码
    this.setLoginPass = controller.setLoginPass.bind(controller); // 设置登录密码
    this.modifyFundPwd = controller.modifyFundPwd.bind(controller); // 设置修改资金密码
    this.initData = controller.initData.bind(controller); // 获取用户信息
    // this.getUserCreditsNum = controller.getUserCreditsNum.bind(controller); // 获取用户积分数据
    this.getUserAuthData = controller.getUserAuthData.bind(controller); // 获取认证信息
    this.getLoginList = controller.getLoginList.bind(controller); // 获取登录日志
    this.getCurrentLogin = controller.getCurrentLogin.bind(controller); // 获取当前登录设备
    this.getIpList = controller.getIpList.bind(controller); // 获取ip白名单
    // this.addIp = controller.addIp.bind(controller); // 添加ip白名单
    // this.delIp = controller.delIp.bind(controller); // 删除ip白名单
    this.getGoogle = controller.getGoogle.bind(controller); // 获取谷歌密钥
    this.getFundPwdLimit = controller.getFundPwdLimit.bind(controller); // 获取资金密码设置时限
    this.getCaptchaVerify = controller.getCaptchaVerify.bind(controller); // 获取图形验证码
    this.setTwoVerify = controller.setTwoVerify.bind(controller); // 修改两步认证
    this.setPwdLimit = controller.setPwdLimit.bind(controller); // 设置资金密码间隔
    this.setGoogleVerify = controller.setGoogleVerify.bind(controller); // 验证谷歌验证码
    this.bindUser = controller.bindUser.bind(controller); // 绑定邮箱／手机号
    this.otcApplyStore = controller.otcController.otcApplyStore.bind(controller.otcController); // 绑定邮箱／手机号
    // this.outOther = controller.outOther.bind(controller); // 退出其他设备
    this.destroy = controller.clearVerify.bind(controller); // 清除定时器
    this.getPaymentAccounts = controller.getPaymentAccounts.bind(controller); // 获取支付列表
    this.addPayment = controller.addPayment.bind(controller); // 添加支付列表
    this.delPayment = controller.delPayment.bind(controller); // 删除支付列表
    this.updatePayment = controller.updatePayment.bind(controller); // 修改支付列表
    this.setPayment = controller.setPayment.bind(controller); // 开关支付列表
  }

  async componentDidMount() {
    // 请求初始数据
    let result = await AsyncAll([
      this.initData(),
      this.getLoginList(),
      this.getGoogle(),
      this.getUserAuthData(),
      this.getCaptchaVerify(),
      this.getFundPwdLimit(),
      this.getPaymentAccounts()]
    );
    this.setState(Object.assign(this.state, ...result));
    // 统计访问量
    // this.props.sendStatis({
    //   event: 'accountActionsPV', //操作代码
    //   type: 'security', //tab
    // })
  }

  static handlerTwoVerify = { // 未绑定谷歌／手机／邮箱参数
    email: (v, item, i) => ({
      twoVerifyTitle: v, // 点击类别
      twoVerifyCon: item, // 具体点击项
      type: 1, // 确定设置弹窗类型
      bindOrigin: 1, // 设置成功弹窗
      showSet: true,
      isTwoVerify: i, // 点击哪一个行
    }),
    googleAuth: (v, item, i) => ({
      twoVerifyTitle: v, // 点击类别
      twoVerifyCon: item, // 具体点击项
      showGoogle: true,
      isTwoVerify: i, // 点击哪一个行
    }),
    phone: (v, item, i) => ({
      twoVerifyTitle: v, // 点击类别
      twoVerifyCon: item, // 具体点击项
      type: 2, // 确定设置弹窗类型
      bindOrigin: 1, // 设置成功弹窗
      showSet: true,
      isTwoVerify: i, // 点击哪一个行
    })
  };

  changeSetPopup = (type) => { // 设置密码显示
    this.setState({
      showSet: true,
      type: type,
      verifyNum: this.intl.get("sendCode"),
      bindOrigin: 0
    })
  };

  selectType = (i, v, item) => { // 两步认证单选
    // 点击选中不弹任何弹窗
    if(item.flag === this.state.userInfo[v.flagType]){
      return
    }
    // 从无到其他
    if(this.state.userInfo[item.checkType] && (!this.state.userInfo[v.flagType] && item.flag)){
      this.setTwoVerify("", 0, "", 1, item.flag);
      return
    }
    // 点击修改资金密码且没有设置资金密码
    if (i === 2 && this.state.userInfo.fundPwd && this.state.userInfo[item.checkType]) {
      this.setState({
        remindPopup: true,
        popType: 'tip3',
        popMsg: this.intl.get("user-setFundPwd")
      });
      return
    }
    // 从其他到无
    if (item.flag === 0) {
      this.setState({
        noneFlag: true
      });
      return
    }
    // 从对象中取弹窗参数
    let obj = item.checkType && UserSafe.handlerTwoVerify[item.checkType](v, item, i);
    // 点击其他
    if(!(item.checkType && !this.state.userInfo[item.checkType] || false)) {
      obj = { // 两步验证参数
        changeType: this.state.userInfo[v.flagType], //返回状态
        isTwoVerify: i, // 点击哪一个行
        sureTwoVerify: item.flag, //目标
        showChange: true
      }
    }
    this.setState(obj)
  };

  handlerNoneVerify = () => { // 点击两步认证无时确定事件
    this.setState({
      noneFlag: false,
      changeType: this.state.userInfo.loginVerify, //返回状态
      isTwoVerify: 0, // 点击哪一个行
      sureTwoVerify: 0, //目标
      showChange: true
    })
  };



  closeChange = () => { // 关闭两步认证弹窗
    this.setState({
      showChange: false,
      verifyFlag: true
    })
  };

  closeSet = () => { // 关闭设置弹窗
    this.setState({
      showSet: false,
      setPassFlag: true,
      errState: '' // 错误提示清空
    });
    this.getCaptchaVerify()
  };

  clearErrState = () => { // 清空错误码
    this.setState({
      errState: '', // 错误提示清空
      errCode: 0
    })
  };

  changeFishCode = (value) => { // 改变设置钓鱼码选项
    this.setState({fishCodeValue: value});
    this.state.errFishCode && (this.setState({errFishCode: ""}))
  };

  handlerPwdLimit = (item, index) => { // 修改密码时限
    let fundPwdInterval = this.state.fundPwdInterval;
    this.setState({
      showTimePwdPopup: fundPwdInterval !== -1 ? true : false,
      remindPopup: fundPwdInterval !== -1 ? false : true,
      popType: 'tip3',
      popMsg: this.intl.get("user-setFundPwd"),
      pwdLimitAfter: index
    })
  };

  showOther = async () => { // 展示其他内容
    let result = await AsyncAll([this.getIpList(), this.getCurrentLogin()]);
    // 获取数据后进行渲染
    this.setState(Object.assign(this.state, ...result, {otherShow: true}))
  };

  checkFishCode = () => {

  };

  closePopup = () => { // 关闭弹窗
    this.setState({

    })
  };

  setToggleFlag = () => {
    this.setState({
      toggleFlag: true
    })
  }

  render() {
    let language = this.props.controller.configController.language;
    return (
      <div className="safe-content">
        <h1>{this.intl.get("header-security")}</h1>
        <BaseInfo
          userInfo={this.state.userInfo}
          changeSetPopup={this.changeSetPopup}/>
        <PassInfo
          userInfo={this.state.userInfo}
          changeSetPopup={this.changeSetPopup}
          handlerPwdLimit={this.handlerPwdLimit}
          fundPwdInterval={this.state.fundPwdInterval}
          controller={this.props.controller}/>
        <VerifyInfo
          userInfo={this.state.userInfo}
          selectType={this.selectType}
          controller={this.props.controller}/>
        <PayInfo
          history={this.props.history}
          payList={this.state.paymentList}
          userAuth={this.state.userAuth.state}
          userAuthName={this.state.userAuth.fullName}
          controller={this.props.controller}
          addPayment={this.addPayment}
          delPayment={this.delPayment}
          updatePayment={this.updatePayment}
          setPayment={this.setPayment}
          addPayFlag={this.state.addPayFlag}
          setToggleFlag={this.setToggleFlag}
          resetCode={this.clearErrState}
          errCode={this.state.errCode}
          errState={this.state.errState}/>
        {/*<ApplyInfo*/}
          {/*otcApplyStore={this.otcApplyStore}/>*/}
        {!this.state.otherShow && <div className="other model-div">
          <h2>{this.intl.get("user-otherAll")}</h2>
          <span onClick={this.showOther}>{this.intl.get("user-otherAll")}</span>
        </div>}
        <div className={this.state.otherShow ? '' : 'hide'}>
          <NoticeInfo
            controller={this.props.controller}
            userInfo={this.state.userInfo}/>
          <IpWhiteInfo
            ipList={this.state.ipList}
            controller={this.props.controller}/>
          <DeviceInfo
            currentLogin={this.state.currentLogin}
            controller={this.props.controller}/>
        </div>
        <RecordInfo
          loginList={this.state.loginList}
          controller={this.props.controller}/>
        {this.state.showGoogle && <GooglePopup // 绑定google弹窗
          googleSecret={this.state.googleSecret}
          setGoogleVerify={this.setGoogleVerify}
          onClose={() => {
            this.setState({showGoogle: false});
          }}
        />}
        {this.state.modifyGoogle && <ModifyGooglePopup // 修改google弹窗
          googleSecret={this.state.googleSecret}
          phone={this.state.userInfo.phone}
          email={this.state.userInfo.email}
          copy={this.props.controller.copy}
          verifyNum={this.state.verifyNum}
          getVerify={this.getVerify}
          onClose={() => {
            this.setState({modifyGoogle: false});
          }}
        />}
        {this.state.showSet && <PassPopup // 绑定／设置修改弹窗
          onClose={this.closeSet}
          phone={this.state.userInfo.phone}
          email={this.state.userInfo.email}
          isType={this.state.type}
          getVerify={this.getVerify}
          bindUser={this.bindUser}
          setLoginPass={this.setLoginPass}
          errCode={this.state.errCode}
          errState={this.state.errState}
          clearErrState={this.clearErrState}
          modifyFundPwd={this.modifyFundPwd}
          fundPassType={this.state.userInfo.fundPassVerify}
          captcha={this.state.captcha}
          captchaId={this.state.captchaId}
          getCaptcha={this.getCaptchaVerify}
          verifyNum={this.state.verifyNum}
          destroy={this.destroy}
        />}
        {this.state.showChange && <ChangeVerifyPopup // 两步认证弹窗
          resetCode={this.clearErrState}
          errCode={this.state.errCode}
          errState={this.state.errState}
          onClose={this.closeChange}
          type={this.state.changeType}
          getVerify={() => {
            this.getVerify(
              this.state.changeType === 3 ? this.state.userInfo.phone : (this.state.changeType === 1 ? this.state.userInfo.email : ''),
              this.state.changeType === 3 ? 0 : (this.state.changeType === 1 ? 1 : ''),
              9
            )
          }}
          verifyNum={this.state.verifyNum}
          destroy={this.destroy}
          onConfirm={code => {
            this.setTwoVerify(
              this.state.changeType === 3 ? this.state.userInfo.phone : (this.state.changeType === 1 ? this.state.userInfo.email : ''),
              this.state.changeType === 3 ? 0 : this.state.changeType,
              code,
              this.state.isTwoVerify + 1,
              this.state.sureTwoVerify
            )
          }}
        />}
        {this.state.remindPopup && <RemindPopup // 公共弹窗
          type={this.state.popType}
          msg={this.state.popMsg}
          autoClose={true}
          onClose={() => {
            this.setState({remindPopup: false});
          }}
        />}
        {this.state.showIp && ( // 查看Ip弹窗
          <div className="ip-popup-wrap">
            <div className="ip-popup">
              <img src={GUANBI_HEI} onClick={() => {
                this.setState({showIp: false});
              }}/>
              <p>{this.state.ipAddr}</p>
            </div>
          </div>)
        }
        {this.state.showTimePwdPopup && <PwdLimitPopup // 修改资金密码时限弹窗
          resetCode={this.clearErrState}
          errCode={this.state.errCode}
          errState={this.state.errState}
          onClose={() => {
            this.setState({showTimePwdPopup: false, errCode: 0});
          }}
          onConfirm={code => {
            this.setPwdLimit(this.state.pwdLimitAfter, code)
          }}
        />}
        {this.state.noneFlag && <BasePopup // 从有切换到无
          type="confirm"
          msg={this.intl.get('user-changeVerify')}
          onClose={() => {this.setState({noneFlag: false})}}
          onConfirm={this.handlerNoneVerify}
        />}
      </div>
    );
  }
}