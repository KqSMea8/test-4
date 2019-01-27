import React, { Component } from 'react'
import ExchangeViewBase from '@/components/ExchangeViewBase'
import Input from "@/common/baseComponent/Input"
import PropTypes from "prop-types";

export default class AdName extends ExchangeViewBase {
  static propTypes = {
    adName:PropTypes.string.isRequired,
    changeAdName:PropTypes.func.isRequired,
    sensitive: PropTypes.bool.isRequired,
  };
  constructor(props) {
    super(props)
  }

  render() {
    const {adName, sensitive, changeAdName} = this.props;
    return (
      <div className='adForm-content-item adForm-content-adName clearfix'>
        <h3>{this.intl.get('otc-publish-setAdname')}</h3>
        <div className="adForm-content-main clearfix">
          <Input
            value={adName}
            onInput={changeAdName}
            maxlength={10}
            placeholder={this.intl.get('otc-publish-mostWord', {number: 10})}
          />
          {sensitive && <span>{this.intl.get('otc-publish-sensitive')}</span>}
        </div>
      </div>
    )
  }
}
