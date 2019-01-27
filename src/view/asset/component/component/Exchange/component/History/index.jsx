import React, { Component } from "react";
import intl from "react-intl-universal";
import Filter from '../../../common/Filter'
import Button from "@/common/baseComponent/Button";
import Pagination from "@/common/baseComponent/Pagination";
import {AsyncAll} from '@/core'
import {getQueryFromPath} from '@/config/UrlConfig'

class TableItem extends Component {
  render() {
    let v = this.props.item,
      { orderType, status, accountMap } = this.props;
    return <tr>
      <td className="time pop-parent">
        {v.orderTime.toDate("yyyy-MM-dd")}
        <b className="pop-children uppop-children">
          {v.orderTime.toDate("yyyy-MM-dd HH:mm:ss")}
        </b>
      </td>
      <td>
        <img src={v.coinIcon} alt="" />
        {v.coinName.toUpperCase()}
      </td>
      <td>{orderType[v.orderType]}</td>
      <td className={`cash ${ [2,16].includes(v.orderType) ? "red" :[1,8].includes(v.orderType) ? "green" : "" }`}>
        <i>
          {[2,16].includes(v.orderType) ? "-" : [1,8].includes(v.orderType) ? "+" : ""}
          {Number(v.count)}
        </i>
      </td>
      <td className="send pop-parent">
        <i>{"—"}</i>
      </td>
      <td className="receive pop-parent">
        <i>{accountMap[v.receiveAddress] || v.receiveAddress || "—"}</i>
        { !accountMap[v.receiveAddress] && v.receiveAddress && <b className="pop-children uppop-children">
          {v.receiveAddress}
        </b>}
      </td>
      <td className="confirm">
        {v.orderType === 1 && !v.orderStatus ? (
          <a
            href={v.blockSite}
            target="_blank"
          >{`${v.doneCount || 0}/${v.verifyCount}`}</a>
        ) :  "—" }
      </td>
      <td
        className={`state ${!v.orderStatus ? "pending" : v.orderStatus === 2 ? "failed" : "" }`}
      >
        <span>{status[v.orderStatus]}</span>
      </td>
      <td className="fee">{v.fee || "—"}</td>
    </tr>
  }
}

export default class History extends Component {
  constructor(props) {
    super(props);
    let { controller } = this.props;
    let type = this.type = getQueryFromPath('type') && Number(getQueryFromPath('type'));
    controller.setView(this);
    this.intl = intl;
    // 生成充提币类型及进度的状态码映射表；
    this.staticData = {
      orderType: {
        '-1': this.intl.get("all"),
        1: this.intl.get("deposit"),
        2: this.intl.get("asset-withdraw"),
        // 4: this.intl.get("asset-transfer"),
        8: this.intl.get("asset-in"),
        16: this.intl.get("asset-out"),
        // 32: this.intl.get("asset-redeem")
      },
      accountMap: {
        exchange: this.intl.get("asset-coin-account"),
        mixotc: this.intl.get("asset-legal-account"),
        FUNDS: this.intl.get('tlb-account')
      },
      status: {
        '-1': this.intl.get("all"),
        0: this.intl.get("pending"),
        1: this.intl.get("passed"),
        2: this.intl.get("failed"),
        3: this.intl.get("canceled"),
        4: this.intl.get("dealing"),
        5: this.intl.get("dealing")
      }
    };
    this.theadArr = [
      {className: 'time', text: this.intl.get("time")},
      {className: 'currency', text: this.intl.get("asset-currency")},
      {className: 'type', text: this.intl.get("type")},
      {className: 'cash', text: this.intl.get("asset-amount2")},
      {className: 'send', text: this.intl.get("asset-sendAddress")},
      {className: 'receive', text: this.intl.get("asset-receiveAddress")},
      {className: 'confirm', text: this.intl.get("asset-confirm")},
      {className: 'state', text: this.intl.get("asset-checkState")},
      {className: 'fee', text: this.intl.get("fee")},
    ];
    this.selectArr = [
      { key:'currency_s', text: this.intl.get("asset-currency") , valueArr: [this.intl.get("all")]},
      { key:'orderType_s',  text: this.intl.get("type") , valueArr: Object.values(this.staticData.orderType).reverse()},
      { key:'status_s',  text: this.intl.get("state") , valueArr: Array.from(new Set(Object.values(this.staticData.status))).reverse()},
    ];
    for (const k in this.staticData.orderType) {
      this.staticData.orderType[this.staticData.orderType[k]] = Number(k);
    }
    for (const k in this.staticData.status) {
      this.staticData.status[this.staticData.status[k]] = Number(k);
    }
    this.state = {
      page: 1,
      pageSize: 20,
      // 搜索条件
      currency: this.intl.get("all"),
      orderType: [1].includes(type) && this.staticData.orderType[type] || this.intl.get("all"),
      status: this.intl.get("all"),
      startTime: this.dealTime().start,
      endTime: this.dealTime().end,
      //选择条件
      currency_s: this.intl.get("all"),
      orderType_s: [1].includes(type) && this.staticData.orderType[type] || this.intl.get("all"),
      status_s: this.intl.get("all"),
      startTime_s: this.dealTime().start,
      endTime_s: this.dealTime().end
    };
    let { walletList, assetHistory } = controller.initState;
    this.state = Object.assign(this.state, {
      walletList,
      assetHistory
    });
    //绑定方法
    this.getHistory = controller.getHistory.bind(controller);
    this.getWalletList = controller.getWalletList.bind(controller);
    this.exportHistory = controller.exportHistory.bind(controller);
  }
  async componentDidMount() {
    // this.props.sendStatis({
    //   event: 'assetsPV',//操作代码
    //   type: 'records',//tab
    // })
    let result = await AsyncAll([this.getWalletList(),this.getHistory(
      {
        page: 0,
        pageSize: this.state.pageSize,
        coinId: -1,
        coinName: -1,
        orderType: [1].includes(this.type) && this.type || -1,
        orderStatus: -1,
        startTime: this.dealTime().start,
        endTime: this.dealTime().end
      })
    ]);
    this.selectArr[0].valueArr = [this.intl.get("all"), ...Object.keys(result[0].walletList)]
    this.setState(Object.assign({}, ...result))
  }

