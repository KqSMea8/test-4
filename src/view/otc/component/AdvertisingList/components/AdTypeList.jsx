import React, { Component } from "react";
import ExchangeViewBase from "@/components/ExchangeViewBase.jsx"
import PropTypes from "prop-types"
export default class AdTypeList extends ExchangeViewBase{
  static defaultProps = {
    // adCurrency: ['BTC', 'ETH', 'EOS', 'RMBC'],
    // adCurrencyActive: 'BTC'
  };
  static propTypes = {
    adType: PropTypes.object.isRequired,
    adCurrencyCoins: PropTypes.array.isRequired,
    adCurrencyActive: PropTypes.string.isRequired,
    changeAdCurrencyActive: PropTypes.func.isRequired,
  };
  constructor(props){
    super(props);
  }
  render() {
    const {
      adType,
      adCurrencyCoins,
      adCurrencyActive,
      changeAdCurrencyActive,
    } = this.props;
    return(
        <div className="ad-types">
          <p>{adType.name}</p>
          <ul>
            {adCurrencyCoins.map((v, index) =>
                (<li className={v === adCurrencyActive ? 'ad-types-active' : ''}
                     key={index}
                     onClick={changeAdCurrencyActive.bind(this, adType.type, v)}
                >
                  {v.toUpperCase()}
                </li>)
              )}
          </ul>
        </div>
    )
    
  }
}