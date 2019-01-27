import ExchangeViewBase from '@/components/ExchangeViewBase'
import React, {Component} from "react";
import SelectButton from "@/common/baseComponent/SelectButton/index";
import TradeDealExchange from './TradeDealExchange.jsx';
import TradePopup from '@/common/component/TradePopup/index.jsx'
import Popup from '@/common/baseComponent/Popup/index.jsx'
import {
  YIWEN_ACTIVE,
} from '@/config/ImageConfig'
import {
  resolveHelpPath,
  goUserPath,
  resolveUserPath
} from '@/config/UrlConfig'

export default class TradePlan extends ExchangeViewBase {
  constructor(props) {
    super(props);
    this.state = {
      marketBuyMax: 0,// 市价最大数量
      coinChargeFlag: false, // 币种充币开关
      marketChargeFlag: false, // 币种充币开关
      priceLimit: 6, // 价格精度限制
      numLimit: 2, // 数量精度限制
      marketChangePrice: 0,
      changeBankPriceB: 0, //买入价格输入框实时汇率
      changeBankPriceS: 0,//卖入价格输入框实时汇率
      dbPrePass: false, // 免输资金密码二次点击
      dbPreOrder: true, // 下单二次点击
      dealPopMsg: '',// 弹窗信息
      dealPassType: 'positi',// 弹窗类型倾向
      dealPass: false,// 下单弹窗
      fundPwdIntervalClick: 0, // 免输密码选中状态
      fundPwdIntervalShow: 0, // 免输密码框显示
      fundPwdInterval: '', // 密码间隔
      fundPwdIntervalS: 0,
      funpass: '',
      funpassBuy: '',
      funpassSell: '',
      buyMax: 0, // 买入最大数量
      sellMax: 0,
      buyWallet: 0, //买入可用余额
      sellWallet: 0, //卖出可用余额
      DealEntrustType: 0,// 委托类型
      PassType: '',
      Market: '',
      Coin: '',
      inputValue: 0,
      inputSellValue: 0,
      inputBuyValue: 0,
      inputBuyFlag: false,
      inputSellFlag: false,
      dealType: 0,
      inputSellNum: 0,
      inputBuyNum: 0,
      sellNumFlag: false,
      userVerify: false,
      buyNumFlag: false,
      DealEntrust: [{name: `${this.intl.get('deal-limit')}`, type: 0}, {name: `${this.intl.get('deal-market')}`, type: 1}],
      ControllerProps: [{name: `${this.intl.get('buy')}`, tradeType: 'buy', dealType: 0}, {name: `${this.intl.get('sell')}`, tradeType: 'sell', dealType: 1},],
      UnitSelected: this.intl.get('deal-digital'),
      fundPwdIntervalWindow: [{id: 'pwd_e', value: 0, label: this.intl.get('deal-every')}, {id: 'pwd_2', value: 1, label: this.intl.get('deal-2h')}, {
        id: 'pwd_n',
        value: 2,
        label: this.intl.get('deal-never')
      }],
      fundPwdIntervalWindowPro: [this.intl.get('deal-every'), this.intl.get('deal-2h'), this.intl.get('deal-never')],
      fundPwdIntervalWindowFlag: false,
      fundPwdIntervalSetFlag: false,
      interSelected: this.intl.get('deal-every'), // 资金密码显示选中间隔
      setPass: '',
      dealSurePop: false,//下单确认弹窗
      dealOrderType: 0,//下单类型
      dealSure: [{
        title: this.intl.get('deal-sure-buy'),
        price: this.intl.get('deal-sure-buy-price'), volume: this.intl.get("deal-sure-buy-volume")
      }, {
        title: this.intl.get('deal-sure-sell'),
        price: this.intl.get("deal-sure-sell-price"), volume: this.intl.get("deal-sure-sell-volume")
      }],
      dealSurePriceL: 0, //买入法币价格
      dealSurePriceD: 0, //买入数字币价格
      dealSureVolume: 0, //买入数量
      dealSureFlag: false, // 下单确认
      dealBank: {},
      buyPointer: 0,//买入滑动点数
      sellPointer: 0,//卖出滑动点数
      pwdPop: false, // 密码弹窗
      introPop: false, //引导设置弹窗
    };
    const {controller} = this.props;
    //绑定view
    controller.setView(this);
    //初始化数据，数据来源即store里面的state
    this.state = Object.assign(this.state, controller.initState);
    this.setPriceInit = controller.setPriceInit.bind(controller);
    this.dealTrade = controller.dealTrade.bind(controller)
    this.changeUnit = controller.changeUnit.bind(controller);
    this.changeMaxNum = controller.changeMaxNum.bind(controller);
  }
  
