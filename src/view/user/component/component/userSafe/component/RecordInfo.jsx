import React, {Component} from 'react';
import ExchangeViewBase from '@/components/ExchangeViewBase'

import {AsyncAll, Regular} from '@/core'

export default class RecordInfo extends ExchangeViewBase {
  constructor(props) {
    super(props);
  }

  render() {
    const {loginList, controller} = this.props;
    let language = controller.configController.language;
    return (
      <div className="record model-div clearfix">
        <h2 className={language === 'zh-CN' ? '' : 'h2-en'}>{this.intl.get("user-records")}</h2>
        <table className="fl">
          <thead>
          <tr>
            <th>{this.intl.get("user-recordType")}</th>
            <th>{this.intl.get("ip")}</th>
            <th>{this.intl.get("place")}</th>
            <th>{this.intl.get("time")}</th>
          </tr>
          </thead>
          <tbody>
          {loginList.map((v, index) => (
            <tr key={index}>
              <td>{v.catalog}</td>
              <td>{v.ip}</td>
              <td>{language === 'zh-CN' ? `${v.ipLocation.countryCN} - ${v.ipLocation.provinceCN}` : `${v.ipLocation.countryEN} - ${v.ipLocation.provinceEN}`}</td>
              <td>{v.createdTime.toDate('yyyy-MM-dd HH:mm:ss')}</td>
            </tr>)
          )}
          </tbody>
        </table>
      </div>
    );
  }
}