import React, {Component} from "react";
import ExchangeViewBase from "@/components/ExchangeViewBase";
import PropTypes from "prop-types"
import OtcOrderTitle from './OtcOrderTitle'

export default class Faq extends ExchangeViewBase{
  static defaultProps = {
    type: 0
  };
  static propTypes = {
    type: PropTypes.number.isRequired
  };
  constructor(){
    super();
    this.content = [
        [
          this.intl.get('otc-faq-buy-1'),
          this.intl.get('otc-faq-buy-2'),
          this.intl.get('otc-faq-buy-3'),
          this.intl.get('otc-faq-buy-4'),
          this.intl.get('otc-faq-buy-5'),
        ],
      [
        this.intl.get('otc-faq-sell-1'),
        this.intl.get('otc-faq-sell-2'),
        this.intl.get('otc-faq-sell-3'),
        this.intl.get('otc-faq-sell-4'),
        this.intl.get('otc-faq-sell-5'),
      ]
    ]
  }
  render(){
    return(
        <div className='otc-order-faq'>
          <OtcOrderTitle
              content={this.intl.get('normalProblem')}
          />
          <ol>
            {this.content[this.props.type].map((v, index) => (
                <li key={index}>{v}</li>
            ))}
          </ol>
        </div>
    )
  }
}