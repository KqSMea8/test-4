import ExchangeViewBase from '@/components/ExchangeViewBase'
import React, {Component} from "react";

const scrollbot = require('simulate-scrollbar');

export default class extends ExchangeViewBase {
  constructor(props) {
    super(props);
    this.name = 'recentTrade';
    this.state = {
      recentBank: {},//汇率
      recentTradeListArr: [],// 近期交易数据
      recentTableHead: [
        {name: this.intl.get('price'), sortValue: ['priceR'], type: 0, sortDefault: 'priceR'},
        {name: this.intl.get('amount'), sortValue: ['volume'], type: 1, sortDefault: 'priceR'},
        {name: this.intl.get('time'), sortValue: ''},
      ],
      recentItemSelect: 'mineLess'
    };
    const {controller} = this.props;
    //绑定view
    controller.setView(this);
    //初始化数据，数据来源即store里面的state
    this.state = Object.assign(this.state, controller.initState);
    this.clearRoom = controller.clearRoom.bind(controller)
    
    this.recentRef = React.createRef();
  }
  
  componentDidMount() {
    this.customScrollRecent = new scrollbot('#trade_recent_body')
  }
  
  componentDidUpdate(preProps, preState) {
    if (preState.recentTradeListArr.length !== this.state.recentTradeListArr.length) {
      this.customScrollRecent && this.customScrollRecent.refresh();
    }
  }
  
  componentWillUnmount() {
    this.clearRoom()
  }
  
  get recentHeight() {
    return window.innerHeight - 30 - 304 - 4 - 50 > 0 ? window.innerHeight - 30 - 304 - 4 - 50 : 0;
  }
  
  render() {
    return <div className='trade-recent-pro' ref={this.recentRef}>
      <div className='trade-recent-thead'>
        {this.state.recentTableHead.map((v, index) => {
          return <span key={index}>
            {v.name}{index === 0 ? `(${(this.state.unitsType && this.state.unitsType.toUpperCase()) || (this.state.market && this.state.market.toUpperCase())})` : ''}
          </span>;
        })}
      </div>
      <div id='trade_recent_body' style={{width: '100%', height: `${this.recentHeight}px`, paddingLeft: '10px'}}>
        <div>
          <table>
            <tbody>
            {this.state.recentTradeListArr && this.state.recentTradeListArr.length && this.state.recentTradeListArr.map((v, index) => (<tr key={index}>
                  <td className={v.orderType === 1 ? 'trade-pro-recent-sell' : 'trade-pro-recent-buy'}>{v.priceR}</td>
                  <td>{v.volumeR}</td>
                  <td>{Number(v.dealTime).toDate('HH:mm:ss')}</td>
                </tr>)
            ) || <tr>
              <td><span>{this.intl.get('noRecords')}</span></td>
            </tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
  }
}