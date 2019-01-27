import React, {Component} from 'react'
import AdTypeList from './components/AdTypeList'
import AdFilter from './components/AdFilter'
import AdList from './components/AdList'
import ExchangeViewBase from "@/components/ExchangeViewBase.jsx"
import Pagination  from "@/common/baseComponent/Pagination/index.jsx"
import {resolveOrderPath, goOrderPath, goUserPath} from "@/config/UrlConfig"
import StoreHandle from "@/Test"
import './stylus/index.styl'

export default class AdvertisingList extends ExchangeViewBase {
  constructor(props) {
    super(props);
    this.state = {
      adCurrencyCoins: [],
      adCurrencyActive: 'BTC',
      adCurrencyActiveType: 'buy',
      limitValue: '',
      payWay: this.intl.get('otc-pay'),
      digital: 'CNY',
      adList: {},
      page_no: 1,
      count: 0
    };
    this.payWay = {
      1: this.intl.get('otc-pay-al'),
      2: this.intl.get('otc-pay-wechat1'),
      4: this.intl.get('otc-pay-bank'),
      7: this.intl.get('all'),
    };
    this.payment = 7;
    this.authenState = 0;
    this.getPaymentAccounts = [];
    this.adTypeList = [
      {
        adType: {
          name: this.intl.get('buy'),
          type: 'buy'
        },
      },
      {
        adType: {
          name: this.intl.get('otc-sell'),
          type: 'sell'
        },
      }
    ];
    this.typeState = {
      buy: 1,
      sell: 2
    }
    const {controller} = props;
    //绑定view
    controller.setView(this);
  }

  async componentDidMount() {
    let adCurrencyCoins = await this.props.controller.canDealCoins();
    let adList = await this.props.controller.otcSales(adCurrencyCoins[0], 0, 0, 1, 2, 7, 1, 10, 0);
    let getUserAuthData = this.props.controller.userId ? await this.props.controller.userController.getUserAuthData() : null;
    this.authenState = getUserAuthData ? getUserAuthData.userAuth.state : 0;
    let getPaymentAccounts = this.props.controller.token ? await this.props.controller.userController.getPaymentAccounts('getPaymentAccounts', getPaymentAccounts) : {};
    this.getPaymentAccounts = (getPaymentAccounts.paymentList || []).filter(v=> !!v.usable);
    this.setState(
        {
          adCurrencyCoins,
          adCurrencyActive: adCurrencyCoins[0],
          adList,
          count: adList.count,
          page_no: 1
        }
    )
  }
  //更改广告筛选币种
  async changeAdCurrencyActive(type, value) {
    // currency, sale_id, uid, type, price, payment, page_no, count, min, state = 1
    // this.props.controller.changeKey('page_no', 1);
    // this.props.controller.changeKey('currency', value);
    // this.props.controller.changeKey('type', this.typeState[type]);
    let adList = await this.props.controller.otcSales(value, 0, 0, this.typeState[type], 2, 7, 1, 10, 0);
    this.setState({
      adCurrencyActiveType: type,
      adCurrencyActive: value,
      adList,
      count: adList.count,
      page_no: 1,
      limitValue: '',
      payWay: this.intl.get('otc-pay'),
    });
  };

  //最低金额输入
  limitInput(e) {
    let value = e;
    let limitNum = value.split('.');
    if (limitNum.length > 2)
      return
    if (value === '.')
      return
    limitNum[1] = limitNum[1] || '';
    if (!((/^[0-9]*$/).test(limitNum[0]) && (/^[0-9]*$/).test(limitNum[1])))
      return
    if (limitNum[1].length > 2)
      return
    this.setState({
      limitValue: value
    });
    // this.props.controller.changeKey('min', value ? Number(value) : 0)
  }

  //支付方式选中
  paySelect(value) {
    this.setState(
        {payWay: value.name}
    );
    this.payment = value.type;
  }
  //搜索按钮点击
  async searchClick() {
    let limitValue = this.state.limitValue ? Number(this.state.limitValue) : 0;
    let adList = await this.props.controller.otcSales(this.state.adCurrencyActive, 0, 0, this.typeState[this.state.adCurrencyActiveType], 2, this.payment, 1, 10, limitValue);
    // if(!adList.sales){
    //   this.props.controller.popupController.setState({
    //     isShow: true,
    //     type: 'tip2',
    //     msg: '暂无符合条件的广告，请稍后再试。',
    //   });
    //   return
    // }
    this.setState({
      adList,
      count: adList.count,
      page_no: 1
    })
  }
  //重置按钮点击
  async resetClick() {
    this.setState({
      limitValue: '',
      payWay: this.intl.get('otc-pay')
    });
    let adList = await this.props.controller.otcSales('btc', 0, 0, 1, 2, 7, 1, 10, 0);
    this.setState({
      adList,
      adCurrencyActive: 'btc',
      adCurrencyActiveType: 'buy',
      count: adList.count,
      page_no: 1
    })
  }

  async changePage(page_no){
    // currency, sale_id, uid, type, price, payment, page_no, count, min, state = 1
    let adList = await this.props.controller.otcSales(this.state.adCurrencyActive, 0, 0, this.typeState[this.state.adCurrencyActiveType], 2, this.props.controller.store.state.payment, page_no, 10, this.props.controller.store.state.min);
    this.setState({
      adList,
      page_no,
      limitValue: this.props.controller.store.state.min || '',
      payWay: this.payWay[this.props.controller.store.state.payment]
    })
  }
  // 进入确认订单
  enterConfirm(v){
    this.props.controller.enterConfirm({
      id: JSON.stringify(v.id),
      trader: JSON.stringify(v.sid),
      type: this.state.adCurrencyActiveType,
      authenState: this.authenState
    })
  }
  render() {
    const {
      adCurrencyActive,
      adCurrencyActiveType,
      limitValue,
      payWay,
      digital,
      adCurrencyCoins,
      adList,
      page_no,
      count
    } = this.state;
    return (
        <div className='ad-list-content'>
          <div className='ad-list-head'>
            <div className='ad-list-currency'>
              {this.adTypeList.map((v, index) =>
                  (<AdTypeList adCurrency={v.adCurrency}
                               key={index}
                               adCurrencyCoins={adCurrencyCoins}
                               adType={v.adType}
                               adCurrencyActive={adCurrencyActiveType === v.adType.type ? adCurrencyActive : ''}
                               changeAdCurrencyActive={this.changeAdCurrencyActive.bind(this)}
                  />)
              )}
            </div>
            <AdFilter limitValue={limitValue}
                      payWay={payWay}
                      digital={digital}
                      limitInput={this.limitInput.bind(this)}
                      paySelect={this.paySelect.bind(this)}
                      searchClick={this.searchClick.bind(this)}
                      resetClick={this.resetClick.bind(this)}
            />
          </div>
          <AdList
              adCurrencyActiveType={adCurrencyActiveType}
              adList={adList}
              enterConfirm={this.enterConfirm.bind(this)}
          />
          <div className={`ad-list-page`}>
            <Pagination
                total={count || 0}
                showTotal={true}
                pageSize={10}
                onChange={this.changePage.bind(this)}
                showQuickJumper={true}
                currentPage={page_no}/>
          </div>
        </div>
    )
  }
}

