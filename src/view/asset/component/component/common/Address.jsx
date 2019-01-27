import React, {Component} from 'react';
import intl from "react-intl-universal";
import { NavLink } from "react-router-dom";
import QRCode from "qrcode-react";
import Button from "@/common/baseComponent/Button";
import { ASSET_CLOSED } from "@/config/ImageConfig";
import {
  formatQueryToPath,
} from "@/config/UrlConfig"

export default class Address extends Component {
  constructor(props) {
    super(props);
    this.intl = intl;
    this.state = {
      origin: props.origin || 'exchange'
    }
  }

  copyHandle = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    let address = this.props.coinAddress;
    if (address && address.coinAddress) {
      this.props.copy(this.refs.address);
    }
  };

  render() {
    return (
      <div>
        <div className="address">
          <p className="tips">
            {this.intl.getHTML("asset-depositTip", {
              currency: this.props.currency
            })}
          </p>
          <div className="currency-address clearfix">
            <span className="title">
              {this.props.currency +
                " " +
                this.intl.get("asset-depositAddress")}
            </span>
            <input
              ref="address"
              type="text"
              value={this.props.address}
              readOnly="readonly"
            />
          </div>
          <div className="handel">
            <Button
              title={this.intl.get("asset-showQrcode")}
              type="base"
              onClick={this.props.showQrcodeHandle}
            />
            <Button
              title={this.intl.get("asset-copy")}
              type="base"
              onClick={this.copyHandle}
            />
            {this.props.address && (
              <div
                className={`qrcode-wrap ${this.props.showQrcode ? "show" : ""}`}
              >
                <div className="qrcode">
                  <img
                    src={ASSET_CLOSED}
                    alt=""
                    onClick={this.props.hideQrcodeHandle}
                  />
                  <h4>
                    {this.intl.getHTML("asset-chargeAddr", {
                      currency: this.props.currency
                    })}
                  </h4>
                  <QRCode value={this.props.address} level="M" bgColor="#FFF" />
                  <p>{this.props.address}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="tip clearfix">
          <span className="title">{this.intl.get("asset-reminder")}</span>
          <ol>
            <li>
              {this.intl.getHTML("asset-depositReminder1", {
                currency: this.props.currency,
                number: this.props.verifyNumber
              })}
            </li>
            <li>
              {this.intl.get("asset-depositReminder2-1")}{" "}
              <NavLink to={formatQueryToPath(`/${this.state.origin}/dashboard`)}>
                {this.intl.get("asset-records")}
              </NavLink>{" "}
              {this.intl.get("asset-depositReminder2-2")}
            </li>
          </ol>
        </div>
      </div>
    );
  }
}
