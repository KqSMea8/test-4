import React, {Component} from "react";
import intl from "react-intl-universal";
import Button from "@/common/baseComponent/Button";
import Input from "@/common/baseComponent/Input";
import {
  resolveHelpPath,
  formatQueryToPath,
} from "@/config/UrlConfig"
import {
  HOME_MARKET_SELECT_BOTTOM,
  HOME_MARKET_SELECT_TOP,
  HOME_MARKET_SELECT_NORMAL
} from "@/config/ImageConfig";

export default class Wallets extends Component {
  constructor(props) {
    super(props);
    let { controller } = this.props;
    this.intl = intl;
    this.state = {
      value: "",
      inputValue: "",
      tradePair: null,
      hideLittle: false,
      hideZero: false,
      coinName: 2,
      availableCount: 2,
      frozenCount: 2,
      valuationBTC: 2,
      coin: controller.configData.coin,
      sortIcon: [
        HOME_MARKET_SELECT_BOTTOM,
        HOME_MARKET_SELECT_TOP,
        HOME_MARKET_SELECT_NORMAL
      ],
      lang: controller.configData.language,
      showSearch: false
    };
    this.sort = (k, v) => {
      let obj = {
        coinName: 2,
        availableCount: 2,
        frozenCount: 2,
        valuationBTC: 2
      };
      v > 1 && (v = 0);
      obj[k] = v;
      this.setState(obj);
    };

    this.filter = controller.filte.bind(controller);
    this.rank = controller.rank.bind(controller);

    this.show = () => {
      this.setState({ showSearch: true });
    };
    this.hide = () => {
      this.setState({ showSearch: false });
    };
  }

  render() {
    let { wallet, qbInfo } = this.props;
    let {
      value,
      inputValue,
      hideLittle,
      hideZero,
      coinName,
      availableCount,
      frozenCount,
      valuationBTC,
      sortIcon
    } = this.state;
    let result = this.filter(wallet, inputValue, hideLittle, hideZero);

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
                  {this.rank(wallet, {
                      coinName
                    }).filter(v=>v.coinName.toUpperCase().includes(value.toUpperCase()) || v.fullName.toUpperCase().includes(value.toUpperCase())).map((v, index) => (
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
          <span
            className={`hide-little ${this.state.hideLittle ? "active" : ""}`}
            onClick={() => {
              this.setState({ hideLittle: !this.state.hideLittle });
            }}
          >
            <i />
            {this.intl.get("asset-hideLittle")}
            <b className="pop-parent">
              <em className="img" />
              <em className="pop-children uppop-children">
                {this.intl.get("asset-tip1")}
              </em>
            </b>
          </span>
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
              <th className="fullname">{this.intl.get("asset-fullname")}</th>
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
                <b className="pop-parent">
                  <span className="img" />
                  <em
                    className={`pop-children uppop-children ${
                      this.state.lang === "en-US" ? "en" : "cn"
                    }`}
                  >
                    {this.intl.get("asset-tip2")}
                  </em>
                </b>
                <img className="img" src={sortIcon[frozenCount]} alt="" />
              </th>
              <th
                className="tobtc"
                onClick={() => {
                  this.sort("valuationBTC", valuationBTC + 1);
                }}
              >
                {this.intl.get("asset-tobtc")}
                <b className="pop-parent">
                  <span className="img" />
                  <em className="pop-children uppop-children">
                    {this.intl.get("asset-tip3")}
                  </em>
                </b>
                <img className="img" src={sortIcon[valuationBTC]} alt="" />
              </th>
              <th className="handle">{this.intl.get("option")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="currency">
                <img src={qbInfo && qbInfo.coinIcon || ''} alt="" />
                {qbInfo && qbInfo.coinName.toUpperCase() || '-'}
              </td>
              <td className="fullname">
                <span>{qbInfo && qbInfo.fullName || '-'}</span>
              </td>
              <td className="avail">
                {qbInfo && Number(qbInfo.availableCount).format({
                  number: "property",
                  style: { decimalLength: 8 }
                }) || '-'}
              </td>
              <td className="lock tac">{"—"}</td>
              <td className="tobtc tac">{"—"}</td>
              <td className="handle">
                <Button
                  type="base"
                  disable={true}
                  title={this.intl.get("deposit")}
                />
                <Button
                  type="base"
                  className="withdraw"
                  disable={true}
                  title={this.intl.get("asset-withdraw")}
                />
              </td>
            </tr>
            {result.length ? this.rank(result, {
              coinName,
              availableCount,
              frozenCount,
              valuationBTC
            }).map((item, index) => {
              return item.coinName !== this.state.coin ? (
                <tr key={index}>
                  <td className="currency">
                    <img src={item.coinIcon} alt="" />
                    {item.coinName.toUpperCase()}
                  </td>
                  <td className="fullname">
                    <a
                      href={resolveHelpPath(`/currency`, {currency: item.coinName})}
                    >
                      {item.fullName}
                    </a>
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
                  <td className="tobtc">
                    {Number(item.valuationBTC).format({
                      number: "property",
                      style: { decimalLength: 8 }
                    })}
                  </td>
                  <td className="handle">
                    <Button
                      type="base"
                      disable={item.c === 0 ? true : false}
                      title={this.intl.get("deposit")}
                      onClick={e => {
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation();
                        this.props.history.push({pathname: formatQueryToPath('/exchange/charge', {currency: item.coinName})})
                        {/* goAssetPath(``, {currency: }) */}
                      }}
                    />
                    <Button
                      type="base"
                      className="withdraw"
                      disable={item.w === 0 ? true : false}
                      onClick={e => {
                        e.stopPropagation();
                        e.nativeEvent.stopImmediatePropagation();
                        this.props.history.push({pathname: formatQueryToPath('/exchange/extract', {currency: item.coinName})})
                        {/* goAssetPath(`/exchange/extract`, {currency: item.coinName}) */}
                      }}
                      title={this.intl.get("asset-withdraw")}
                    />
                  </td>
                </tr>
              ) : (
                <tr key={index}>
                  <td className="currency">
                    <img src={item.coinIcon} alt="" />
                    {item.coinName.toUpperCase()}
                  </td>
                  <td className="fullname">
                    <span>{item.fullName}</span>
                  </td>
                  <td className="avail">
                    {Number(item.availableCount).format({
                      number: "property",
                      style: { decimalLength: 8 }
                    })}
                  </td>
                  <td className="lock tac">{"—"}</td>
                  <td className="tobtc tac">{"—"}</td>
                  <td className="handle">
                    <Button
                      type="base"
                      disable={true}
                      title={this.intl.get("deposit")}
                    />
                    <Button
                      type="base"
                      className="withdraw"
                      disable={true}
                      title={this.intl.get("asset-withdraw")}
                    />
                  </td>
                </tr>
              );
            }) : <tr className="empty">
              <td colSpan="6">
                <p>{this.intl.get('noRecords')}</p>
              </td>
            </tr>

            }
          </tbody>
        </table>
      </div>
    );
  }
}
