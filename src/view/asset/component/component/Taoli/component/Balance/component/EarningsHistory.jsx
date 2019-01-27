import React, {Component} from 'react';
import intl from "react-intl-universal";
import Pagination from '@/common/baseComponent/Pagination'
import { ASSET_CLOSED } from '@/config/ImageConfig';

export default class EarningsHistory extends Component {
  constructor(props) {
    super(props);
    this.intl = intl;
    this.state = {
      page: 1,
      pageSize: 7,
      earningsHistory: {
        total: 0,
        list: []
      },
    };
  }

  componentDidMount(){
    this.getHistory({id: this.props.id, page: this.state.page, pageSize: this.state.pageSize});
  }

  getHistory = async obj => {
    let result = await this.props.getHistory(obj);
    this.setState({earningsHistory: result})
  };

  changePageHandle = async page=>{
    this.setState({page}, ()=>this.getHistory({
      id: this.props.id,
      page: this.state.page,
      pageSize: this.state.pageSize,
    }))
  };

  closeHandle = ()=>{
    this.props.onClose && this.props.onClose()
  };

  render() {
    let {currency, name, totalEarnings} = this.props;
    return <div className="earnings-wrap">
      <div className="earnings">
        <h3>
          {name}
          <img src={ASSET_CLOSED} alt="" onClick={this.closeHandle}/>
          <span>{this.intl.get("tlb-invest-totalEarnings")}：<i>{totalEarnings}</i>{currency}</span>
        </h3>
        <table className="earnings-list">
          <thead>
            <tr>
              <th>{this.intl.get("tlb-invest-date")}</th>
              <th>{this.intl.get("tlb-invest-earnings")}</th>
            </tr>
          </thead>
          <tbody>
            {this.state.earningsHistory.list.map((v, i)=><tr key={v.date}>
                <td>{`${v.date.toDate("yyyy-MM-dd")} ${!i && this.state.page === 1 ? `(${this.intl.get("tlb-invest-yesterday")})` : ''}`}</td>
                <td>{`${Number(v.earnings).format({
                        number: ['CNY', 'USD'].includes(currency.toUpperCase()) ? "legal" : "property",
                        style: { decimalLength: ['CNY', 'USD'].includes(currency.toUpperCase()) ? 4 : 8 }
                      })} ${currency}`}</td>
              </tr>)}
            {this.state.earningsHistory.list.length === 0 && <tr className="empty">
              <td colSpan="2">
                <p>{this.intl.get('noRecords')}</p>
              </td>
            </tr>}
          </tbody>
        </table>
        <div className="bottom">
          <Pagination
            total={this.state.earningsHistory.total}
            pageSize={this.state.pageSize}
            showTotal={true}
            onChange={this.changePageHandle}
            currentPage={this.state.page}
          />
        </div>
      </div>
    </div>;
  }
}
