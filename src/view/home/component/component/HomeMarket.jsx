import React, { Component } from "react";
import intl from "react-intl-universal";
import {goTradePath} from '@/config/UrlConfig'
import Input from '@/common/baseComponent/Input/index.jsx'
import {
  HOME_MARKET_SELECT_NORMAL,
  HOME_FAVORTIES_SELECTED_PRO,
  HOME_FAVORTIES_NORMAL_PRO,
  TRADE_SEARCH
} from '@/config/ImageConfig';


export default class HomeMarket extends Component {
  constructor(props) {
    super(props);
    this.name = 'homeMarket';
    this.intl = intl;
    this.state = {
      searchValue: '',
      sortIndex: 0,
      sortImg: HOME_MARKET_SELECT_NORMAL,
      searchRealt: [],
      collectActive: false, // 控制收藏区的active
      newMarketPair: [],
      mainMarketPair: [],
      searchInputActive: false,
      marketTableHead: [
        {name: `${this.intl.get('home-markets')}`, sortValue: '', class: 'left-th'},
        {
          name: `${this.intl.get('home-lastPrice')}`,
          sortValue: ['price'],
          type: 1,
          sortDefault: 'turnover',
          class: 'left-th'
        },
        {
          name: this.intl.get('home-change'),
          sortValue: ['rise'],
          type: 1,
          sortDefault: 'turnover',
          class: 'right-th'
        },
        {
          name: `24h${this.intl.get('home-priceHighest')}`,
          sortValue: ['highestPrice'],
          type: 1,
          sortDefault: 'turnover',
          class: 'right-th'
        },
        {
          name: `24h${this.intl.get('home-priceLowest')}`,
          sortValue: ['lowestPrice'],
          type: 1,
          sortDefault: 'turnover',
          class: 'right-th'
        },
        {
          name: `24h${this.intl.get('total')}`,
          sortValue: ['turnover'],
          type: 1,
          sortDefault: 'turnover',
          class: 'right-th'
        }
      ],
      isPro: true
    };
    const {controller} = this.props;
    //绑定view
    controller.setView(this);
    //初始化数据，数据来源即store里面的state
    this.state = Object.assign(this.state, controller.initState);
    // console.log(this.state)
    //绑定方法
    this.marketDataHandle = controller.marketDataHandle.bind(controller);
    this.changeMarket = controller.changeMarket.bind(controller); // 点击其他市场
    this.collectMarket = controller.collectMarket.bind(controller); // 点击收藏
    // this.getData = controller.getData.bind(controller)
    this.pairSort = controller.pairSort.bind(controller); // 排序
    this.filte = controller.filte.bind(controller); // 筛选
    this.addCollect = controller.addCollect.bind(controller); // 添加收藏
    this.joinHome = controller.joinHome.bind(controller); // 加入房间
    this.clearRoom = controller.clearRoom.bind(controller); //推出房间
    this.clearHistory = controller.clearHistory.bind(controller); //推出房间
    this.marketContent = this.marketContent.bind(this)
  }

  marketContent(v, index) { // 市场内容
    return (
      <tr key={index} className="table-data" onClick={() => {goTradePath('', {tradePair: v.tradePairName})}}>
        <td className="left-td">
            <img src={`${v.isFavorite ? HOME_FAVORTIES_SELECTED_PRO : HOME_FAVORTIES_NORMAL_PRO}`}
                 className="favorite-img"
                 onClick={e => this.addCollect(v, index, e)}/>
            {v.tradePairName.toUpperCase()}
        </td>
        <td className="left-td">
            <span
              className={`${v.updown && (v.updown > 0 && "market-up" || "market-down")}`}>{Number(v.price).format({number: 'digital'}) || 0}</span>/
            <span
              className="second-span">{this.props.controller.language === 'zh-CN' && Number(Number(v.priceCN).multi(v.price) || 0).format({
              number: 'legal',
              style: {name: 'cny'}
            }) || Number(Number(v.priceEN).multi(v.price) || 0).format({number: 'legal', style: {name: 'usd'}})}</span>
        </td>
        <td>
            <span className={`market-updown ${v.rise < 0 ? 'down-after' : 'up-after'}`}>{Number(v.rise || 0).toPercent()}</span>
        </td>
        <td>
            {Number(v.highestPrice) && Number(v.highestPrice).format() || '--'}
        </td>
        <td>
            {Number(v.lowestPrice) && Number(v.lowestPrice).format() || '--'}
        </td>
        <td>
            {Number(v.turnover) && Number(v.turnover).formatTurnover() || '--'}
        </td>
      </tr>
    )
  }

