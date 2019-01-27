import React, {Component} from 'react'
import ExchangeViewBase from "@/components/ExchangeViewBase.jsx"
import PropTypes from "prop-types"
import Input from "@/common/baseComponent/Input/index.jsx"
import SelectButton from "@/common/baseComponent/SelectButton/index.jsx"
import Button from "@/common/baseComponent/Button/index.jsx"

export default class MyAdSearch extends ExchangeViewBase {
  static defaultProps = {};
  static propTypes = {
    type: PropTypes.string.isRequired,
    currency: PropTypes.string.isRequired,
    currencyArr: PropTypes.array.isRequired,
  };
  
  constructor() {
    super();
    this.typeArr = [
      {name: this.intl.get('all'), type: 0},
      {name: this.intl.get('buy'), type: 2},
      {name: this.intl.get('sell'), type: 1},
    ]
  }
  
  render() {
    const {
      adNumber,
      adNumberInput,
      type,
      currency,
      currencyArr,
      changeType,
      changeCurrency,
      search,
      reset
    } = this.props;
    return (
        <div className='my-ad-filter'>
          <h3>{this.intl.get('otc-my-ad')}</h3>
          <div className='ad-filter'>
            <div className='ad-filter-items'>
              <Input
                  placeholder={this.intl.get('otc-ad-number')}
                  className='ad-filter-input'
                  onInput={adNumberInput.bind(this)}
                  value={adNumber}
              />
              <span className='ad-select-lab'>
                {this.intl.get('type')}
              </span>
              <SelectButton
                  title={type}
                  type="main"
                  className="ad-filter-select"
                  onSelect={changeType.bind(this)}
                  valueArr={this.typeArr}
              />
              <span className='ad-select-lab'>
                {this.intl.get('otc-currency')}
              </span>
              <SelectButton
                  title={currency}
                  type="main"
                  className="ad-filter-select"
                  onSelect={changeCurrency.bind(this)}
                  valueArr={currencyArr}
              />
            </div>
            <div className='ad-filter-search'>
              <Button
                  title={this.intl.get('search')}
                  className='filter-search-button filter-button'
                  onClick={search.bind(this)}
              />
              <Button
                  title={this.intl.get('reset')}
                  className='filter-reset-button filter-button'
                  onClick={reset.bind(this)}
              />
              {/*<Button*/}
              {/*title={this.intl.get('otc-reset-all')}*/}
              {/*className='filter-all-button filter-button'*/}
              {/*/>*/}
            </div>
          </div>
        </div>
    )
  }
}