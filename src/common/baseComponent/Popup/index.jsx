import React, { Component } from "react";
import exchangeViewBase from "../../../components/ExchangeViewBase";
import Button from "../Button/index";
import {SUCCEED, WARNING, WRONG, MESSAGE, H5_TIP_SUCCESS, H5_TIP_FAIL, GUANBI_HEI}from "@/config/ImageConfig";
import PropTypes from "prop-types"
/*
  title 标题 type为tip1、tip2、tip3、tip4时不生效
  type  默认或不在选择范围内时为default(消息提示), 可选base(基础),confirm(确认消息),custom(自定义),tip1、tip2、tip3、tip4(带有倾向性成功，警告，错误，信息),
  onClose 关闭事件的handler
  onConfirm 确定事件的 handler
  closeButton 布尔值，是否显示关闭按钮，默认false
  autoClose 是否自动关闭（3s）自动关闭是调用onClose，无onClose时不生效
  msg 提示文案
  className 自定义类名
  h5 布尔值，是否移动端(移动端仅支持tip1和tip3)
  icon 默认succeed 可选warning,wrong,message, type为
  destroy 组件销毁时的操作
  confirmText 确认按钮文案
  cancelText 取消按钮文案
  cancelFlag 取消标志
  onCancel 取消事件
  clickOutSide 点击其他区域触发onclose开关
*/

export default class Popup extends exchangeViewBase {
  static defaultProps = {
    clickOutSide: true
  }
  constructor(props) {
    super(props);
    this.timer = null;
    this.onClose = props.onClose;
    this.iconArr = {
      succeed: SUCCEED,
      warning: WARNING,
      wrong: WRONG,
      message: MESSAGE
    };
  }
  componentDidMount() {
    clearTimeout(this.timer);
    let { autoClose,clickOutSide } = this.props;
    clickOutSide && document.addEventListener("click", this.onClose);
    if (!autoClose) return;
    this.timer = setTimeout(this.onClose, 2000);
  }
  componentWillUnmount() {
    this.props.destroy && this.props.destroy();
    this.props.clickOutSide && document.removeEventListener("click", this.onClose);
    clearTimeout(this.timer);
  }
  tipType(type) {
    let obj = {};
    if (type === "tip1") {
      obj.title = this.intl.get("tip-success");
      obj.icon = this.iconArr.succeed;
    }
    if (type === "tip2") {
      obj.title = this.intl.get("tip-warn");
      obj.icon = this.iconArr.warning;
    }
    if (type === "tip3") {
      obj.title = this.intl.get("tip-error");
      obj.icon = this.iconArr.wrong;
    }
    if (type === "tip4") {
      obj.title = this.intl.get("tip-message");
      obj.icon = this.iconArr.message;
    }
    return obj;
  }
  render() {
    let {
      type,
      title,
      onClose,
      onConfirm,
      closeButton,
      msg,
      autoClose,
      icon,
      h5,
      useType,
      className,
      confirmText,
      cancelText,
      cancelHide,
      cancelFlag,
      onCancel
    } = this.props;
    (!icon || !["succeed", "warning", "wrong", "message"].includes(icon)) &&
      (icon = "succeed");
    (!type ||
      ![
        "default",
        "base",
        "confirm",
        "custom",
        "tip1",
        "tip2",
        "tip3",
        "tip4"
      ].includes(type)) &&
      (type = "default");
    ["tip1", "tip2", "tip3", "tip4"].includes(type) &&
      (title = this.tipType(type).title);
    return (
      <div
        className={`wrap ${
          ["tip1", "tip2", "tip3", "tip4"].includes(type) || h5 ? "trans" : ""
        }`}
      >
        <div>
          {h5 ? (
            <div className={`h5 ${useType ? type : ''}`}>
              {useType && type === 'tip1' && <img src={H5_TIP_SUCCESS} alt=""/>}
              {useType && type === 'tip3' && <img src={H5_TIP_FAIL} alt=""/>}
              <p>{msg}</p>
            </div>
          ) : (
            <div
              className={`base-popup ${type} ${className ? className : ""}`}
              onClick={e => {
                e.nativeEvent.stopImmediatePropagation();
                ["tip1", "tip2", "tip3", "tip4"].includes(type) && onClose();
              }}
            >
              {["tip1", "tip2", "tip3", "tip4"].includes(type) && (
                <img src={this.tipType(type).icon} className="img" alt="" />
              )}
              {!["tip1", "tip2", "tip3", "tip4"].includes(type) && <h5>
                {title}
                {closeButton && (
                  <img
                    src={GUANBI_HEI}
                    alt=""
                    onClick={() => {
                      clearTimeout(this.timer);
                      cancelFlag ? onCancel() : onClose();
                    }}
                  />
                )}
              </h5>}
              <p>
                {["confirm", "custom"].includes(type) && (
                  <img
                    src={`${
                      type === "confirm"
                        ? this.iconArr["warning"]
                        : this.iconArr[icon]
                    }`}
                    alt=""
                  />
                )}
                <span>
                  {msg}
                </span>
              </p>
              <div className="popup-button">
                {type === "default" && (
                  <Button
                    title={this.intl.get("tip-know")}
                    type="base"
                    className="button cancel"
                    onClick={() => {
                      clearTimeout(this.timer);
                      onClose();
                    }}
                  />
                )}
                {["confirm", "custom"].includes(type) && (
                  <Button
                    title={confirmText || this.intl.get("tip-confirm")}
                    type="base"
                    className="button"
                    onClick={() => {
                      clearTimeout(this.timer);
                      onConfirm();
                    }}
                  />
                )}
                {["confirm", "custom"].includes(type) && !cancelHide && (
                  <Button
                    title={cancelText || this.intl.get("tip-cancel")}
                    className="button cancel"
                    onClick={() => {
                      clearTimeout(this.timer);
                      onClose();
                    }}
                  />
                )}

              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