  componentDidMount() {
    //注册http数据
    this.marketDataHandle();
    //清除websocket历史
    this.clearHistory()
    //进入home
    this.joinHome();
  }

  componentWillUnmount() {
    this.clearRoom()
  }

  render() {
    const {controller} = this.props;
    let newMarketPairLength = this.filte(this.state.newMarketPair, this.state.searchValue).length,
      mainMarketPairLength = this.filte(this.state.mainMarketPair, this.state.searchValue).length
    return (
      <div className='home-market-pro'>
        <div className="market-nav clearfix">
          <ul className="clearfix">
            <li className={`${this.state.collectActive ? 'home-market-item-active' : ''} option-li`} onClick={this.collectMarket}>
              <img src={HOME_FAVORTIES_NORMAL_PRO} className="optional-img" alt=""/>
              {this.intl.get('optional')}
            </li>
            {this.state.marketDataHandle.map((v, index) => {
              return (
                <li key={index} onClick={this.changeMarket.bind(this, v)}
                    className={`home-market-item${this.state.market.toUpperCase() === v.toUpperCase() ? '-active' : ''}`}>
                  {v.toUpperCase()}
                </li>
              )
            })}
          </ul>
          <div className="search_wrap clearfix">
            <Input
              className={this.state.searchInputActive ? 'input-active' : ''}
              onEnter={() => {
                this.filte(this.state.homeMarketPairData, this.state.searchValue)
              }}
              value={this.state.searchValue}
              onFocus={() => {this.setState({searchInputActive: true})}}
              onBlur={() => {this.setState({searchInputActive: false})}}
              onInput={value => {
                (/^[a-zA-Z]*$/).test(value) && this.setState({searchValue: value})
              }}/>
            <div className={`search-btn ${this.state.searchInputActive ? 'btn-active' : ''}`}><img src={TRADE_SEARCH} alt=""/></div>
          </div>
        </div>
        <div className='home-market-con'>
          <table>
            <thead>
            <tr>
              {/*<th className={`left-th ${newMarketPairLength === 0 && mainMarketPairLength === 0 ? 'none-th' : ''}`}></th>*/}
              {this.state.marketTableHead.map((v, index) => {
                return (<th key={index}
                            className={`${v.sortValue ? 'sort-img-li' : ''} ${v.class}`}>
                  <b onClick={this.pairSort.bind(this, v, index)}>{v.name}
                    <img src={this.state.sortIndex === index ? this.state.sortImg : HOME_MARKET_SELECT_NORMAL} alt=""
                         className={`${v.sortValue ? '' : 'hide'}`}/></b>
                </th>)
              })}
              {/*<th>{this.intl.get('market-change7D')}</th>*/}
            </tr>
            </thead>
            {mainMarketPairLength && <tbody className="main-tbody">
            <tr className="zone-name">
              <td colSpan="7"><p>{this.intl.get('home-market-main')}</p></td>
            </tr>
            {mainMarketPairLength ? this.filte(this.state.mainMarketPair, this.state.searchValue).map((v, index) =>
              this.marketContent(v, index)
            ) : <tr className="nothing-market-pair">
              <td colSpan="7">{this.intl.get('noDate')}</td>
            </tr>}
            </tbody> || null}

            {newMarketPairLength && <tbody>
            <tr className={`zone-name ${mainMarketPairLength ? 'new-zone-name' : ''}`}>
              <td colSpan="7"><p>{this.intl.get('home-market-new')}</p></td>
            </tr>
            {newMarketPairLength ? this.filte(this.state.newMarketPair, this.state.searchValue).map((v, index) =>
              this.marketContent(v, index)
            ) : <tr className="nothing-market-pair">
              <td colSpan="7">{this.intl.get('noDate')}</td>
            </tr>}
            </tbody> || null}

            {newMarketPairLength === 0 && mainMarketPairLength === 0 && <tbody>
            <tr className="nothing-market-pair">
              <td colSpan="7">{this.intl.get('noDate')}</td>
            </tr>
            </tbody> || null}
          </table>
        </div>
      </div>
    )
  }
}