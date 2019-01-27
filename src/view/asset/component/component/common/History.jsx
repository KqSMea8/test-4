import React, {Component} from 'react';
import intl from "react-intl-universal";
import Pagination from "@/common/baseComponent/Pagination";

/*
  orderList 资产记录数据
  status 状态映射
  dir 类型映射
  total
  pageSize
  changePage
  page
 */

class TableItem extends Component {
  render() {
    let v = this.props.item,
      { dir, status } = this.props;
    return <tr>
      <td className="time">
        {v.orderTime.toDate("yyyy-MM-dd HH:mm:ss")}
      </td>
      <td>
        {v.coinName.toUpperCase()}
      </td>
      <td className={`cash ${ [2,4,12].includes(v.dir) ? "red" :[1,3,11].includes(v.dir) ? "green" : "" }`}>
        <i>
          {[2,4,12].includes(v.dir) ? "-" : [1,3,11].includes(v.dir) ? "+" : ""}
          {Number(v.count)}
        </i>
      </td>
      {status && <td
        className={`state ${!v.orderStatus ? "complete" : [3,4,5,6,7].includes(v.orderStatus) ? "pending" : "" }`}
      >
        <span>{status[v.orderStatus]}</span>
      </td>}
      <td>{[11,12].includes(v.dir) ? intl.get('asset-funds-transfer') : dir[v.dir]}</td>
      <td
        className={`cash ${ [2,12].includes(v.dir) ? "red" :[1,11].includes(v.dir) ? "green" : "" }`}
      >{dir[v.dir]}</td>
      {!status && <td className="fee">{v.dir === 3 ? Number(v.fee) + v.coinName.toUpperCase() || '-' : '-'}</td>}
    </tr>
  }
}

export default class History extends Component {
  constructor(props) {
    super(props);
    this.intl = intl;
    this.state={};
    this.theadArr = [
      {className: 'time', text: this.intl.get("time")},
      {className: 'currency', text: this.intl.get("asset-currency")},
      {className: 'cash', text: this.intl.get("asset-withdrawalsAmount")},
      {className: 'state', text: this.intl.get("asset-state")},
      {className: 'type', text: this.intl.get("type")},
      {className: 'direction', text: this.intl.get("asset-direction")},
    ];
    if(!props.status){
      this.theadArr.splice(3,1);
      this.theadArr.push({className: 'fee', text: this.intl.get("fee")})
    }
  }

  render() {
    return (
      <div>
        <table className="table otc-table">
          <thead>
            <tr>
              {this.theadArr.map((v, i) => (
                <th key={i} className={v.className}>
                  {v.text}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {this.props.orderList.length ? (
              this.props.orderList.map((v, index) => (
                <TableItem
                  item={v}
                  key={index}
                  status={this.props.status}
                  dir={this.props.dir}
                />
              ))
            ) : (
              <tr className="empty">
                <td colSpan="6">
                  <p>{this.intl.get("noRecords")}</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {this.props.total ? (
          <div className="pagin">
            <Pagination
              total={this.props.total}
              pageSize={this.props.pageSize}
              showTotal={true}
              onChange={this.props.changePage}
              showQuickJumper={true}
              currentPage={this.props.page}
            />
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}
