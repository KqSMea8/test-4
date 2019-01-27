import React, {Component} from "react";
import intl from "react-intl-universal";
import {NavLink} from "react-router-dom";
import Button from "@/common/baseComponent/Button";
import SelectCoin from "../../../common/SelectCoin";
import Address from "../../../common/Address";
import History from "../../../common/ChargeHistory";
import ToTrade from "../common/ToTrade";
import {AsyncAll} from '@/core'
import {
  getQueryFromPath,
  formatQueryToPath
} from "@/config/UrlConfig"

export default class Charge extends Component {
  constructor(props) {
    super(props);
    this.setStateFlag = true;
    let {controller} = props;
    controller.setView(this);
    this.intl = intl;
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
      origin: 'exchange'
    };

    //绑定view
    //初始化数据，数据来源即store里面的state
    let {
      walletList,
      assetHistory,
      walletHandle,
      currencyAmount,
      coinAddress
    } = controller.initState;

    this.state = Object.assign(this.state, {
      walletList,
      walletHandle,
      assetHistory,
      currencyAmount,
      coinAddress
    });

    this.deal = controller.dealCoin.bind(controller);
    this.getWalletList = controller.getWalletList.bind(controller);
    this.getCurrencyAmount = controller.getCurrencyAmount.bind(controller);
    this.getCoinAddress = controller.getCoinAddress.bind(controller);
    this.getHistory = controller.getHistory.bind(controller);
    this.getTradePair = controller.getTradePair.bind(controller);
  }

  async componentDidMount() {
    // this.props.sendStatis({
    //   event: 'assetsPV',//操作代码
    //   type: 'deposit',//tab
    // })
    let obj = await this.getWalletList(),
      arr = this.deal(obj.walletList, 'c'),
      query = getQueryFromPath("currency").toUpperCase(),
      currency = query && (arr.includes(query) && query || 'BTC') || "BTC";
    if (!arr.includes(query) && query !== 'BTC') {
      this.props.history.replace({
        pathname: formatQueryToPath('/exchange/charge', {currency: currency.toLowerCase()})
      });
      return
    }
    this.setStateFlag && this.setState({
      currency: currency,
      value: currency
    });

    let result = await AsyncAll(
      [
        this.getTradePair(currency),
        this.getCurrencyAmount(currency),
        this.getCoinAddress(currency),
        this.getHistory({
          page: 0,
          pageSize: this.state.pageSize,
          coinId: obj.walletList[currency.toUpperCase()],
          coinName: currency.toUpperCase(),
          orderType: 1,
          orderStatus: -1,
          startTime: -1,
          endTime: -1
        })]
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
      autoClose: true
    });
  };
  // 隐藏二维码
  hideQrcodeHandle = () => this.setState({showQrcode: false});
  // 显示二维码
  showQrcodeHandle = e => {
    e.nativeEvent.stopImmediatePropagation();
    this.setState({showQrcode: true});
  };
  setValue = value => this.setState({value});
  setCurrency = currency => this.setState({currency});

  // 翻页
  changePageHandle = async (page) => {
    this.setState({page});
    let result = await this.getHistory({
      page: page - 1,
      pageSize: this.state.pageSize,
      coinId: this.state.walletList[this.state.currency],
      coinName: this.state.currency,
      orderType: 1,
      orderStatus: -1,
      startTime: -1,
      endTime: -1
    });
    this.setState(result);
  };

  render() {
    let {totalCount, frozenCount, availableCount} = this.state.currencyAmount;
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
            origin='/exchange/charge'
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
          />
          <ToTrade
            pairArr={this.state.tradePairArr}
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