  componentWillUnmount(){
    this.props.controller.initHistory();
  }

  dealTime = () => {
    let now = new Date();
    let start =
      new Date(now.getFullYear(), now.getMonth(), now.getDate()) - 604800000;
    let end =
      new Date(now.getFullYear(), now.getMonth(), now.getDate()) -
      0 +
      86399999;
    return {
      start: parseInt(start / 1000),
      end: parseInt(end / 1000)
    }
  };

  initSearch = () => {
    this.setState(
      {
        page: 1,
        currency: this.intl.get("all"),
        orderType: this.intl.get("all"),
        status: this.intl.get("all"),
        startTime: this.dealTime().start,
        endTime: this.dealTime().end,
        currency_s: this.intl.get("all"),
        orderType_s: this.intl.get("all"),
        status_s: this.intl.get("all"),
        startTime_s: this.dealTime().start,
        endTime_s: this.dealTime().end
      },
      () => {
        this.search(0);
      }
    );
  };

  select = (value) => {
    this.setState(value);
  };

  search = async (page) => {
    let { currency, orderType, startTime, endTime, status, pageSize } = this.state;
    let result = await this.getHistory({
      coinId: currency === this.intl.get("all") ? -1 : this.state.walletList[currency],
      coinName: currency === this.intl.get("all") ? -1 : currency.toLowerCase(),
      orderType: this.staticData.orderType[orderType], //充0提1转2  注意:交易所内充提显示为转账
      startTime: startTime,
      endTime: endTime,
      orderStatus: this.staticData.status[status], //未通过 审核中1 通过2  撤销3
      page: page,
      pageSize: pageSize
    });
    this.setState(result)
  };

  // 搜索按钮点击处理
  searchHandle = () => {
    this.setState({
      page: 1,
      currency: this.state.currency_s,
      orderType: this.state.orderType_s,
      status: this.state.status_s,
      startTime: this.state.startTime_s,
      endTime: this.state.endTime_s
    },()=>{
      this.search(0);
    });
  };

  // reset
  resetHandle = () => {
    this.initSearch();
  };

  changePage = page => {
    this.setState({
      page,
      currency_s: this.state.currency,
      orderType_s: this.state.orderType,
      status_s: this.state.status,
      startTime_s: this.state.startTime,
      endTime_s: this.state.endTime
    });
    this.search(page - 1);
  };

  onChangeStart = time => this.setState({ startTime_s: parseInt(time / 1000) });

  onChangeEnd = time => this.setState({ endTime_s: parseInt(time / 1000) });

  render() {
    let { orderList } = this.state.assetHistory;
    return (
      <div className="hist">
        <h3 className="title">
          <Button
            type="export"
            title={this.intl.get("asset-export")}
            onClick={this.exportHistory}
          />
        </h3>
        <Filter
          selectArr={this.selectArr}
          currency_s={this.state.currency_s}
          orderType_s={this.state.orderType_s}
          status_s={this.state.status_s}
          select={this.select}
          startTime_s={this.state.startTime_s}
          endTime_s={this.state.endTime_s}
          onChangeStart={this.onChangeStart}
          onChangeEnd={this.onChangeEnd}
          searchHandle={this.searchHandle}
          resetHandle={this.resetHandle}
        />
          <div>
            <table className="table">
              <thead>
                <tr>
                  {this.theadArr.map((v,i)=><th key={i} className={v.className}>{v.text}</th>)}
                </tr>
              </thead>
              <tbody>
                {orderList.length ?
                  orderList.map((v,index) => (
                    <TableItem
                      item={v}
                      key={index}
                      status={this.staticData.status}
                      orderType={this.staticData.orderType}
                      accountMap={this.staticData.accountMap}
                    />)
                  ) :
                  <tr className="empty">
                    <td colSpan="9">
                      <p>{this.intl.get('noRecords')}</p>
                    </td>
                  </tr>
                  }
              </tbody>
            </table>
            {this.state.assetHistory.total ? <div className="pagin">
              <Pagination
                total={this.state.assetHistory.total}
                pageSize={this.state.pageSize}
                showTotal={true}
                onChange={this.changePage}
                showQuickJumper={true}
                currentPage={this.state.page}
              />
            </div> : ''}
          </div>
      </div>
    );
  }
}
