import React, {Component} from "react";
import ExchangeViewBase from "../../../components/ExchangeViewBase";
import PropTypes from "prop-types";
import '../style/payWay.styl'
import { OTC_PAY_ALIPAY_B, OTC_PAY_WECHAT_B, OTC_PAY_BANK_B } from "@/config/ImageConfig";

export default class PayWay extends ExchangeViewBase {
  static defaultProps = {
    payWayStatus: 7,
    className: 'pay-way-img'
  };
  static propTypes = {
    payWayStatus: PropTypes.number.isRequired,
    className: PropTypes.string.isRequired,
  };

  constructor() {
    super();
    this.payWayImg =
        {
          1: OTC_PAY_ALIPAY_B,
          2: OTC_PAY_WECHAT_B,
          3: [1, 2],
          4: OTC_PAY_BANK_B,
          5: [1, 4],
          6: [2, 4],
          7: [1, 2, 4]
        };
    this.payWayIndex = [1, 2, 4];
    this.getImg = this.getImg.bind(this)
  }

  getImg() {
    const status = this.props.payWayStatus;
    if (this.payWayIndex.indexOf(status) >= 0) {
      return (
          <li>
            <img src={this.payWayImg[status]} alt=""/>
          </li>
      )
    }
    return (
        this.payWayImg[status].map((v, index) =>
            (
                <li key={index}>
                  <img src={this.payWayImg[v]} alt=""/>
                </li>
            )
        )
    )
  }

  render() {
    const {
      className
    } = this.props;
    return (
        <ul className={className}>
          {this.getImg()}
        </ul>
    )
  }
}