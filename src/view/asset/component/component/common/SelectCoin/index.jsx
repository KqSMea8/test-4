import React, {Component} from 'react';
import intl from "react-intl-universal";
import SearchInput from "./component/SearchInput";

export default class SelectCoin extends Component {
  constructor(props) {
    super(props);
    this.intl = intl
  }
  render() {
    return (
      <div className="select">
        <div className="search clearfix">
          <span className="title">{this.intl.get("asset-selectCoin")}</span>
          <div className="currency-asset">
            <SearchInput
              origin={this.props.origin}
              history={this.props.history}
              value={this.props.value}
              currency={this.props.currency}
              setValue={this.props.setValue}
              setCurrency={this.props.setCurrency}
              searchArr={this.props.searchArr}
              totalCount={this.props.totalCount}
              frozenCount={this.props.frozenCount}
              availableCount={this.props.availableCount}
            />
          </div>
        </div>
      </div>
    );
  }
}
