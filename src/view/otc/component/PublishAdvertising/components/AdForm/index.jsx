import React from "react";
import ExchangeViewBase from "@/components/ExchangeViewBase.jsx";
import AdType from "./components/AdType";
import SetPrice from "./components/SetPrice";
import SetFloat from "./components/SetFloat";
import Limit from "./components/Limit";
import PayWay from "./components/PayWay";
import Remarks from "./components/Remarks";
import Matters from "./components/Matters";
import Button from "@/common/baseComponent/Button";
import Regular from "@/core/libs/Regular";
import {AsyncAll} from '@/core'

// import PropTypes from 'prop-types';

export default class AdForm extends ExchangeViewBase {
  // static defaultProps = {
  //   state: 0,
  // };
  constructor(props) {
    super(props);
    this.controller = this.props.controller;
    this.controller.setView(this);

    // let {walletList, walletExtract} = controller.initState;
    // this.state = Object.assign(this.state, {walletList, walletExtract});
    this.legalMap = {};
    this.legalMap[this.intl.get("otc-rmb")] = "CNY";
    this.legalMap[this.intl.get("otc-dollar")] = "USD";
    this.state = {
      premium: 0, //溢价设置
      limitPrice: [100, ''], //交易限额
      payWay: 0, //支付方式
      markers: "", //留言
      // adName: '',//广告名称
      // sensitive: false,

      type: 1, //0 购买，1 出售
      sellAmount: 0, //出售数量
      balance: { BTC: 0 },
      coin: "BTC", //交易币种
      legal: this.intl.get("otc-rmb"),
      legalList: [this.intl.get("otc-rmb")], //交易币种选择列表
      coinList: [], //交易币种选择列表

      floatPrice: false, // 是否浮动价格
      price: 0, //报价
      marketPrice: 0,

      lowPrice: '',
      highPrice: '',

      //由资产模块获得的账户列表和币种map
      priceMap: {
        BTC : {cny: 0, usd: 0}
      },
      minPriceMap: {
        BTC : {cny: 0, usd: 0}
      },
      maxPriceMap: {
        BTC : {cny: 0, usd: 0}
      },
      isdisable: false
    };

    this.getOtcAssets = this.controller.getOtcAssets.bind(this.controller);
    this.verifyNewSale = this.controller.verifyNewSale.bind(this.controller)
    this.getPriceList = this.controller.getPriceList.bind(this.controller)
    this.getBoundaryPrice = this.controller.getBoundaryPrice.bind(this.controller)
    this.otcNewSale = this.controller.otcNewSale.bind(this.controller);
  }


  async componentDidMount() {
    let result = await AsyncAll([
      this.getPriceList(),
      this.getOtcAssets(),
      this.getBoundaryPrice('max'),
      this.getBoundaryPrice('min')
    ])
    let unit = this.legalMap[this.state.legal].toLowerCase();
    for (const key in result[1].balance) {
      !result[0].priceMap[key] && (result[0].priceMap[key] = {cny: 0, usd: 0})
      !result[2].maxPriceMap[key] && (result[2].maxPriceMap[key] = {cny: 0, usd: 0})
      !result[3].minPriceMap[key] && (result[3].minPriceMap[key] = {cny: 0, usd: 0})
    }
    let obj = {
      marketPrice: Number((result[0].priceMap[this.state.coin.toLowerCase()][unit] || 0 ).format({number: 'legal', style:{decimalLength: 2}})),
      coinList: Object.keys(result[1].balance).sort((a,b)=> a>b ? 1 : -1)
    }
    this.setState(Object.assign({}, ...result, obj))
  }

  componentDidUpdate(prevProps, prevState) {
    //切换币种更新市场价，报价及溢价率初始化
    if(prevState.coin !== this.state.coin || prevState.legal !== this.state.legal){
      let unit = this.legalMap[this.state.legal].toLowerCase();
      this.setState({
        marketPrice: Number((this.state.priceMap[this.state.coin.toLowerCase()][unit] || 0).format({number: 'legal', style:{decimalLength: 2}})),
        price: (this.state.priceMap[this.state.coin.toLowerCase()][unit] || 0).format({number: 'legal', style:{decimalLength: 2}}),
        premium: 0,
        sellAmount: 0
      })
    }
    if(prevState.type!== this.state.type){
      this.setState({sellAmount: 0})
    }
  }

  cancel = () => {
    this.props.controller.popupController.setState({
      type: 'confirm',
      isShow: true,
      msg: this.intl.get('otc-leave-tip'),
      onConfirm:()=>{
        this.props.history.push("/otc");
        this.props.controller.popupController.setState({isShow: false})
      }
    })
  };