  componentWillMount() {
  }
  
  componentDidMount() {
    this.props.controller.getCoinMinTrade();
    this.props.controller.getCharge();
  }

//切换市价委托/限价委托
  changeEntrustType(v) {
    this.setState({
      DealEntrustType: v.type,
      inputBuyNum: 0,
      inputSellNum: 0,
      buyPointer: 0,
      sellPointer: 0
    })
  }
  
  numInput(dealType, type, e) {
    let diffArr = [{
      inputValue: 'inputBuyValue',
      wallet: 'buyWallet',
      setValue: 'inputBuyNum',
      max: 'buyMax',
      changeBank: 'changBankPriceB',
      marketMax: 'marketBuyMax'
    }, {
      inputValue: 'inputSellValue',
      wallet: 'sellWallet',
      setValue: 'inputSellNum',
      max: 'sellMax',
      changeBank: 'changBankPriceS',
      marketMax: 'marketSellMax'
    }];
    let maxNum = this.state.DealEntrustType ? this.props.controller.store.state[diffArr[dealType].marketMax] : this.props.controller.store.state[diffArr[dealType].max];
    let priceValue = this.state.DealEntrustType ? this.props.controller.store.state.marketChangePrice : (this.state[diffArr[dealType].inputValue]);
    let value = e.target.value;
    let limitNum = value.split('.');
    if (limitNum.length > 2)
      return
    if (value === '.')
      return
    limitNum[1] = limitNum[1] || '';
    if (maxNum < this.props.controller.store.state.coinMin) {
      this.setState(
          {
            dealPopMsg: this.intl.get('deal-num-limited'),
            dealPassType: 'passive',// 弹窗类型倾向
            dealPass: true,// 下单弹窗
          }
      )
      return
    }
    if (!((/^[0-9]*$/).test(limitNum[0]) && (/^[0-9]*$/).test(limitNum[1])))
      return
    let numLimit = this.props.controller.store.state.volumeAccuracy;
    let reg = new RegExp(`^[0-9]{0,${numLimit}}$`);
    let flag = type ? reg.test(limitNum[1]) : true;
    if (!flag)
      return
    let numValue = value > maxNum ? maxNum.toFixedWithoutUp(numLimit) : value;
    let pointer = Math.floor(value / maxNum / 0.25);
    if (type) {
      dealType ? (this.setState({inputSellNum: numValue})) : (this.setState({inputBuyNum: numValue}))
      !dealType && (numValue >= maxNum.toFixedWithoutUp(numLimit) ? ((this.props.controller.store.state.buyNumFlag = true)) : (this.props.controller.store.state.buyNumFlag = false))
    }
    else {
      dealType ? (this.setState({inputSellNum: Number(numValue).toFixedWithoutUp(numLimit)})) : (this.setState({inputBuyNum: Number(numValue).toFixedWithoutUp(numLimit)}));
      !dealType && (numValue >= maxNum.toFixedWithoutUp(numLimit) ? ((this.props.controller.store.state.buyNumFlag = true)) : (this.props.controller.store.state.buyNumFlag = false))
    }
    dealType ? (this.setState({sellPointer: pointer})) : (this.setState({buyPointer: pointer}))
  }
  
