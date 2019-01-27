import React, {Component} from 'react';
import intl from "react-intl-universal";
import SelectButton from "@/common/baseComponent/SelectButton";
import Input from "@/common/baseComponent/Input";
import Button from "@/common/baseComponent/Button";
import PropTypes from "prop-types";
import { ASSET_CLOSED } from "@/config/ImageConfig";

export default class Transfer extends Component {
  static propTypes = {
    dir: PropTypes.number.isRequired, //0 法币到币币 1 币币到法币
    balance: PropTypes.number.isRequired,
    coin: PropTypes.string.isRequired,
    accountList: PropTypes.array.isRequired,
    coinList: PropTypes.array.isRequired,
    changeDir: PropTypes.func.isRequired,
    changeCoin: PropTypes.func.isRequired,
    changeAmount: PropTypes.func.isRequired,
    hideTransfer: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.intl = intl;
    this.state = {};
  }

  selectFrom=(value)=>{
    let dir = this.props.accountList.indexOf(value);
    if(this.props.dir !== dir) {
      this.props.changeAmount('');
      this.props.changeDir(dir);
    }
  };

  selectTo=(value)=>{
    let dir = (this.props.accountList.indexOf(value) + 1) % 2;
    if(this.props.dir !== dir) {
      this.props.changeAmount('');
      this.props.changeDir(dir);
    }
  };

  transferAll=()=>{
    this.props.changeAmount(this.props.balance)
  };

  render() {
    let { dir, accountList, balance, coin, coinList, changeCoin, amount, changeAmount, hideTransfer, onConfirm} = this.props;
    return (
      <div className="otc-transfer-wrap">
        <div className="otc-transfer-content">
          <h3 className="otc-transfer-title">
            {this.intl.get("asset-funds-transfer")}{" "}
            <img src={ASSET_CLOSED} alt="" onClick={hideTransfer}/>
          </h3>
          <div className="otc-transfer-coin">
            <p>{this.intl.get("asset-selectCoin")}</p>
            <SelectButton
              className="otc-transfer-select"
              type="main"
              title={coin}
              type="main"
              valueArr={coinList}
              onSelect={changeCoin}
            />
          </div>
          <div className="otc-transfer-amount">
            <p>{this.intl.get("asset-transfer-amount")}</p>
            <div className="otc-transfer-input">
              <Input
                value={amount}
                onInput={changeAmount}
              />
              <i onClick={this.transferAll}>{this.intl.get("all")}</i>
            </div>
            <span>*{this.intl.get("asset-avail")}:{`${balance} ${coin}`}</span>
          </div>
          <div className="otc-transfer-dir clearfix">
            <p>{this.intl.get("asset-account")}</p>
            <SelectButton
              className="otc-transfer-select"
              type="main"
              title={accountList[dir]}
              valueArr={accountList}
              onSelect={this.selectFrom}
            />
            <span>{this.intl.get("asset-transfer-to")}</span>
            <SelectButton
              className="otc-transfer-select"
              type="main"
              title={accountList[(dir + 1) % 2]}
              valueArr={accountList}
              onSelect={this.selectTo}
            />
          </div>
          <Button title={this.intl.get("asset-confirms")} type="base" disable={!Number(amount) || !coin} onClick={onConfirm && onConfirm}/>
        </div>
      </div>
    );
  }
}
