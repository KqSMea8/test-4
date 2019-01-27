import React, { Component } from 'react'
import ExchangeViewBase from '@/components/ExchangeViewBase'

export default class Matters extends ExchangeViewBase {
  constructor(props) {
    super(props);
    this.text=[
      this.intl.get('otc-publish-matters-1'),
      this.intl.get('otc-publish-matters-2'),
      this.intl.get('otc-publish-matters-3'),
      this.intl.get('otc-publish-matters-4'),
    ]
  }
  render() {
    return (
      <div className='adForm-content-item adForm-content-matters clearfix'>
        <h3>{this.intl.get('otc-publish-matters')}</h3>
        <div className="adForm-content-main clearfix">
          <ul>
            {this.text.map((v,i)=><li key={i}>
                {v}
              </li>)}
          </ul>
        </div>
      </div>
    )
  }
}