  priceInput(dealType, e) {
    let value = e.target.value;
    let arr = value.split('.');
    if (arr.length > 2)
      return;
    arr[1] = arr[1] || '';
    if (!((/^[0-9]*$/).test(arr[0]) && (/^[0-9]*$/).test(arr[1])))
      return;
    let priceLimit = this.props.controller.store.state.priceAccuracy;
    let reg = new RegExp(`^[0-9]{0,${priceLimit}}$`);
    let flag = reg.test(arr[1]);
    if (this.state.PriceUnit === 'CNY' || this.state.PriceUnit === 'USD') {
      flag = (/^[0-9]{0,2}$/).test(arr[1])
    }
    if (flag) {
      dealType ? (this.setState({
            inputSellValue: value,
            inputSellFlag: true,
            dealType
          })) :
          (this.setState({
            inputBuyValue: value,
            inputBuyFlag: true,
            dealType
          }));
      !dealType && (this.props.controller.store.state.inputBuyFlag = true);
      value && this.changeMaxNum(dealType, value)
    }
    
  }
  
  passInput(v, e) {
    if (!v) {
      this.setState({funpassBuy: e.target.value})
      return
    }
    this.setState({funpassSell: e.target.value})
  }
  
  setFunPwdIntervalShow(v) {
    this.setState(
        {
          fundPwdIntervalS: v.value,
          fundPwdIntervalClick: v.value
        }
    )
  }
  
  changeSetPass(e) {
    this.setState(
        {
          setPass: e.target.value,
          funpass: e.target.value,
        }
    )
  }
  
  freePwd() {
    this.setState({
      fundPwdIntervalWindowFlag: true
    })
  }
  
  // 设置资金密码间隔
  async setPassSubmit() {
    let type, pwd;
    type = this.state.fundPwdIntervalClick;
    pwd = this.state.setPass;
    if (pwd === '') {
      this.setState(
          {
            dealPopMsg: this.intl.get('deal-pass-empty'),
            dealPassType: 'passive',// 弹窗类型倾向
            dealPass: true,
          }
      );
      return 1
    }
    this.setState(
        {
          dbPrePass: true
        }
    )
    let result = await this.props.controller.userController.setFundPwdInterval(type, pwd);
    let interSelected = this.intl.get('deal-every');
    type === 1 && (interSelected = this.intl.get('deal-2h'));
    type === 2 && (interSelected = this.intl.get('deal-never'));
    result === null && this.setState(
        {
          fundPwdInterval: type,
          dbPrePass: false,
          interSelected
        }
    );
    result && this.setState(
        {
          dealPass: true,
          dealPopMsg: result.msg,
          dealPassType: 'passive',// 弹窗类型倾向
          dbPrePass: false
        }
    );
    return result
  }
  
