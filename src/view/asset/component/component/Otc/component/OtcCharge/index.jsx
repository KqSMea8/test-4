import React, { Component } from "react";
import intl from "react-intl-universal";
import { NavLink } from "react-router-dom";
import Button from "@/common/baseComponent/Button";
import SelectCoin from "../../../common/SelectCoin";
import Address from "../../../common/Address";
import History from "../../../common/ChargeHistory";
import {AsyncAll} from '@/core'
import {
  getQueryFromPath,
  formatQueryToPath
} from "@/config/UrlConfig"

export default class Charge extends Component {
  constructor(props) {
    super(props);
    this.intl = intl;
    this.setStateFlag = true;
    let { controller } = props;
    controller.setView(this);
    this.state = {
      currency: "BTC",
      value: "BTC",
      address: "",
      showQrcode: false,
      page: 1,
      pageSize: 10,
      searchArr: [],
      tradePairArr: [],
      currencyList: [],
      origin: 'otc'
    };

    //绑定view
    //初始化数据，数据来源即store里面的state
    let {
      otcWalletList,
      otcWalletHandle,
      currencyAmount,
      assetHistory,
      coinAddress
    } = controller.initState;

    this.state = Object.assign(this.state, {
      walletList: otcWalletList,
      walletHandle: otcWalletHandle,
      assetHistory,
      currencyAmount,
      coinAddress
    });

    this.deal = controller.dealCoin.bind(controller);
    this.getOtcWalletList = controller.getOtcWalletList.bind(controller);
    this.getOtcChargeAddress = controller.getOtcChargeAddress.bind(controller);
    this.getOtcCurrencyAmount = controller.getOtcCurrencyAmount.bind(controller);
    this.getOtcHistory = controller.getOtcHistory.bind(controller);
    this.getOtcChargeHistory = controller.getOtcChargeHistory.bind(controller);
  }

  async componentDidMount() {
    // this.props.sendStatis({
    //   event: 'assetsPV',//操作代码
    //   type: 'deposit',//tab
    // })
    let obj = await this.getOtcWalletList(),
    arr = this.deal(obj.walletList, 'c', 'otcWalletHandle'),
    query = getQueryFromPath("currency").toUpperCase(),
    currency = query && (arr.includes(query) && query || 'BTC') || "BTC";
    if(!arr.includes(query) && query!=='BTC') {
      this.props.history.replace({
        pathname: formatQueryToPath('/otc/charge', {currency: currency.toLowerCase()})
      });
      return
    }
    this.setStateFlag && this.setState({
      currency: currency,
      value: currency
    });

    let result = await AsyncAll(
      [
        this.getOtcCurrencyAmount(currency, true),
        this.getOtcChargeAddress(currency),
        this.getOtcChargeHistory({
          "coinName": currency.toLowerCase(),
          "status":-1,
          "page":0,
          "size":this.state.pageSize
        })
      ]
    );
    this.setStateFlag && this.setState(Object.assign({
        currency: currency,
        value: currency,
        currencyList: arr
      },
      obj,
      ...result
    ));
  }

  componentDidUpdate(props, preState) {
    if (this.state.value !== preState.value) {
      this.setState({
        searchArr: this.props.controller.filter(
          this.state.currencyList,
          this.state.value.toUpperCase()
        )
      })
    }
  }

  componentWillUnmount() {
    this.props.controller.initHistory();
    this.setStateFlag = false;
  }

  // 复制到剪贴板
  copy = el => {
    let flag = this.props.controller.copy(el);
    this.props.controller.popupController.setState({
      type: flag ? "tip1" : "tip3",
      msg: flag ? this.intl.get("asset-copySuccess") : this.intl.get("asset-option-failed"),
      isShow: true,
      autoClose:true
    });
  };

  // 隐藏二维码
  hideQrcodeHandle = () => this.setState({ showQrcode: false });

  // 显示二维码
  showQrcodeHandle = e => {
    e.nativeEvent.stopImmediatePropagation();
    this.setState({ showQrcode: true });
  };

  setValue = value => this.setState({ value });

  setCurrency = currency=> this.setState({ currency });

   // 翻页
   changePageHandle = async (page) => {
    this.setState({ page });
    let result =await this.getOtcChargeHistory({
      page: page - 1,
      size: this.state.pageSize,
      coinName: this.state.currency.toLowerCase(),
      status: -1,
    });
    this.setState(result);
  };

  render() {
    let { totalCount, frozenCount, availableCount } = this.state.currencyAmount;
    let address = this.state.coinAddress;
    return (
      <div className="charge">
        <h3>
          {this.intl.get("deposit")}-{this.state.currency}
          <NavLink to={formatQueryToPath(`/${this.state.origin}/balance`)}>
            <Button
              title={this.intl.get('asset-back')}
            />
          </NavLink>
        </h3>
        <div className="charge-content">
          <SelectCoin
            origin='/otc/charge'
            history={this.props.history}
            value={this.state.value}
            currency={this.state.currency}
            setValue={this.setValue}
            setCurrency={this.setCurrency}
            searchArr={this.state.searchArr}
            totalCount={totalCount}
            frozenCount={frozenCount}
            availableCount={availableCount}
          />
          <Address
            currency={this.state.currency}
            address={this.state.address}
            coinAddress={this.state.coinAddress}
            copy={this.copy}
            verifyNumber={address && address.verifyNumber}
            showQrcodeHandle={this.showQrcodeHandle}
            hideQrcodeHandle={this.hideQrcodeHandle}
            copyHandle={this.copyHandle}
            showQrcode={this.state.showQrcode}
            origin={this.state.origin}
          />
          <History
            assetHistory={this.state.assetHistory}
            pageSize={this.state.pageSize}
            changePageHandle={this.changePageHandle}
            page={this.state.page}
            origin={this.state.origin}
          />
        </div>
      </div>
    );
  }
}
