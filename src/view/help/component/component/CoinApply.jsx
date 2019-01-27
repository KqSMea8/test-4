import React, { Component } from "react";
import intl from "react-intl-universal";
import '../style/coinApply.styl'

export default class CoinApply extends Component {
  constructor(props) {
    super(props);
    this.intl = intl;
    this.state = {
      contentList: [
        this.intl.get("help-appleContent1"),
        this.intl.get("help-appleContent2"),
        this.intl.get("help-appleContent3"),
        this.intl.get("help-appleContent4"),
        this.intl.get("help-appleContent5"),
        this.intl.get("help-appleContent6"),
        this.intl.get("help-appleContent7"),
        this.intl.get("help-appleContent8"),
      ]
    }
  }

  componentDidMount() {
    // this.props.sendStatis({
    //   event: 'applyPV',//操作代码
    //   type: 'apply',//tab
    // })
  }

  render() {
    const {controller} = this.props;
    return (
      <div className="apply-wrap">
        <h1>{this.intl.get("help-appleTitle")}</h1>
        <div>
          <p>{`${this.intl.get("help-appleState1")}${controller.configData.nameUsd}${this.intl.get("help-appleState2")}`}</p>
          <span>{controller.configData.applyEmailUrl}</span>
        </div>
        <ul>
          <li>{this.intl.get("help-appleDetailTile")}</li>
          {this.state.contentList.map((v, index) => (<li key={index}>{v}</li>))}
        </ul>
      </div>
    );
  }
}