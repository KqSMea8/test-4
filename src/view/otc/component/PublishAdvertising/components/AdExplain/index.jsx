import React, { Component } from 'react'
import ExchangeViewBase from "@/components/ExchangeViewBase.jsx"

export default class AdExplain extends ExchangeViewBase {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="adExplain-wrap">
        <h2 className="publish-title">{this.intl.get('otc-publish-explain')}</h2>
        <ul className="adExplain-content">
          <li>{this.intl.get('otc-publish-rule-1')}</li>
          <li>{this.intl.get('otc-publish-rule-2')}</li>
        </ul>
      </div>
    )
  }
}
