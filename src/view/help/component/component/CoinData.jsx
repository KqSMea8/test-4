import React, { Component } from "react";
import intl from "react-intl-universal";
import Button from "@/common/baseComponent/Button";
const scrollbot = require('simulate-scrollbar');
import {
  getQueryFromPath,
  resolveAssetPath,
  resolveTradePath,
  changeUrlFromPath
} from '@/config/UrlConfig'

export default class CoinData extends Component {
  constructor(props) {
    super(props);
    const { controller } = props;
    controller.marketController.setView(this);
    this.intl = intl;
    this.state = {
      currency: "BTC",
      unit: controller.configData.language === "zh-CN" ? 1 : 0,
      walletList: {},
      walletHandle: {},
      walletData: [],
      tradePair: null,
      tradePairArr: [],
    };
    let { coinInfo } = controller.marketController.initState;
    this.state = Object.assign(this.state, {coinInfo});
    this.getWalletList = controller.getWalletList.bind(controller);//获取币种列表
    this.getCoinInfo = controller.marketController.getCoinInfo.bind(controller.marketController);//获取币种资料
    this.getTradePair = controller.getTradePair.bind(controller);// 获取币种对应交易对
    this.getCoinPair = controller.getCoinPair.bind(controller);// 处理出币种对应的交易对数组
  }

  async componentDidMount() {
    this.customScroll = new scrollbot("#coinListPro");
    let obj1 = await this.getWalletList(),
        arr = Object.keys(obj1.walletList);
    let query = getQueryFromPath("currency").toUpperCase();
    let currency = query && (arr.includes(query) && query || 'BTC') || "BTC";
    if(query!=='BTC' && !arr.includes(query) ){
      this.props.history.replace({
        pathname: this.props.history.location.pathname,
        search: `?currency=${currency.toLowerCase()}`
      });
      return;
    }
    (currency === this.state.currency) && (await this.getCoinInfo((currency).toLowerCase(), true));

    let obj2 = await this.getTradePair(currency);
    this.setState(Object.assign({currency}, obj1, obj2))
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.currency !== this.state.currency) {
      changeUrlFromPath(
        "currency",
        nextState.currency.toLowerCase()
      );
      // this.props.sendStatis({
      //   event: 'currencyPV',//操作代码
      //   type: nextState.currency.toLowerCase(),//tab
      // })
      this.setState({
        coinInfo: {
        "id": 0,            // 币种id
        "name": "",      // 币种名
        "enName": "",   // 币种英文全称
        "cnName": "",  // 币种中文名
        "icon": "",        // 币种符号
        "logo_url": "",//币种logo
        "webSite": [],
        "whitePaper": [],
        "blockSites": [],
        "description": "",  //币种简介
        "descriptionEn": "",  //币种简介
        "releaseTime": 0,  // 发行时间
        "totalVolume": 0,   // 总发行量
        "circulationVolume": 0,  // 流通量
        "priceCN": 0,  // 人民币价格
        "priceEN": 0,  // 美元价格
        "totalValueCN": 0,   // 人民币总市值
        "totalValueEN": 0, // 美元总市值
        "icoPriceCN": 0,              // 人民币ico价格
        "icoPriceEN": 0  // 美元ico价格
      },
      tradePairArr: this.getCoinPair(nextState.tradePair, nextState.currency)
    }, ()=>{
        this.getCoinInfo(nextState.currency.toLowerCase(),true);
      })
    }
    return true;
  }

  componentDidUpdate(preProps, preState) {
    preState.walletData.legnth !== this.state.walletData.length && this.customScroll.refresh();
  }

  render() {
    let {
      name,
      cnName,
      enName,
      icoPriceCN,
      icoPriceEN,
      logo_url,
      releaseTime,
      totalValueCN,
      totalValueEN,
      totalVolume,
      circulationVolume,
      description,
      descriptionEn,
      webSite,
      blockSites,
      whitePaper
    } = this.state.coinInfo;
    return (
      <div className="help-coin clearfix">
        <div className="left">
          <div className="title">{this.intl.get('help-coin-info')}</div>
          <div className="coin-list" id="coinListPro">
            <div>
              <ul>
                {this.props.controller.sort(this.state.walletData, ["n"], 1).map((v, i) => (
                    <li
                      key={i}
                      onClick={() => {
                        this.setState({ currency: v.n.toUpperCase() });
                      }}
                      className={`${ v.n.toUpperCase() === this.state.currency ? "active" : "" }`}
                    >
                      {v.n.toUpperCase() + ` (${this.state.unit ? v.fn : v.en})`}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="right">
          <div className="title">
            <img src={logo_url} alt="" />
            {this.state.currency + ` (${this.state.unit ? cnName : enName})`}
            {this.state.walletHandle[name.toUpperCase()] && this.state.walletHandle[name.toUpperCase()].c ? <a href={resolveAssetPath('/exchange/charge', {currency: this.state.currency.toLowerCase()})}>
              <Button theme='pro' title={this.intl.get("help-coin-deposit")}></Button>
            </a> : ""}
          </div>
          <div className="content">
            <ul className="info clearfix">
              <li>
                {this.intl.get("help-coin-total")}：
                {totalVolume.format({
                  number: "general"
                })}
              </li>
              <li>
                {this.intl.get("help-coin-liquidity")}：
                {circulationVolume.format({ number: "general" })}
              </li>
              <li>
                {this.intl.get("help-coin-market")}：
                {this.state.unit
                  ? `¥${Number(totalValueCN).format({ number: "general" })}`
                  : `$${Number(totalValueEN).format({ number: "general" })}`
                }
              </li>
              <li>
                {this.intl.get("help-coin-date")}：
                {releaseTime.toDate("yyyy-MM-dd")}
              </li>
              <li>
                {this.intl.get("help-coin-price")}：
                {!icoPriceCN ? "--" : this.state.unit ? `¥${Number(icoPriceCN).format({ number: "legal" })}` : `$${Number(icoPriceEN).format({ number: "legal"})}`}
              </li>
              <li>
                {this.intl.get("help-coin-trade")}:
                {this.state.tradePairArr && this.state.tradePairArr.map((v, index) => (
                  <a
                    href={resolveTradePath('', {tradePair: v.name.toLowerCase()})}
                    key={index}
                  >
                    {v.name}
                  </a>
                ))}
              </li>
            </ul>
            <div className="intro">
              <h4>{this.intl.get("help-coin-introduction")}</h4>
              <p>{this.state.unit ? description : descriptionEn}</p>
            </div>
            <div className="button">
              {whitePaper && whitePaper.length ? <Button theme="pro" title={this.intl.get("help-coin-white")} href={whitePaper[0]} target={true} /> : ""}
              {webSite && webSite.length ? <Button theme="pro" title={this.intl.get("help-coin-website")} href={webSite[0]} target={true} /> : ""}
              {blockSites && blockSites.length ? <Button theme="pro" title={this.intl.get("help-coin-browser")} href={blockSites[0]} target={true} /> : ""}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
