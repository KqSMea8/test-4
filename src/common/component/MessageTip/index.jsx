import React  from 'react'
import ExchangeViewBase from "@/components/ExchangeViewBase";
import {ASSET_CLOSED} from "@/config/ImageConfig"
import {
  goOrderPath,
} from "@/config/UrlConfig"
import "./index.styl"

export default class MessageTip extends ExchangeViewBase {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className={`message-tip ${this.props.show ? '' : 'none'}`}>
        <p>
          <span onClick={()=>{goOrderPath('/otc/detail/current')}}>
            {this.intl.get('message-tip')}
          </span>
          <img src={ASSET_CLOSED} alt="" onClick={this.props.onClose}/>
        </p>
      </div>
    )
  }
}
