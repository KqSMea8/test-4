import React, {Component} from "react";
import ExchangeViewBase from "@/components/ExchangeViewBase";
import PropTypes from "prop-types"

export default class OtcOrderTitle extends ExchangeViewBase{
  static propTypes = {
    content: PropTypes.string.isRequired
  };
  constructor(){
    super()
  }
  render(){
    return(
        <h3 className="otc-order-title">
          {this.props.content}
        </h3>
    )
  }
}