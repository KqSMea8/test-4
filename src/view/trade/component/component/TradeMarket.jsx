import ExchangeViewBase from '@/components/ExchangeViewBase'
import React, {Component} from "react";

const scrollbot = require('simulate-scrollbar');
import {
  TRADE_RANK,
  HOME_FAVORTIES_NORMAL_PRO,
  HOME_FAVORTIES_SELECTED_PRO,
  TRADE_PRO_SEARCH
} from '@/config/ImageConfig'

export default class TradeMarket extends ExchangeViewBase {
  constructor(props) {
    super(props);
    this.name = 'tradeMarket'
    this.state = {
      query: '',
      searchValue: '',
      // mainMarketPair: [], // 主流区数据
      // newMarketPair: [],  // 创新区数据
      sortIndex: -1,
      tradeSortImg: TRADE_RANK,
      collectActive: false, // 控制收藏区的active
      marketTableHead: [
        {name: this.intl.get('market-markets'), sortValue: '', id: 'head_name'},
        {name: this.intl.get('market-lastPrice'), sortValue: ['price'], type: 1, sortDefault: 'price', id: 'head_price'},
        {name: `24h${this.intl.get('market-change')}`, sortValue: ['rise'], type: 1, sortDefault: 'rise', id: 'head_rise'},
        {name: `24h${this.intl.get('total')}`, sortValue: ['turnover'], type: 1, sortDefault: 'turnover', id: 'head_turnover'}
      ],
      marketShow: false
    };
    
    const {controller} = this.props;
    //绑定view
    controller.setView(this);
    //初始化数据，数据来源即store里面的state
    this.state = Object.assign(this.state, controller.initState);
    this.marketDataHandle = controller.marketDataHandle.bind(controller);
    this.changeMarket = controller.changeMarket.bind(controller);
    this.pairSort = controller.pairSort.bind(controller);
    this.setDealMsg = controller.setDealMsg.bind(controller);
    this.tradePairChange = controller.tradePairChange.bind(controller)
    this.filte = controller.filte.bind(controller) // 筛选
    // this.tradePairSelect = controller.tradePairSelect.bind(controller);
    this.addCollect = controller.addCollect.bind(controller) // 添加收藏
    this.collectMarket = controller.collectMarket.bind(controller) // 点击收藏
    this.joinHome = controller.joinHome.bind(controller) // 加入房间
    this.clearRoom = controller.clearRoom.bind(controller) //推出房间
    this.clearHistory = controller.clearHistory.bind(controller) //推出房间
    this.marketContent = this.marketContent.bind(this)
    this.searchPair = this.searchPair.bind(this) // 点击搜索按钮
    // this.getBank = controller.getBank.bind(controller) //获取汇率
  }
  
  componentDidMount() {
    window.addEventListener("click", this.props.onHideMarket);
    this.customScroll = new scrollbot('#trade_market_bar')
    //清除websocket历史
    this.clearHistory()
    this.joinHome();
    // this.getBank()
  }
  
  componentWillUnmount() {
    this.clearRoom()
    window.removeEventListener("click", this.props.onHideMarket);
  }
  
  componentDidUpdate(preProps, preState) {
    let tradeMarketHeight = document.getElementById('trade_market_con'),
        tradeMarketBar = document.getElementById('trade_market_bar'),
        scrollHead = document.getElementById('scroll_head'),
        nameBodyWidth = document.getElementById('name_td'),
        priceBodyWidth = document.getElementById('price_td'),
        riseBodyWidth = document.getElementById('rise_td'),
        turnoverBodyWidth = document.getElementById('turnover_td'),
        nameHeadWidth = document.getElementById('head_name'),
        priceHeadWidth = document.getElementById('head_price'),
        riseHeadWidth = document.getElementById('head_rise'),
        turnoverHeadWidth = document.getElementById('head_turnover');
    
    this.height = tradeMarketHeight && tradeMarketHeight.clientHeight;
    if (this.props.status) {
      tradeMarketBar.style.height = this.height >= 170 ? '170px' : 'auto';
      this.customScroll && this.customScroll.refresh();
      scrollHead.style.paddingRight = this.height >= 170 ? '15px' : '0';
      this.nameWidth = nameBodyWidth && nameBodyWidth.clientWidth;
      this.priceWidth = priceBodyWidth && priceBodyWidth.clientWidth;
      this.turnoverWidth = turnoverBodyWidth && turnoverBodyWidth.clientWidth;
      this.riseWidth = riseBodyWidth && (riseBodyWidth.clientWidth > 70 ? 70 : riseBodyWidth.clientWidth);
      // 头部宽度
      nameHeadWidth && (nameHeadWidth.style.width = this.nameWidth + 'px');
      priceHeadWidth && (priceHeadWidth.style.width = this.priceWidth + 'px');
      riseHeadWidth && (riseHeadWidth.style.width = this.riseWidth + 'px');
      turnoverHeadWidth && (turnoverHeadWidth.style.width = this.turnoverWidth + 'px');
      riseBodyWidth && (riseBodyWidth.style.width = this.riseWidth + 'px');
    }
  }
  
