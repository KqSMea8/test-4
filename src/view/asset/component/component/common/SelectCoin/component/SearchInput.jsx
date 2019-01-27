import React, {Component} from 'react';
import intl from "react-intl-universal";
import Input from "@/common/baseComponent/Input";
import {
  formatQueryToPath
} from "@/config/UrlConfig"

export default class Charge extends Component {
  constructor(props) {
    super(props);
    this.intl = intl;
    this.state = {
      showSearch: false,
    };
    this.show = () => {
      this.setState({ showSearch: true });
    };
    this.hide = () => {
      this.setState({ showSearch: false });
    };
    this.setValue = value => {
      this.props.setValue(value);
    };
    this.setCurrency = currency => {
      this.props.setCurrency(currency);
    };
  }

  onEnter = () => {
    if(!this.state.showSearch || this.props.value === this.props.currency.toUpperCase() && !this.props.searchArr.length) return;
    let value = this.props.searchArr[0] || "BTC";
    if(value === this.props.currency.toUpperCase()) {
      this.hide();
      this.setValue(value);
      return
    }
    this.props.history.push(formatQueryToPath(this.props.origin, {currency: value.toLowerCase()}))
  };

  render() {
    let { totalCount, frozenCount, availableCount, currency, history} = this.props;
    return (
      <div className="input">
        <Input
          type="search2"
          value={this.props.value}
          onInput={value => {
            this.setValue(value);
          }}
          onFocus={this.show}
          onEnter={this.onEnter}
          clickOutSide={this.onEnter}
        >
          {
            <ul
              className={`search-list ${
                this.state.showSearch && this.props.searchArr.length ? "" : "hide"
              }`}
            >
              {this.props.searchArr.map((item, index) => (
                <li
                  key={index}
                  onClick={e => {
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation();
                    history.push(formatQueryToPath(this.props.origin, {currency: item.toLowerCase()}))
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          }
        </Input>
        <ul>
          <li>
            <span>{this.intl.get("asset-amount")}</span>
            <i>
              {Number(totalCount).format({ number: "property" , style:{ decimalLength: 8}})}{" "}
              {currency}
            </i>
          </li>
          <li>
            <span>{this.intl.get("asset-orderLock")}</span>
            <i>
              {Number(frozenCount).format({ number: "property" , style:{ decimalLength: 8}})}{" "}
              {currency}
            </i>
          </li>
          <li>
            <span>{this.intl.get("asset-avail")}</span>
            <i>
              {Number(availableCount).format({ number: "property" , style:{ decimalLength: 8}})}{" "}
              {currency}
            </i>
          </li>
        </ul>
      </div>
    );
  }
}