  async dealTradeSure(orderType, e) {
    e.preventDefault();
    e.stopPropagation();
    let sellPriceValue = this.state.inputSellFlag ? (this.state.inputSellValue) : (this.state.priceBank[this.state.PriceUnit] || this.state.priceInit);
    let buyPriceValue = this.state.inputBuyFlag ? (this.state.inputBuyValue) : (this.state.priceBank[this.state.PriceUnit] || this.state.priceInit);
    let emptyCharge = orderType === 'buy' ? this.state.funpassBuy : this.state.funpassSell;
    // let funPwdInterval = await this.props.controller.getFundPwdInterval();
    let params = {
      "orderType": orderType === 'buy' ? 0 : 1,//0买 1 卖
      "priceType": this.state.DealEntrustType,//0限价  1市价
      "price": this.state.DealEntrustType ? 0 : Number(orderType === 'buy' ? buyPriceValue : sellPriceValue),//价格
      "count": Number(orderType === 'buy' ? this.state.inputBuyNum : this.state.inputSellNum),//数量
      // "interval": funPwdInterval || 0,// 0:每次都需要密码 1:2小时内不需要 2:每次都不需要
      "priceUnit": this.state.PriceUnit === 'CNY' && 1 || (this.state.PriceUnit === 'USD' && 2 || 0)//计价单位  0数字币  1人民币 2美元
      // "priceUnit": 0
    };
    // if(funPwdInterval === -1){
    //   this.setState(
    //       {
    //         dealPopMsg: this.intl.get("pleaseSetFund"),
    //         dealPassType:'positi',// 弹窗类型倾向
    //         dealPass:true,// 下单弹窗
    //       }
    //   );
    //   return
    // }
    //   价格判断不能为空
    if (!params.price && params.priceType === 0) {
      this.setState(
          {
            dealPopMsg: this.intl.get("noEmptyPrice"),
            dealPassType: 'passive',// 弹窗类型倾向
            dealPass: true,// 下单弹窗
            inputSellNum: 0, // 数量清空
            inputBuyNum: 0,
          }
      )
      return
    }
    // 数量不能为最小交易量
    if (Number(orderType === 'buy' ? this.state.inputBuyNum : this.state.inputSellNum) < this.state.coinMin) {
      this.setState(
          {
            dealPopMsg: this.intl.get("noLowerMiniTradeNum") + this.state.coinMin + this.state.NumUnit.toUpperCase(),
            dealPassType: 'passive',// 弹窗类型倾向
            dealPass: true,// 下单弹窗
          });
      return
    }
    // if(params.interval === 0 && emptyCharge === ''){
    //   this.setState(
    //       {
    //         dealPopMsg: this.intl.get("deal-pass-empty"),
    //         dealPassType:'passive',// 弹窗类型倾向
    //         dealPass:true,// 下单弹窗
    //       }
    //   )
    //   return
    // }
    // if((params.priceUnit !== 0) && this.state.DealEntrustType === 0 ){
    //   let sellPriceValue = this.state.inputSellFlag ? (this.state.inputSellValue) : (this.state.priceBank[this.state.PriceUnit] || this.state.priceInit);
    //   let buyPriceValue = this.state.inputBuyFlag ? (this.state.inputBuyValue) : (this.state.priceBank[this.state.PriceUnit] || this.state.priceInit);
    //   let legalPrice = Number(orderType === 'buy' ? buyPriceValue : sellPriceValue);
    //   let transBank = this.state.dealBank;
    //   let digitalPrice = this.state.PriceUnit === 'CNY' ? Number(Number(legalPrice).div(transBank.priceCN)) : Number(Number(legalPrice).div(transBank.priceEN));
    //   this.setState(
    //       {
    //         dealOrderType: orderType === 'buy' ? 0 : 1,
    //         dealSurePop: true,
    //         dealSurePriceL: legalPrice,
    //         dealSurePriceD: digitalPrice,
    //         dealSureVolume: Number(orderType === 'buy' ? this.state.inputBuyNum : this.state.inputSellNum)
    //       }
    //   );
    //   return
    // }
    // this.dealTrade(orderType,e)
    this.pwdConfirm(orderType)
  }
  
  //资金密码输入弹窗
  async pwdConfirm(orderType) {
    if (this.props.controller.store.state.dbPreOrder)
      return
    this.props.controller.store.state.dbPreOrder = true;
    let funPwdInterval = await this.props.controller.getFundPwdInterval();
    if (funPwdInterval === -1) {
      this.setState(
          {
            introPop: true
          }
      )
      return
    }
    if (funPwdInterval === 0) {
      this.setState(
          {
            interSelected: this.intl.get('deal-every'),
            pwdPop: true,
            dealOrderType: orderType === 'buy' ? 0 : 1,
          })
      return
    }
    let priceUnit = this.state.PriceUnit;
    if ((funPwdInterval === 1 || funPwdInterval === 2) && (priceUnit === 'CNY' || priceUnit === 'USD') && this.state.DealEntrustType === 0) {
      let sellPriceValue = this.state.inputSellFlag ? (this.state.inputSellValue) : (this.state.priceBank[priceUnit] || priceUnit);
      let buyPriceValue = this.state.inputBuyFlag ? (this.state.inputBuyValue) : (this.state.priceBank[priceUnit] || priceUnit);
      let legalPrice = Number(orderType === 'buy' ? buyPriceValue : sellPriceValue);
      let transBank = this.state.dealBank;
      let digitalPrice = priceUnit === 'CNY' ? Number(Number(legalPrice).div(transBank.priceCN)) : Number(Number(legalPrice).div(transBank.priceEN));
      this.setState(
          {
            dealOrderType: orderType === 'buy' ? 0 : 1,
            dealSurePop: true,
            dealSurePriceL: legalPrice,
            dealSurePriceD: digitalPrice,
            dealSureVolume: Number(orderType === 'buy' ? this.state.inputBuyNum : this.state.inputSellNum)
          }
      );
      return
    }
    this.dealTrade(orderType)
    
  }
  
