import React, {Component} from "react";
import intl from "react-intl-universal";
import {resolveTradePath, goTradePath} from '@/config/UrlConfig'
import Button from "@/common/baseComponent/Button";

export default class ToTrade extends Component {
  constructor(props) {
    super();
    this.intl = intl;
  }
  render() {
    let { pairArr } = this.props;
    return (<div className="to-trade clearfix">
      <span className="title">{this.intl.get("asset-toTrade")}</span>
      <div className="bts">
        {pairArr.map((v, index) => (
            <a href={resolveTradePath('',{tradePair: v.name.toLowerCase()})} key={index}>
              <Button
                  title={v.name}
                  type="base"
                  key={index}
              />
            </a>
        ))}
      </div>
    </div>)
  }
}
