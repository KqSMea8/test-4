import React from "react";
import ExchangeViewBase from "../../../components/ExchangeViewBase";
import { ASSET_CLOSED } from "@/config/ImageConfig";
/*
theme 主题色 black(币币交易页), 默认(普通页)
onClose
destroy
*/
export default class ConnectPopup extends ExchangeViewBase {
  constructor(props) {
    super(props);
    this.onClose = this.props.onClose
  }
  componentDidMount = () =>  {
    document.addEventListener("click", this.onClose);
  }

  componentWillUnmount = () => {
    document.removeEventListener("click", this.onClose);
    this.props.destroy && this.props.destroy();
  }

  render() {
    let theme = this.props.theme;
    return <div className="connect-wrap">
      <div className={`connect-content ${theme === 'black' ? "black" : ''}`} onClick={e=>{e.nativeEvent.stopImmediatePropagation();}}>
        <h3 className="connect-title">
          <span>{this.intl.get('connect-title')}</span>
          <img src={ASSET_CLOSED} alt="" onClick={this.onClose}/>
        </h3>
        <p>{this.intl.get('connect-content')}</p>
        <div className="bar-wrap">
          <i className="bar"></i>
        </div>
        <p className="tip">{this.intl.get('connect-tip')}</p>
      </div>
    </div>
  }
}