  //生成新的广告
  submit = async () => {
    let {
      coin,
      limitPrice,
      payWay,
      premium,
      price,
      floatPrice,
      type,
      legal,
      highPrice,
      lowPrice,
      markers,
      sellAmount
    } = this.state;

    let obj = {
      currency: coin, //电子币币种,
      money: this.legalMap[legal], //法币币种,
      min: Number(limitPrice[0]), //每笔交易的最小值
      max: Number(limitPrice[1]), //每笔交易的最大值
      payment: payWay, //支付方式 1 支付宝 2 微信 4 银行卡  1+4 =5 支付宝和银行卡，1+2+5=8 三种都支持
      premium: Number(premium), //溢价率,
      price: floatPrice ? type ? lowPrice : highPrice : price,  //固定价格/最低价格
      limit: 10, //付款期限, 分钟
      mode: floatPrice ? 2 : 1, //出售类型: 1 固定; 2 溢价
      type: type ? 1 : 2, //类型: 1 出售; 2 购买
      info: markers, //描述信息
      tradeable: Number(sellAmount) //可交易量
    }
    let msg = this.verifyNewSale(obj)
    if(msg){
      this.controller.popupController.setState({
        type: 'tip3',
        isShow: true,
        msg: msg,
        autoClose: true,
      })
      return;
    };
    obj.price = Number(obj.price)
    this.setState({isdisable: true})
    await this.otcNewSale(obj);
    this.setState({isdisable: false})
  };
  // 改变订单类型
  changeType = type => {
    this.setState({ type });
  };
  // 改变出售（购买）数量
  changeSellAmount = sellAmount => {
    if (!Regular("regDigital", sellAmount.toString()) && sellAmount !== "") return;
    if (this.state.type) {
      let max = this.state.balance[this.state.coin];
      if (sellAmount > max) sellAmount = max;
    }
    this.setState({ sellAmount: sellAmount });
  };
  // 改变法币种类
  changeLegal = legal => {
    this.setState({ legal });
  };
  // 改变数字币种类
  changeCoin = coin => {
    this.setState({ coin });
  };

  changeFloatPrice = value => {
    this.setState({
      floatPrice: value,
      premium: 0,
      price: this.state.marketPrice
    });
  };
  changePrice = price => {
    if (!Regular("regLegal", price.toString()) && price !== "") return;
    this.setState({ price });
  };
  changeLimitPrice = limitPrice => {
    this.setState({ limitPrice });
  };
  changePayWay = payWay => {
    this.setState({ payWay });
  };
  changeMarkers = markers => {
    this.setState({ markers });
  };
  // changeAdName = (adName)=>{
  //   this.setState({adName})
  // }
  changePremium = premium => {
    this.setState({ premium: premium });
  };
  changeLowPrice = lowPrice => {
    if (!Regular("regLegal", lowPrice.toString()) && lowPrice !== "") return;
    let max = this.state.price;
    if (Number(lowPrice) > Number(max)) lowPrice = max;
    this.setState({ lowPrice: lowPrice });
  };
  changeHighPrice = highPrice => {
    if (!Regular("regLegal", highPrice.toString()) && highPrice !== "") return;
    this.setState({ highPrice: highPrice });
  };

  render() {
    const {
      limitPrice,
      premium,
      payWay,
      markers,
      sellAmount,
      balance,
      coin,
      coinList,
      legal,
      legalList,
      type,
      floatPrice,
      price,
      minPriceMap,
      maxPriceMap,
      marketPrice,
      lowPrice,
      highPrice
    } = this.state;
    let unit = this.legalMap[this.state.legal].toLowerCase();
    return (
      <div className="adForm-wrap">
        <h2 className="publish-title">{this.intl.get("otc-publish-ad")}</h2>
        <div className="adForm-content">
          <AdType
            type={type}
            balance={balance}
            sellAmount={sellAmount}
            coin={coin}
            legal={legal}
            coinList={coinList}
            legalList={legalList}
            changeType={this.changeType}
            changeSellAmount={this.changeSellAmount}
            changeLegal={this.changeLegal}
            changeCoin={this.changeCoin}
          />
          <SetPrice
            type={type}
            floatPrice={floatPrice}
            price={price}
            marketPrice={marketPrice}
            marketLowPrice={minPriceMap[coin][unit]}
            marketHighPrice={maxPriceMap[coin][unit]}
            changeFloatPrice={this.changeFloatPrice}
            changePrice={this.changePrice}
            unit={`${unit.toUpperCase()}/${coin}`}
          />
          {floatPrice && (
            <SetFloat
              type={type}
              premium={premium}
              lowPrice={lowPrice}
              highPrice={highPrice}
              changeLowPrice={this.changeLowPrice}
              changeHighPrice={this.changeHighPrice}
              changePrice={this.changePrice}
              legal={this.legalMap[legal]}
              marketPrice={marketPrice}
              changePremium={this.changePremium}
            />
          )}
          <Limit
            limitPrice={limitPrice}
            changeLimitPrice={this.changeLimitPrice}
          />
          <PayWay payWay={payWay} changePayWay={this.changePayWay} />
          <Remarks markers={markers} changeMarkers={this.changeMarkers} />
          {/* <AdName
            adName={adName}
            sensitive={sensitive}
            changeAdName={this.changeAdName}
          /> */}
          <Matters />
        </div>
        <div className="adForm-submit-wrap clearfix">
          <Button
            title={this.intl.get("otc-publish-ad")}
            type="base"
            className="adForm-submit"
            onClick={this.submit}
            disable={this.state.isdisable}
          />
          <Button
            title={this.intl.get("otc-cancel")}
            type="base"
            className="adForm-cancel"
            onClick={this.cancel}
          />
        </div>
      </div>
    );
  }
}
