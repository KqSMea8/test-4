import React, { Component } from "react";
import ExchangeViewBase from "@/components/ExchangeViewBase.jsx";
import Input from "@/common/baseComponent/Input";
import PropTypes from "prop-types";
import { COMMON_RADIO_NORMAL, COMMON_RADIO_GET } from "@/config/ImageConfig";

export default class SetPrice extends ExchangeViewBase {
  static propTypes = {
    type: PropTypes.number.isRequired,
    floatPrice: PropTypes.bool.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    marketPrice: PropTypes.number.isRequired,
    marketLowPrice: PropTypes.number.isRequired,
    marketHighPrice: PropTypes.number.isRequired,
    changeFloatPrice: PropTypes.func.isRequired,
    unit: PropTypes.string.isRequired,
    changePrice: PropTypes.func.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      typeList: [
        this.intl.get("otc-publish-floatPrice"),
        this.intl.get("otc-publish-fixedPrice")
      ]
    };
  }

  radio = (v, i) => {
    if (i) {
      return (
        <li key={i} onClick={() => this.props.changeFloatPrice(false)}>
          {this.props.floatPrice && <img src={COMMON_RADIO_NORMAL} alt="" />}
          {!this.props.floatPrice && <img src={COMMON_RADIO_GET} alt="" />}
          {v}
        </li>
      );
    }
    return (
      <li key={i} onClick={() => this.props.changeFloatPrice(true)}>
        {!this.props.floatPrice && <img src={COMMON_RADIO_NORMAL} alt="" />}
        {this.props.floatPrice && <img src={COMMON_RADIO_GET} alt="" />}
        {v}
      </li>
    );
  };

  render() {
    const {
      floatPrice,
      price,
      marketPrice,
      marketLowPrice,
      marketHighPrice,
      unit,
      type,
      changePrice
    } = this.props;
    return (
      <div className="adForm-content-item adForm-content-required adForm-content-setPrice clearfix">
        <h3>{this.intl.get("otc-publish-setPrice")}</h3>
        <div className="adForm-content-main clearfix">
          <ul className="clearfix">
            {this.state.typeList.map((v, i) => this.radio(v, i))}
          </ul>
          <ol className="clearfix">
            <li>
              <h4>
                {this.intl.get("otc-publish-yourPrice")}{" "}
                {floatPrice && (
                  <span>
                    <b>{Number(price).format({ number: "legal", style:{decimalLength: 2} })}</b> {unit}
                  </span>
                )}
              </h4>
              {!floatPrice && (
                <div className="input">
                  <Input
                    value={price || ""}
                    onInput={changePrice}
                    placeholder={this.intl.get("otc-publish-inputPrice")}
                  />
                  <span>{unit}</span>
                </div>
              )}
            </li>
            <li>
              <h4>
                {floatPrice
                  ? this.intl.get("otc-publish-platLastPrice")
                  : type
                  ? this.intl.get("otc-publish-platLowestSell")
                  : this.intl.get("otc-publish-platHighestSell")}{" "}
                {floatPrice && (
                  <span>
                    <b>{marketPrice}</b> {unit}
                  </span>
                )}
              </h4>
              {!floatPrice && (
                <span>
                  <b>{type ? marketHighPrice : marketLowPrice}</b> {unit}
                </span>
              )}
            </li>
          </ol>
        </div>
      </div>
    );
  }
}
