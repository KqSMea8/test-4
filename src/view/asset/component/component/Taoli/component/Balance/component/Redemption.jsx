import React, {Component} from 'react';
import intl from "react-intl-universal";
import Input from '@/common/baseComponent/Input'
import Button from "@/common/baseComponent/Button";
import SelectButton from "@/common/baseComponent/SelectButton";
import AmoutInput from '@/common/component/AmountInput'
import { ASSET_CLOSED } from '@/config/ImageConfig';
import {
  resolveUserPath
} from "@/config/UrlConfig"


export default class Redemption extends Component {
  constructor(props) {
    super();
    this.intl = intl;
    this.state = {
      isLegal: ["USD", "CNY"].includes(props.currency),
      value: 0,
      password: '',
      minTip: false,
      cardId: 0,
      cardNumber: props.currency === 'USD' ? this.intl.get('asset-select-usd') : props.currency === 'CNY' ? this.intl.get('asset-select-cny') : '' ,
      isdisable: false
    };
  }

  closeHandle = ()=>{
    this.props.onClose && this.props.onClose()
  };

  // 显示错误提示
  showMinTip = ()=>{
    this.state.value < this.props.minRedeemMount && this.setState({minTip: true})
  };

  // 隐藏错误提示
  hideMinTip = ()=>this.setState({minTip: false});

  // 全部赎回
  redeemAll = ()=> {
    this.setState({value: Number(this.props.holdAmount) , minTip: this.props.holdAmount > this.props.minRedeemMount ? false : true})
  };

  //赎回
  redeem = async ()=>{
    if(this.state.isLegal && !this.state.cardId){
      this.props.controller.popupController.setState({
        isShow: true,
        type: 'tip3',
        msg: this.intl.get('asset-add-legal'),
        autoClose: true
      });
      return
    }
    if(Number(this.state.value) === 0) {
      this.setState({minTip: true});
      return
    }
    if(this.state.password.trim() === '') {
      this.props.controller.popupController.setState({
        isShow: true,
        type: 'tip3',
        msg: this.intl.get("tlb-invest-inputPassword"),
        autoClose: true
      });
      return
    }
    this.setState({isdisable: true});
    await this.props.redeem({
      id: this.props.id,
      amount: this.state.value,
      fundPass: this.state.password,
      cardId: this.state.cardId
    });
    this.setState({isdisable: false})
  };

  minusAmout = ()=> {
    let value = Number(Number(this.state.value).minus(1));
    this.setState({value: Number(value) > this.props.minRedeemMount ? value : 0, minTip: Number(value) > this.props.minRedeemMount ? false : true})
  };

  inputAmountHandle = (value) => {
    value = value.replace(/[^\d.]/g, "");
    if (!this.props.reg.test(value) && value !== "" || value === '00') return;
    if(Number(value) > this.props.holdAmount) value = Number(this.props.holdAmount);
    this.setState({value})
  };

  addAmout = ()=> {
    this.hideMinTip();
    let value = Number(Number(this.state.value).plus(1));
    this.setState({value: Number(value) > this.props.holdAmount ? Number(this.props.holdAmount) : value })
  };

  inputPasswordHandle = (password) => this.setState({password});

  render() {
    let { currency, holdAsset, holdAmount, fee, unitPrice, minRedeemMount, cards} = this.props;
    return <div className="redemption-wrap">
      <div className="redemption">
        <h3>{this.intl.get('tlb-invest-liveRedeem')}<img src={ASSET_CLOSED} alt="" onClick={this.closeHandle}/></h3>
        <div className="form">
          <div className="detail">
            <p><span>{this.intl.get('tlb-invest-available')}</span><span>{holdAsset} {currency}{`（${holdAmount}${this.intl.get('tlb-invest-Amount')}）`}</span></p>
            {this.state.isLegal && <div className='select'>
              <h4>
                <span>{currency === "USD" ? this.intl.get('asset-usd-account') : this.intl.get('asset-cny-account')}</span>
                {!cards[currency.toLowerCase()].length && <a href={resolveUserPath('/safe')}>{this.intl.get('asset-add-legal')}</a> || ''}
              </h4>
              {
                cards[currency.toLowerCase()].length ? <SelectButton
                  type="main"
                  title={this.state.cardNumber}
                  valueArr={cards[currency.toLowerCase()]}
                  onSelect={(value)=>{
                    this.setState({cardId: value.id, cardNumber: value.number})
                  }}
                /> : ''
              }
            </div>}
          </div>
          <div className="amount">
            <h4>{this.intl.get('tlb-invest-redeemAmount')}</h4>
            <div className="redemption-input err-parent clearfix">
              {this.state.minTip && <b className="err-children">{this.intl.get('tlb-invest-minRedeemAmount')}{minRedeemMount}</b>}
              <AmoutInput
                className={`input ${this.state.minTip ? 'error' : ''}`}
                add={this.addAmout}
                minus={this.minusAmout}
                value={this.state.value}
                onInput={this.inputAmountHandle}
                onFocus={this.hideMinTip}
                onBlur={this.showMinTip}
              />
              <em>{this.intl.get('tlb-invest-Amount')}</em>
              <i onMouseDown={this.redeemAll}>{this.intl.get('tlb-invest-redeemAll')}</i>
            </div>
            <p className="fee">*{this.intl.get('tlb-invest-fee')}{':' + this.state.value*unitPrice + '*' + fee*100 + '%' + '='}{(Number(Number(this.state.value).multi(fee*unitPrice))).format({number: "general", style:{ decimalLength: ['CNY', 'USD'].includes(currency) ? 2 : 8 }})} {currency}</p>
          </div>
          <div className="password">
            <h4>{this.intl.get('tlb-invest-password')}</h4>
            <Input
              value={this.state.password}
              onInput={this.inputPasswordHandle}
              placeholder={this.intl.get('tlb-invest-inputPassword')}
              oriType='password'
              />
          </div>
          <Button
            title={this.intl.get('tlb-invest-redeem')}
            type="base"
            onClick={this.redeem}
            disable={this.state.isdisable}
          />
        </div>
      </div>
    </div>;
  }
}
