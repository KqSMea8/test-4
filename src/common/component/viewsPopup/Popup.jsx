import React from "react";

import ExchangeViewBase from "@/components/ExchangeViewBase";
import BasePopup from "@/common/baseComponent/Popup/index";
import ConnectPopup from "../ConnectPopup/index";
import MessageTip from "../MessageTip"
/*
  title 标题 type为tip1、tip2、tip3、tip4时不生效
  type  默认或不在选择范围内时为default(消息提示), 可选base(基础),confirm(确认消息),custom(自定义),tip1、tip2、tip3、tip4(带有倾向性成功，警告，错误，信息),
  onConfirm 确定事件的 handler
  closeButton 布尔值，是否显示关闭按钮，默认false
  autoClose 是否自动关闭（3s）自动关闭是调用onClose，无onClose时不生效
  msg 提示文案
  className 自定义类名
  h5 布尔值，是否移动端(移动端仅支持tip1和tip3)
  icon 默认succeed 可选warning,wrong,message, type为
  confirmText 确认按钮文案
  cancelText 取消按钮文案
  connecting 显示连接中的弹窗
*/

export default class Popup extends ExchangeViewBase {
  constructor(props) {
    super(props);
    const { controller } = props;
    //绑定view
    controller.setView(this);
    this.state = {
      isShow: false,
      title: "",
      type: "tip1",
      onClose: "",
      onConfirm: "",
      closeButton: false,
      autoClose: false,
      msg: "",
      className: "",
      h5: props.h5,
      icon: "succeed",
      connecting: false,
      confirmText: '',
      cancelText: '',

      // 消息提示弹窗
      isShowTip: false,
      onCloseTip: ''
    };
    this.init = () => {
      this.setState({
        isShow: false,
        title: "",
        type: "tip1",
        onClose: "",
        onConfirm: "",
        closeButton: false,
        autoClose: false,
        msg: "",
        className: "",
        h5: props.h5,
        icon: "succeed",
        connecting: false,
        confirmText: '',
        cancelText: ''
      });
    };
  }
  onClose=()=>{
    this.state.onClose && this.state.onClose()
    this.setState({
      isShow: false,
      connecting: false
    });
  }

  onCloseTip=()=>{
    this.state.onCloseTip && this.state.onCloseTip();
    this.setState({
      isShowTip: false
    });
  }


  componentWillUnmount() {
    this.props.destroy && this.props.destroy();
  }
  render() {
    let {
      isShow,
      title,
      type,
      onConfirm,
      closeButton,
      autoClose,
      msg,
      className,
      h5,
      icon,
      connecting,
      confirmText,
      cancelText
    } = this.state;
    return <div>
        {!connecting ? (
        <div>
          {isShow && (
            <BasePopup
              title={title}
              type={type}
              onClose={this.onClose}
              onConfirm={onConfirm}
              closeButton={closeButton}
              autoClose={autoClose}
              msg={msg}
              className={className}
              h5={h5}
              icon={icon}
              destroy={this.init}
              confirmText={confirmText}
              cancelText={cancelText}
            />
          )}
        </div>
      ) : (
        <ConnectPopup onClose={this.onClose} destroy={this.init} theme={window.location.href.includes('/trade') ? 'black' : ''}/>
      )}
      <MessageTip show={this.state.isShowTip} onClose={this.onCloseTip}/>
    </div>
  }
}
