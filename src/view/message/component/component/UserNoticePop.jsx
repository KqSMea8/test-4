import React, { Component } from "react";
import intl from "react-intl-universal";
import {GUANBI_HEI} from '@/config/ImageConfig'
import "../style/userNotice.styl"
const scrollbot = require('simulate-scrollbar');

export default class userNoticePop extends Component {
  constructor(props) {
    super(props);
    this.intl = intl
    this.state = {}
  }

  componentDidMount() {
    this.customScroll = new scrollbot('#user-notice-content', 10);
    this.customScroll.setStyle({
      block: {
        backgroundColor: '#aaa',
        borderRadius: '10px',
      },//滑块样式
      groove: {
        backgroundColor: '#eee',
        borderRadius: '10px',
      }//滚动槽样式
    })
  }

  componentDidUpdate(preProps, preState) {
    this.customScroll && this.customScroll.refresh();
  }

  render() {
    return (
      <div className="user-notice-pop-wrap">
        <h1 className="user-notice-pop-title clearfix">
          <span>{this.intl.get("notice-userDetail")}</span>
          <img src={GUANBI_HEI} alt="" onClick={() => {
            this.props.onClose && this.props.onClose()
          }}/>
        </h1>
        <div style={{padding: "15px 0 15px 15px"}}>
          <div style={{overflow: 'hidden', position: 'relative', maxHeight: '200px'}} id="user-notice-content">
            <div>
              <p dangerouslySetInnerHTML={{__html: this.props.content}}></p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}