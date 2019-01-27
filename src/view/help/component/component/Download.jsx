import React, { Component } from "react";
import intl from "react-intl-universal";
import Button from '@/common/baseComponent/Button/index.jsx'

import '../style/download.styl'
import { COMMON_DOWNLOAD, LOGO_DOWNLOAD } from '@/config/ImageConfig';

export default class DownLoad extends Component {
  constructor(props) {
    super(props);
    this.intl = intl;
    this.state = {
      appVersion: [], // 版本信息
    }
  }

  async componentDidMount() {
    let result = await this.props.controller.configController.checkVersion();
    this.setState({
      appVersion: result
    })
    // this.props.sendStatis({
    //   event: 'homeOtherAcitons',//操作代码
    //   type: 'appDownload',//tab
    // })
  }

  render() {
    return (
      <div className="download-wrap">
        <h1>{this.intl.get('help-downloadTile')}</h1>
        <h2>{this.intl.get('help-downloadCon')}</h2>
        <img src={COMMON_DOWNLOAD} alt=""/>
        <a href={this.state.appVersion.length && this.state.appVersion[1].url || ''} className="download-btn-wrap">
          <Button title={this.intl.get("help-downloadIos")} className="ios-btn" />
        </a>
        <a href={this.state.appVersion.length && this.state.appVersion[0].url || ''} className="download-btn-wrap">
          <Button title={this.intl.get("help-downloadAndroid")}/>
        </a>
        <img className="app-img" src={ LOGO_DOWNLOAD } alt=""/>
        <p>{this.intl.get('help-downloadOp')}</p>
      </div>
    );
  }
}