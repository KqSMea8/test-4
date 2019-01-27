import React, {Component} from 'react';
import intl from "react-intl-universal";
import { NavLink } from "react-router-dom";
import Pagination from "@/common/baseComponent/Pagination";
import {
  formatQueryToPath
} from "@/config/UrlConfig"

export default class ChargeHistory extends Component {
  constructor(props) {
    super(props);
    this.origin = props.origin || 'exchange';
    this.intl = intl;
    this.status = {
      0: this.intl.get("pending"),
      1: this.intl.get("passed"),
      // 2: this.intl.get("failed"),
      // 3: this.intl.get("cancel")
    };
    // 充币记录表头
    this.theadArr = [
      {className: 'time', text: this.intl.get("asset-depositTime")},
      {className: 'currency', text: this.intl.get("asset-currency")},
      {className: 'amount', text: this.intl.get("asset-depositAmount")},
      {className: 'send', text: this.intl.get("asset-sendAddress")},
      {className: 'receive', text: this.intl.get("asset-receiveAddress")},
      {className: 'confirm', text: this.intl.get("asset-confirm")},
      {className: 'state', text: this.intl.get("state")},
    ]
  }

  render() {
    let orderList = this.props.assetHistory.orderList;
    return (
      <div className="history clearfix">
        <span className="title">{this.intl.get("asset-depositHistory")}</span>
        {this.props.assetHistory.total ? (
          <div className="table">
            <table>
              <thead>
                <tr>
                  {this.theadArr.map(v => (
                    <th className={v.className} key={v.className}>
                      {v.text}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orderList &&
                  orderList.map((v, index) => (
                    <tr key={index}>
                      <td>{v.orderTime.toDate()}</td>
                      <td>{v.coinName.toUpperCase()}</td>
                      <td className="amount">
                        <i>{v.count}</i>
                      </td>
                      <td>{"—"}</td>
                      <td className="receive">
                        <i>{v.receiveAddress}</i>
                      </td>
                      <td>
                        {!v.orderStatus ? (
                          <a
                            href={v.blockSite}
                            target="_blank"
                          >{`${v.doneCount || 0}/${v.verifyCount}`}</a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>
                        <span>{this.status[v.orderStatus]}</span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <div className="pagina">
              <Pagination
                total={this.props.assetHistory.total}
                pageSize={this.props.pageSize}
                showTotal={true}
                onChange={this.props.changePageHandle}
                showQuickJumper={true}
                currentPage={this.props.page}
              />
            </div>
            <p className="more">
              <NavLink to={formatQueryToPath(`/${this.origin}/dashboard`)}>
                {this.intl.get("asset-viewAll")}
              </NavLink>
            </p>
          </div>
        ) : (
          <div className="kong">{this.intl.get("noRecords")}</div>
        )}
      </div>
    );
  }
}
