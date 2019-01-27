import React, {Component} from 'react';
import intl from "react-intl-universal";
import SelectButton from "@/common/baseComponent/SelectButton";
import {goUserPath} from "@/config/UrlConfig";

export default class TotalAsset extends Component {
  constructor(props) {
    super(props);
    this.intl = intl;
    this.state = {
      origin: props.origin || 'exchange'
    };
  }

  render() {
    let {totalAsset} = this.props;
    return <div className="total-asset clearfix">
      <div className="item total clearfix">
        <div className="content">
          <span>{this.intl.get("asset-totalAssets")}:</span>
          <b>
            {Number(totalAsset.valuationBTC).format({number: "property", style: {decimalLength: 8}})} BTC
          </b>
          {this.props.unit === this.intl.get("cny") ? <span className="legal">
             {Number(totalAsset.valuationCN).format({number: "legal"})} <i>CNY</i>
              </span> : <span className="legal">
               {Number(totalAsset.valuationEN).format({number: "legal"})} <i>USD</i>
              </span>}
          <div className="select">
            <SelectButton type="main" title={this.props.unit} simple={true}
                          valueArr={[this.intl.get("cny"), this.intl.get("usd")]} onSelect={item => {
              this.props.changeUnit(item);
            }}/>
          </div>
        </div>
      </div>
      {this.state.origin === 'exchange' && <div className="item limit">
        <span>{this.intl.get("asset-24hQuota")}:</span>
        <b>{totalAsset.totalQuota} BTC</b>
        {totalAsset.auth ? <span className="disable">
              {this.intl.get("asset-limitApply")}
            </span> : <a onClick={() => {
          goUserPath('/identity')
        }}>
          {this.intl.get("asset-limitApply")}
        </a>}
        <br/>
        <span>{this.intl.get("asset-usedAsset")}:</span>
        <b>{Number(totalAsset.usedQuota)} BTC</b>
      </div>}
    </div>;
  }
}