  //资金密码弹窗确认
  async funpassSubmit(e) {
    e.nativeEvent.stopImmediatePropagation();
    if (this.props.controller.store.state.dbPreOrderF)
      return
    this.props.controller.store.state.dbPreOrderF = true;
    let priceUnit = this.state.PriceUnit;
    let orderType = this.state.dealOrderType ? 'sell' : 'buy';
    let type = this.state.fundPwdIntervalClick;
    let result = null;
    if (type || (priceUnit === 'CNY' || priceUnit === 'USD')) {
      result = await this.setPassSubmit();
    }
    if (result) {
      this.props.controller.store.state.dbPreOrderF = false;
      return
    }
    
    // if(result)
    //   return
    if ((priceUnit === 'CNY' || priceUnit === 'USD') && this.state.DealEntrustType === 0) {
      let sellPriceValue = this.state.inputSellFlag ? (this.state.inputSellValue) : (this.state.priceBank[priceUnit]);
      let buyPriceValue = this.state.inputBuyFlag ? (this.state.inputBuyValue) : (this.state.priceBank[priceUnit]);
      let legalPrice = Number(orderType === 'buy' ? buyPriceValue : sellPriceValue);
      let transBank = this.state.dealBank;
      let digitalPrice = priceUnit === 'CNY' ? Number(Number(legalPrice).div(transBank.priceCN)) : Number(Number(legalPrice).div(transBank.priceEN));
      this.setState(
          {
            dealOrderType: orderType === 'buy' ? 0 : 1,
            pwdPop: false,
            dealSurePop: true,
            dealSurePriceL: legalPrice,
            dealSurePriceD: digitalPrice,
            dealSureVolume: Number(orderType === 'buy' ? this.state.inputBuyNum : this.state.inputSellNum)
          }
      );
      return
    }
    this.dealTrade(orderType, e)
    // this.setState(
    //     {
    //       pwdPop: false
    //     }
    // )
    // !this.state.pwdPop && this.dealTrade(orderType,e)
  }

// 密码时限设置选择
  changeInterSelected(e) {
    // this.state.fundPwdIntervalClick
    let typeIndex = this.state.fundPwdIntervalWindowPro.findIndex(v => v === e);
    this.setState(
        {
          interSelected: e,
          fundPwdIntervalClick: typeIndex
        }
    )
  }
  
  //法币下单确认弹窗
  async dealTradeConfirm(e) {
    e.preventDefault();
    e.stopPropagation();
    if (this.props.controller.store.state.dbPreOrderD)
      return
    this.props.controller.store.state.dbPreOrderD = true;
    let orderType = this.state.dealOrderType ? 'sell' : 'buy';
    this.setState({dealSurePop: false},);
    this.dealTrade(orderType, e)
  }
  
  //滑动尺节点点击
  rangeItemsSelect(dealType, index, e) {
    e.preventDefault();
    e.stopPropagation();
    let diffArr = [{
      max: 'buyMax',
      marketMax: 'marketBuyMax'
    }, {
      max: 'sellMax',
      marketMax: 'marketSellMax'
    }];
    
    !dealType && (this.props.controller.store.state.buyNumFlag = false);
    let maxNum = this.state.DealEntrustType ? this.props.controller.store.state[diffArr[dealType].marketMax] : this.props.controller.store.state[diffArr[dealType].max];
    let numValue = maxNum * 0.25 * index;
    let numLimit = this.props.controller.store.state.volumeAccuracy;
    if (maxNum === 0)
      return
    if (index && (maxNum < this.props.controller.store.state.coinMin || numValue < this.props.controller.store.state.coinMin)) {
      this.setState(
          {
            dealPopMsg: this.intl.get('deal-num-limited'),
            dealPassType: 'passive',// 弹窗类型倾向
            dealPass: true,// 下单弹窗
          }
      )
      return
    }
    dealType ? (this.setState({inputSellNum: Number(numValue).toFixedWithoutUp(numLimit), sellPointer: index})) : (this.setState({
      inputBuyNum: Number(numValue).toFixedWithoutUp(numLimit),
      buyPointer: index
    }));
    dealType ? (index === 4 && this.setState({sellNumFlag: true})) : (index === 4 && (this.props.controller.store.state.buyNumFlag = true))
  }
  