  marketContent(v, index) { // 市场内容
    return (
        <tr key={index} className={`pair-items${this.state.tradePair === v.tradePairName ? '-active' : ''} pop-parent`}
            onClick={this.pairChange.bind(this, v)} style={{cursor: 'pointer'}}>
          <td id="name_td">
            <img
                src={`${v.isFavorite ? HOME_FAVORTIES_SELECTED_PRO : HOME_FAVORTIES_NORMAL_PRO}`}
                className="favorite-img"
                onClick={e => this.addCollect(v, index, e)}/>
            {v.tradePairName.toUpperCase()}</td>
          <td id="price_td">
          <span
              className={`${Number(v.updown) && (Number(v.updown) > 0 && "market-up" || "market-down")}`}>{Number(v.price).format({number: 'digital'}) || 0} / </span>
            <span
                className="second-span">{this.props.controller.language === 'zh-CN' && Number(Number(v.priceCN).multi(v.price) || 0).format({
              number: 'legal',
              style: {name: 'cny'}
            }) || Number(Number(v.priceEN).multi(v.price) || 0).format({number: 'legal', style: {name: 'usd'}})}</span>
          </td>
          <td className={`${v.rise < 0 ? 'down-td' : 'up-td'}`} id="rise_td">{Number(v.rise).toPercent()}</td>
          <td id="turnover_td">{Number(v.turnover).formatTurnover() || '--'}</td>
        </tr>
    )
  }
  
  onInputValue(e) { // 获取输入框的值
    this.setState({
      searchValue: e.target.value
    })
  }
  
  pairChange(v, e) {
    e.preventDefault();
    this.setState({
      searchValue: '',
    });
    this.tradePairChange(v);
    this.props.onMarketChange()
  }
  
  onEnter(e) { // 搜索回车选中事件
    if (e.nativeEvent.keyCode !== 13) return;
    let result = this.filte(this.state.homeMarketPairData, this.state.searchValue)
    this.pairChange(result[0], e)
  }
  
  searchPair(e) {
    let result = this.filte(this.state.homeMarketPairData, this.state.searchValue)
    this.pairChange(result[0], e)
  }
  
  render() {
    const {controller} = this.props;
    let homeMarketPairDataLength = this.filte(this.state.homeMarketPairData, this.state.searchValue).length;
    return (
        <div>
          <div id='trade-pro-market' className={this.props.status ? '' : 'hide'} onClick={e => {
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
          }}>
            <div className='trade-market-list clearfix'>
              <ul className="clearfix">
                <li onClick={this.collectMarket}
                    className={`${this.state.collectActive ? 'trade-market-item-active' : ''}`}>
                  <img src={HOME_FAVORTIES_NORMAL_PRO} className="optional-img" alt=""/>
                  {this.intl.get('optional')}
                </li>
                {this.state.marketDataHandle.map((v, index) => {
                  return (
                      <li
                          className={`trade-market-item${this.state.market.toUpperCase() === v.toUpperCase() ? '-active' : ''}`}
                          key={index} onClick={this.changeMarket.bind(this, v)}>
                        {v.toUpperCase()}
                      </li>
                  )
                })}
              </ul>
              <div className='input-div'>
                <input type="text"
                       value={this.state.searchValue}
                       onChange={this.onInputValue.bind(this)}
                       onKeyDown={this.onEnter.bind(this)}/>
                <img src={TRADE_PRO_SEARCH} alt="" onClick={this.searchPair}/>
              </div>
            </div>
            <div className="trade-market-thead" id="scroll_head">
              <p>
                {this.state.marketTableHead.map((v, index) => {
                  return (<span id={v.id}
                                key={index}
                                className={`${v.sortValue ? 'sort-img-td' : ''}`}>
                  <b onClick={this.pairSort.bind(this, v, index)}>{v.name}</b>
                  <img src={this.state.sortIndex === index ? this.state.tradeSortImg : TRADE_RANK}
                       alt=""
                       className={`${v.sortValue ? '' : 'hide'}`}
                       onClick={this.pairSort.bind(this, v, index)}/>
                </span>)
                })}
              </p>
            </div>
            <div id="trade_market_bar" style={{width: '100%', overflow: 'hidden'}}>
              <div>
                <table className='trade-market-table' id="trade_market_con">
                  <tbody>
                  {homeMarketPairDataLength ? this.filte(this.state.homeMarketPairData, this.state.searchValue).map(
                      (v, index) => this.marketContent(v, index)
                  ) : <tr className="nothing-market-pair">
                    <td colSpan="4">{this.intl.get('noDate')}</td>
                  </tr>
                  }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
    )
  }
}