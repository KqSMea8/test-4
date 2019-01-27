import React, { Component } from "react";
import ExchangeViewBase from "@/components/ExchangeViewBase.jsx"
import PropTypes from "prop-types"
import Input from "@/common/baseComponent/Input/index.jsx"
import SelectButton from "@/common/baseComponent/SelectButton/index.jsx"
import Button from "@/common/baseComponent/Button/index.jsx"

export default class AdFilter extends ExchangeViewBase{
  static defaultProps = {
    adCurrency: ['BTC', 'ETH', 'EOS', 'RMBC'],
    // adCurrencyActive: 'BTC'
  };
  static propTypes = {
    limitValue: PropTypes.string,
    payWay: PropTypes.string.isRequired,
    digital: PropTypes.string.isRequired,
    // searchFilter: PropTypes.func.isRequired,
    // resetFilter: PropTypes.func.isRequired,
    limitInput: PropTypes.func.isRequired,
    paySelect: PropTypes.func.isRequired,
  };
  constructor(props){
    super(props);
    this.payWayArr = [
      {name: this.intl.get('otc-pay-al'), type: 1},
      {name: this.intl.get('otc-pay-wechat1'), type: 2},
      {name: this.intl.get('otc-pay-bank'), type: 4},
      {name: this.intl.get('all'), type: 7},
    ]
  }
  render(){
    const {
      limitInput,
      limitValue,
      payWay,
      digital,
      paySelect,
      digitalSelect,
        searchClick,
        resetClick,
    } = this.props;
    return(
        <div className='ad-filter'>
          <p>{this.intl.get('otc-filter')}</p>
          <div className='ad-filter-items'>
            <Input
                placeholder={this.intl.get('otc-limit-money')}
                className='ad-filter-limit'
                onInput={limitInput.bind(this)}
                value={limitValue}
            />
            <SelectButton
                title={payWay}
                type="main"
                className="ad-filter-select"
                onSelect={paySelect.bind(this)}
                valueArr={this.payWayArr}
            />
            {/*<SelectButton*/}
                {/*title={digital}*/}
                {/*type="main"*/}
                {/*className="ad-filter-select ad-filter-select-d"*/}
                {/*onSelect={digitalSelect.bind(this)}*/}
                {/*valueArr={digitalArr}*/}
            {/*/>*/}
            <Button
                title={this.intl.get('search')}
                className='ad-filter-search'
                onClick={searchClick.bind(this)}
            />
            <Button
                title={this.intl.get('reset')}
                className='ad-filter-reset'
                onClick={resetClick.bind(this)}
            />
          </div>
        </div>
    )
  }
}