import React, {Component} from "react";
import ExchangeViewBase from "@/components/ExchangeViewBase";
import PropTypes from "prop-types"
import OtcOrderTitle from './OtcOrderTitle'

export default class ExchangeInfo extends ExchangeViewBase {
  static defaultProps = {
    orderType: 0
  };
  static propTypes = {
    orderType: PropTypes.number.isRequired
  };
  
  constructor() {
    super();
    this.content = [
        [this.intl.get('otc-tradeInfo-buy-1'),this.intl.get('otc-tradeInfo-buy-2'),this.intl.get('otc-tradeInfo-buy-3')],
      [this.intl.get('otc-tradeInfo-sell-1'),this.intl.get('otc-tradeInfo-sell-2'),this.intl.get('otc-tradeInfo-sell-3')],
    ]
  }
  
  render() {
    const {orderType} = this.props;
    return (
        <div className='exchange-info'>
          <OtcOrderTitle  content={this.intl.get('order-exchange-info')}/>
          {/*<h3>{this.intl.get('order-exchange-info')}</h3>*/}
          <ol>
            {this.content[orderType].map((v, index) => (
                <li key={index}>{v}</li>
            ))}
          </ol>
        </div>
    )
  }
}