  render() {
    let language = this.props.controller.configController.language
    // console.log('交易市场', this.state)
    return (
        <div className='trade-pro-plan-deal'>
          <div className='deal-entrust'>
            {this.state.DealEntrust.map((v, index) => {
              return (
                  <span key={index} className={this.state.DealEntrustType === v.type ? 'entrust-active' : ''}
                        onClick={this.changeEntrustType.bind(this, v)}>{v.name}</span>
              )
            })}
            <div style={{float: 'right', marginRight: '10px'}} className="pop-parent">
              <SelectButton
                  title={this.state.UnitSelected}
                  type="tradePro"
                  className="select"
                  valueArr={[`${this.intl.get('deal-digital')}`, "CNY", "USD"]}
                  onSelect={(e) => {
                    this.changeUnit(e, this.intl.get('deal-digital'))
                  }}
              />
              <em className={`${language === 'zh-CN' ? '' : 'em-en'} pop-trade-children leftpop-trade-children`}>{this.intl.get("deal-price-tip")}</em>
            </div>
          
          </div>
          <div className='trade-deal-exchanged'>
            {this.state.ControllerProps.map((v, index) => {
              return (
                  <TradeDealExchange PriceUnit={this.state.PriceUnit} NumUnit={this.state.NumUnit} key={index}
                                     ControllerProps={v} steadUnitP={this.state.Market} steadUnitN={this.state.Coin}
                                     prices={this.state.prices} Market={this.state.Market}
                                     avalue={this.state.inputSellFlag ? (this.state.inputSellValue) : (this.state.priceBank[this.state.PriceUnit] || this.state.priceInit)}
                                     bvalue={this.state.inputBuyFlag ? (this.state.inputBuyValue) : (this.state.priceBank[this.state.PriceUnit] || this.state.priceInit)}
                                     sellNum={this.state.inputSellNum}
                                     buyNum={this.state.inputBuyNum}
                                     buyMax={this.props.controller.store.state.buyMax}
                                     sellMax={this.props.controller.store.state.sellMax}
                                     sellPointer={this.state.sellPointer}
                                     buyPointer={this.state.buyPointer}
                                     marketBuyMax={this.props.controller.store.state.marketBuyMax}
                                     marketSellMax={this.props.controller.store.state.marketSellMax}
                      // funpass={this.state.funpass}
                                     funpassBuy={this.state.funpassBuy}
                                     funpassSell={this.state.funpassSell}
                                     wallet={index ? this.state.sellWallet : this.state.buyWallet}
                                     priceInput={this.priceInput.bind(this)}
                                     numInput={this.numInput.bind(this)}
                                     dealTrade={this.dealTradeSure.bind(this)}
                                     passInput={this.passInput.bind(this)}
                                     rangeItemsSelect={this.rangeItemsSelect.bind(this)}
                                     fundPwdInterval={this.state.fundPwdInterval}
                                     fundPassVerify={this.state.fundPwdInterval < 0}
                                     DealEntrustType={this.state.DealEntrustType}
                                     freePwd={this.freePwd.bind(this)}
                                     coinChargeFlag={this.state.coinChargeFlag}
                                     marketChargeFlag={this.state.marketChargeFlag}
                                     numLimit={this.state.numLimit}
                                     isLogin={this.props.controller.userController.userId}
                  />
              
              )
            })}
          </div>
          <div className='deal-pop'>
            {this.state.dealPass && <TradePopup theme={this.state.dealPassType} msg={this.state.dealPopMsg} onClose={() => {
              this.setState({dealPass: false});
            }} className='deal-pop-location' type='ico'/>}
          </div>
          <div className='deal-exchange-pop' style={{display: this.state.dealSurePop ? 'block' : 'none'}}>
            <div className='deal-exchange-pop-detail'>
              <div className='deal-exchange-pop-title'>
                <h3>{this.state.dealSure[this.state.dealOrderType].title}</h3>
                <em onClick={() => {
                  this.props.controller.store.state.dbPreOrderD = false;
                  this.props.controller.store.state.dbPreOrder = false;
                  this.props.controller.store.state.dbPreOrderF = false;
                  this.setState({dealSureFlag: false, dealSurePop: false, fundPwdIntervalClick: 0, setPass: ''})
                }}> </em>
              </div>
              <div className='deal-exchange-pop-content'>
                <p>{this.state.dealSure[this.state.dealOrderType].price}:
                  <span style={{color: this.state.dealOrderType ? '#F25C48' : '#24B36A'}}>{Number(this.state.dealSurePriceD.toFixed(this.props.controller.store.state.priceAccuracy))} </span>
                  <em>{`(${this.intl.get('deal-convert-into')}${this.state.dealSurePriceL.format({
                    number: 'legal',
                    style: {name: this.state.PriceUnit && this.state.PriceUnit.toLowerCase()}
                  })}${this.state.PriceUnit})`}</em>
                </p>
                <p>{this.state.dealSure[this.state.dealOrderType].volume}:
                  <span
                      style={{color: this.state.dealOrderType ? '#F25C48' : '#24B36A'}}>{this.state.dealSureVolume.formatFixNumberForAmount(this.props.controller.store.state.volumeAccuracy, false)}</span>
                  <em>{this.state.NumUnit.toUpperCase()}</em>
                </p>
                <div className='deal-exchange-pop-button'>
                  <button onClick={this.dealTradeConfirm.bind(this)}>{this.intl.get('deal-sure-order')}</button>
                  {/*<button className='deal-exchange-pop-exit' onClick={() => {this.setState({dealSureFlag: false,dealSurePop: false,})}}>{this.intl.get('cance')}</button>*/}
                </div>
              </div>
            </div>
          </div>
          {this.state.pwdPop && (<div className='funpass-pop'>
            <div className='funpass-pop-detail'>
              <div className='funpass-pop-title'>
                <h3 className={language === 'zh-CN' ? '' : 'h3-en'}>{this.intl.get('deal-inputpwd')}</h3>
                <div className='funpass-set clearfix'>
                  <b className="pop-parent">
                    <img src={YIWEN_ACTIVE}/>
                    <em className="pop-trade-children uppop-trade-children">{this.intl.get('deal-intro')}</em>
                  </b>
                  <span>{this.intl.get('user-passLimit')}</span>
                  <SelectButton
                      title={this.state.interSelected}
                      type="tradePro"
                      className={language === 'zh-CN' ? '' : 'select-fund-en'}
                      valueArr={this.state.fundPwdIntervalWindowPro}
                      onSelect={(e) => {
                        this.changeInterSelected(e)
                      }}
                  />
                  <button onClick={() => {
                    this.props.controller.store.state.dbPreOrder = false;
                    this.setState(
                        {
                          pwdPop: false,
                          interSelected: this.intl.get('deal-every'),
                          fundPwdIntervalClick: 0,
                          setPass: ''
                        })
                  }}></button>
                </div>
              </div>
              <div className='funpass-pop-input'>
                <h4>{this.intl.get('fundPass')}</h4>
                <input type="password" onChange={this.changeSetPass.bind(this)} value={this.state.setPass} autoFocus/>
                <p>
                  <a href={resolveUserPath()}>{this.intl.get('login-forget')}</a>
                </p>
              </div>
              <div className='funpass-submit'>
                <button onClick={this.funpassSubmit.bind(this)}>{this.intl.get('ok')}</button>
              </div>
            </div>
          </div>)}
          {this.state.introPop && <Popup
              type="confirm"
              icon="warning"
              confirmText={this.intl.get('deal-go')}
              cancelText={this.intl.get('cance')}
              className="trade-intro"
              autoClose={false}
              msg={this.intl.get('deal-set')}
              onClose={() => {
                this.setState({introPop: false})
              }}
              onConfirm={() => {
                goUserPath('/safe')
              }}
          />}
        </div>)
  }
}