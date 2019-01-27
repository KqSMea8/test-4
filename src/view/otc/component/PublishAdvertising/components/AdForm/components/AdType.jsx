import React from 'react'
import ExchangeViewBase from '@/components/ExchangeViewBase.jsx'
import SelectButton from "@/common/baseComponent/SelectButton"
import Input from "@/common/baseComponent/Input"
import PropTypes from "prop-types";
import { OTC_EXCHANGE_B } from '@/config/ImageConfig';

export default class AdType extends ExchangeViewBase {
  static propTypes = {
    type: PropTypes.number.isRequired,//出售或购买
    sellAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,//出售数量
    balance: PropTypes.object.isRequired,
    coin: PropTypes.string.isRequired,
    legal: PropTypes.string.isRequired,
    legalList: PropTypes.array.isRequired,
    coinList: PropTypes.array.isRequired,
    changeType: PropTypes.func.isRequired,
    changeSellAmount: PropTypes.func.isRequired,
    changeLegal: PropTypes.func.isRequired,
    changeCoin: PropTypes.func.isRequired,
  };
  constructor(props) {
    super(props)
    this.state={
      typeList: [this.intl.get('otc-buy'), this.intl.get('otc-sell')],
    }
  }

  changeType= (value)=>{
    this.props.changeType(this.state.typeList.indexOf(value))
  }

  setAllAmount = ()=>{
    this.props.changeSellAmount(this.props.balance[this.props.coin])
  }

  render() {
    const {type, legal, coin, coinList, sellAmount, changeSellAmount, changeLegal, changeCoin, legalList, balance} = this.props;
    const {typeList} = this.state;
    return (
      <div className='adForm-content-item adForm-content-required adForm-content-adType clearfix'>
        <h3>{this.intl.get('otc-publish-want')}</h3>
        <div className="adForm-content-main clearfix">
          <SelectButton
            title={typeList[type]}
            type="main"
            className="adType-selectType"
            onSelect={this.changeType}
            valueArr={typeList}
          />
          {type && <div className="adType-sellAmount clearfix">
            <Input
              onInput={changeSellAmount}
              value={sellAmount || ''}
              placeholder={this.intl.get('otc-publish-balance', {balance: balance[coin]})}
            />
            <span onClick={this.setAllAmount}>{this.intl.get('otc-all')}</span>
          </div> || '' }
          {
            !type && <div className="adType-sellAmount clearfix">
              <Input
                onInput={changeSellAmount}
                value={sellAmount || ''}
                placeholder={this.intl.get('otc-fast-input-amount')}
              />
            </div> || ''
          }
          <SelectButton
            title={coin}
            type="main"
            className="adType-selectCoin"
            onSelect={changeCoin}
            valueArr={coinList}
          />
          <img src={OTC_EXCHANGE_B} alt=""/>
          <SelectButton
            title={legal}
            type="main"
            className="adType-selectLegal"
            onSelect={changeLegal}
            valueArr={legalList}
          />
        </div>
      </div>
    )
  }
}
