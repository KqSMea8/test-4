import React, { Component } from "react";
import intl from "react-intl-universal";
import Transfer from "../../../../common/Transfer";
import SafePass from '@/common/component/SafePass/'
import Button from "@/common/baseComponent/Button";
import Input from "@/common/baseComponent/Input";
import Regular from "@/core/libs/Regular";
import {
  formatQueryToPath
} from "@/config/UrlConfig"
import { HOME_MARKET_SELECT_BOTTOM, HOME_MARKET_SELECT_TOP, HOME_MARKET_SELECT_NORMAL } from "@/config/ImageConfig";

export default class Wallets extends Component {
  constructor(props) {
    super(props);
    let { controller } = this.props;
    this.intl = intl;
    this.state = {
      value: "",
      inputValue: "",
      coinName: 2,
      totalCount: 2,
      availableCount: 2,
      frozenCount: 2,
      valuationCN: 2,
      sortIcon: [
        HOME_MARKET_SELECT_BOTTOM,
        HOME_MARKET_SELECT_TOP,
        HOME_MARKET_SELECT_NORMAL
      ],
      showSearch: false,
      showPass: false,
      showTransfer: false,
      accountList: [
        this.intl.get("asset-legal-account"),
        this.intl.get("asset-coin-account")
      ],
      dir: 0,
      coin: '', //资金划转币种
      amount: '',
      balance: 0,
    };
    this.filter = controller.filte.bind(controller);
    this.rank = controller.rank.bind(controller);
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.coin !== this.state.coin || prevProps.wallet !== this.props.wallet || prevProps.exchangeWallet !== this.props.exchangeWallet || prevState.dir !== this.state.dir){
      let balance = (!this.state.dir ? this.props.wallet : this.props.exchangeWallet).filter((v)=>v.coinName.toUpperCase() === this.state.coin)[0]
      balance && this.setState({balance: balance.availableCount})
    }
  }

  sort = (k, v) => {
    let obj = {
      coinName: 2,
      totalCount: 2,
      availableCount: 2,
      frozenCount: 2,
      valuationCN: 2
    };
    v > 1 && (v = 0);
    obj[k] = v;
    this.setState(obj);
  };

  charge = currency => {
    this.props.history.push({
      pathname: formatQueryToPath(`/otc/charge`, {currency})
    });
  };

  show = () => {
    this.setState({ showSearch: true });
  };

  hide = () => {
    this.setState({ showSearch: false });
  };

  showTransfer = ()=>{
    this.setState({ showTransfer: true });
  };

  hideTransfer = ()=>{
    this.setState({
      showTransfer: false,
      dir: 0,
      coin: '', //资金划转币种
      amount: '',
      balance: 0,});
  };

  showPass = ()=>{
    this.setState({ showPass: true });
  };

  hidePass = ()=>{
    this.setState({ showPass: false });
  };

  changeDir = (dir) => {
    this.setState({dir})
  };

  changeCoin = (coin) => {
    this.setState({coin})
  };

  changeAmount = (amount) => {
    if (!Regular("regDigital", amount) && amount !== "") return;
    if(amount >  this.state.balance) amount = this.state.balance;
    this.setState({amount})
  };

  transfer = async (password, func) => {
    let result = await this.props.transfer({
      dir: this.state.dir,
      "currency": this.state.coin.toLowerCase(),
      "amount": Number(this.state.amount),
      "pass": password
    });
    func();
    if(result && result.errCode){
      this.props.controller.popupController.setState({
        isShow: true,
        type: 'tip3',
        msg: result.msg,
        autoClose: true
      });
      return
    }
    this.props.controller.popupController.setState({
      isShow: true,
      type: 'tip1',
      msg: this.intl.get('asset-transfer-successful'),
      onClose: ()=>{
        this.hidePass();
        this.hideTransfer();
      },
      autoClose: true
    });
    this.props.updateAssets()
  };

  render() {
    let { wallet, exchangeWallet } = this.props;
    let {
      value,
      inputValue,
      coinName,
      availableCount,
      totalCount,
      frozenCount,
      valuationCN,
      sortIcon
    } = this.state;
    let result = this.filter(wallet, inputValue),
        exchangeCoinList = exchangeWallet.map((v=>v.coinName.toUpperCase())),
        otcCoinList = wallet.map((v=>v.coinName.toUpperCase())).sort((a, b)=> a>b ? 1 : -1),
        coinList = otcCoinList.filter(v=>exchangeCoinList.includes(v));

    let unit = this.props.unit === this.intl.get('cny') ? 1 : 0;
    return (
      <div className="asset-wallet">
        <div className="input-wrap">
          <div className="input">
            <Input
              type="search2"
              value={this.state.value}
              onFocus={this.show}
              onInput={value => {
                this.setState({ value });
              }}
              onEnter={() => {
                if (this.state.value.trim()) {
                  this.setState({
                    inputValue: this.state.value,
                    showSearch: false
                  });
                } else {
                  this.setState({ inputValue: "", showSearch: false });
                }
              }}
              clickOutSide={() => {
                if (!this.state.showSearch) return;
                if (this.state.value.trim()) {
                  this.setState({
                    inputValue: this.state.value,
                    showSearch: false
                  });
                } else {
                  this.setState({ inputValue: "", showSearch: false });
                }
              }}
            >
              {this.state.showSearch && (
                <ul className="search-list">
                  {this.rank(wallet, {coinName}).filter(v => v.coinName.toUpperCase().includes(value.toUpperCase()))
                    .map((v, index) => (
                      <li
                        key={index}
                        onClick={e => {
                          e.stopPropagation();
                          e.nativeEvent.stopImmediatePropagation();
                          this.setState({
                            inputValue: v.coinName.toUpperCase(),
                            value: v.coinName.toUpperCase(),
                            showSearch: false
                          });
                        }}
                      >
                        {v.coinName.toUpperCase()}
                      </li>
                    ))}
                </ul>
              )}
            </Input>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th
                className="currency"
                onClick={() => {
                  this.sort("coinName", coinName + 1);
                }}
              >
                {this.intl.get("asset-currency")}
                <img className="img" src={sortIcon[coinName]} alt="" />
              </th>
              <th
                className="total"
                onClick={() => {
                  this.sort("totalCount", totalCount + 1);
                }}
              >
                {this.intl.get("asset-amount")}
                <img className="img" src={sortIcon[totalCount]} alt="" />
              </th>
              <th
                className="avail"
                onClick={() => {
                  this.sort("availableCount", availableCount + 1);
                }}
              >
                {this.intl.get("asset-avail")}
                <img className="img" src={sortIcon[availableCount]} alt="" />
              </th>
              <th
                className="lock"
                onClick={() => {
                  this.sort("frozenCount", frozenCount + 1);
                }}
              >
                {this.intl.get("asset-lock")}
                <img className="img" src={sortIcon[frozenCount]} alt="" />
              </th>
              <th
                className="tolegal"
                onClick={() => {
                  this.sort("valuationCN", valuationCN + 1);
                }}
              >
                {this.intl.get("asset-valuation-legal")}
                <img className="img" src={sortIcon[valuationCN]} alt="" />
              </th>
              <th className="handle">{this.intl.get("option")}</th>
            </tr>
          </thead>
          <tbody>
            {result.length ? (
              this.rank(result, {
                coinName,
                availableCount,
                totalCount,
                frozenCount,
                valuationCN,
              }).map((item, index) => {
                return (
                  <tr key={index}>
                    <td className="currency">
                      <img src={item.coinIcon} alt="" />
                      {item.coinName.toUpperCase()}
                    </td>
                    <td className="total">
                      {Number(item.totalCount).format({
                        number: "property",
                        style: { decimalLength: 8 }
                      })}
                    </td>
                    <td className="avail">
                      {Number(item.availableCount).format({
                        number: "property",
                        style: { decimalLength: 8 }
                      })}
                    </td>
                    <td className="lock">
                      {Number(item.frozenCount).format({
                        number: "property",
                        style: { decimalLength: 8 }
                      })}
                    </td>
                    <td className="tolegal">
                      {Number(unit ? item.valuationCN : item.valuationEN).format({
                        number: "legal",
                        style: { decimalLength: 2 }
                      })} {unit ? 'CNY' : 'USD'}
                    </td>
                    <td className="handle">
                      <Button
                        type="base"
                        disable={item.c === 0 ? true : false}
                        title={this.intl.get("deposit")}
                        onClick={e => {
                          e.stopPropagation();
                          e.nativeEvent.stopImmediatePropagation();
                          this.charge(item.coinName);
                        }}
                      />
                      <Button
                        type="base"
                        disable={item.w === 0 ? true : false}
                        className="withdraw"
                        onClick={e => {
                          e.stopPropagation();
                          e.nativeEvent.stopImmediatePropagation();
                          this.changeCoin(item.coinName.toUpperCase());
                          this.showTransfer()
                        }}
                        title={this.intl.get("asset-funds-transfer")}
                      />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr className="empty">
                <td colSpan="6">
                  <p>{this.intl.get("noRecords")}</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {this.state.showTransfer && (
          <Transfer
            dir={this.state.dir}
            changeDir={this.changeDir}
            coinList={coinList}
            balance={this.state.balance}
            amount={this.state.amount}
            changeAmount={this.changeAmount}
            coin={this.state.coin}
            changeCoin={this.changeCoin}
            accountList={this.state.accountList}
            hideTransfer={this.hideTransfer}
            onConfirm={this.showPass}
            />
        )}
        {this.state.showPass && <SafePass
          errText=""
          onConfirm={this.transfer}
          onClose={this.hidePass}
        />}
      </div>
    );
  }
}
