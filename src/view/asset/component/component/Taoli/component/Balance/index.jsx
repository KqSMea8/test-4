import React, { Component } from "react";
import intl from "react-intl-universal";
import Redemption from "./component/Redemption"
import EarningsHistory from "./component/EarningsHistory"
import Transfer from "../../../common/Transfer";
import SafePass from '@/common/component/SafePass/'
import Regular from "@/core/libs/Regular";
import {AsyncAll} from '@/core'
import {
  resolveFundPath
} from "@/config/UrlConfig"

class TableItem extends Component {
  render() {
    let {item, index, language} = this.props;
    return <tr>
      <td>
        <a href={resolveFundPath('/detail', {id: item.id})}>
          {item.name}
        </a>
      </td>
      <td>{`${item.holdAsset}${item.currency}`} <br/>  {`(${item.holdAmount}${intl.get('tlb-invest-Amount')})`}</td>
      <td>{`${item.preEarnings} ${item.currency}`}</td>
      <td>{`${item.totalEarnings} ${item.currency}`}</td>
      <td>{item.yearRate}</td>
      <td>
        {item.canBuy ? <a href={resolveFundPath('/detail', {id: item.id})}>{intl.get('tlb-invest-subscribe')}</a> : <b>{intl.get('tlb-invest-subscribe')}</b>}
        {item.canRedem ? <span onClick={()=>this.props.openRedeem(index)}>{intl.get('tlb-invest-redeem')}</span> : <b>{intl.get('tlb-invest-redeem')}</b>}
        {!language ? <br/> : ''}
        <span onClick={()=>this.props.openEarnings(index)}>{intl.get('tlb-invest-earnDetail')}</span>
      </td>
    </tr>
  }
}

export default class Balance extends Component {
  constructor(props) {
    super(props);
    this.intl = intl;
    this.theadArr = [
      this.intl.get('tlb-invest-fundName'),
      this.intl.get('tlb-invest-holdAsset'),
      this.intl.get('tlb-invest-preEarnings'),
      this.intl.get('tlb-invest-totalEarnings'),
      this.intl.get('tlb-invest-expected'),
      this.intl.get('tlb-invest-fundOption')
    ];
    this.state = {
      showRedemption: false,
      showEarnings: false,
      index: 0,
      cards:{
        usd: [],
        cny: []
      },
      wallet:[],
      showTransfer: false,
      showPass: false,
      accountList: [
        this.intl.get("tlb-account"),
        this.intl.get("asset-coin-account")
      ],
      dir: 0,
      coin: '', //资金划转币种
      amount: '',
      balance: 0,
      language: props.controller.configController.language === 'zh-CN' ? 1 : 0
    };
    const {controller} = props;
    // 绑定view
    controller.setView(this);
    // 初始化数据，数据来源即store里面的state
    let { fundAccount, investArr } = controller.initState;
    this.state = Object.assign(this.state, { fundAccount, investArr });

    this.getMyinvest = controller.getMyinvest.bind(controller);
    this.getFundAccount = controller.getFundAccount.bind(controller);
    this.getTotalAsset = controller.getAssets.bind(controller);
    this.fundTransfer = controller.fundTransfer.bind(controller);
    this.getBankCard = controller.getBankCard.bind(controller);
    this.getEarningsHistory = controller.getEarningsHistory.bind(controller);
    this.redeem = controller.redeem.bind(controller)
  }

  async componentDidMount() {
    let result = await AsyncAll([
      this.getMyinvest(),
      this.getFundAccount(),
      this.getTotalAsset(true),
      this.getBankCard(1),
      this.getBankCard(2),
    ]);
    let obj = {
      cards: {
        usd: result[3].cards,
        cny: result[4].cards,
      }
    };
    this.setState(Object.assign({}, obj, ...result.slice(0,3)))
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.coin !== this.state.coin || prevState.wallet !== this.state.wallet || prevState.fundAccount !== this.state.fundAccount || prevState.dir !== this.state.dir){
      let balance = (!this.state.dir ? this.state.fundAccount.accountList : this.state.wallet).filter((v)=>v.coinName.toUpperCase() === this.state.coin)[0]
      balance && this.setState({balance: balance.availableCount})
    }
  }

  closeRedemption = () => this.setState({showRedemption: false});

  openRedeem = i => this.setState({showRedemption: true, index: i});

  openEarnings = i => this.setState({showEarnings:true, index: i});

  closeEarnings = () => this.setState({showEarnings: false});

  redeemHandle = async (obj) => {
    let result = await this.redeem(obj);
    result && this.setState(Object.assign({showRedemption: false}, result))
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

  updateAssets = async ()=>{
    let result = await AsyncAll([
      this.getFundAccount(),
      this.getTotalAsset()
    ]);
    this.setState(Object.assign({}, ...result))
  };

  transfer = async (password, func) => {
    let result = await this.fundTransfer({
      type: (this.state.dir + 1) % 2,
      "coin": this.state.coin.toLowerCase(),
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
    this.updateAssets()
  };

  render() {
    let curInvest = this.state.investArr[this.state.index],
        {fundAccount, wallet} = this.state,
        exchangeCoinList = wallet.map((v=>v.coinName.toUpperCase())),
        fundCoinList = fundAccount.accountList.map((v=>v.coinName.toUpperCase())).sort((a, b)=> a>b ? 1 : -1),
        coinList = fundCoinList.filter(v=>exchangeCoinList.includes(v));
    return <div className="my-investment">
      <div className="total-asset">
        <span>{this.intl.get('tlb-invest-taolibao')}{this.intl.get('asset-account')}{this.intl.get('asset-totalAssets')}: </span>
        <span>{Number(fundAccount.totalCountBTC).format({ number: "property", style: { decimalLength: 8 }})} BTC </span>
        <span>≈ {Number(fundAccount.totalCountCN).format({ number: "legal", style: { decimalLength: 2 }})} CNY</span>
      </div>
      <div>
        {fundAccount.accountList.map((v, i)=><div className="rate" key={i}>
          <h1>
            <span><img src={v.coinImage}/>{v.coinName}</span>
            <button onClick={()=>{this.setState({coin: v.coinName},()=>this.showTransfer());}}>{this.intl.get('asset-funds-transfer')}</button>
          </h1>
          <table>
            <tbody>
              <tr>
                <td>{Number(v.totalCount).format({ number: "property", style: { decimalLength: 8 }})}</td>
                <td>{Number(v.availableCount).format({ number: "property", style: { decimalLength: 8 }})}</td>
                <td>{Number(v.lockCount).format({ number: "property", style: { decimalLength: 8 }})}</td>
                <td>{Number(v.totalCountCN).format({ number: "legal", style: { decimalLength: 2 }})}</td>
              </tr>
              <tr>
                <td>{this.intl.get('asset-amount')}</td>
                <td>{this.intl.get('tlb-invest-available')}</td>
                <td className="lock">
                  {this.intl.get('tlb-invest-frozen')}&nbsp;
                  <b className="pop-parent">
                    <span className="img" />
                    <em
                      className="pop-children downpop-children"
                    >
                      {this.intl.get("asset-taoli-lock-tip")}
                    </em>
                  </b>
                </td>
                <td>{this.intl.get('asset-valuation-legal')}(￥)</td>
              </tr>
            </tbody>
          </table>
        </div>)}
      </div>
      <table className={`investment-list ${this.state.language ? 'cn' : 'en'}`}>
        <thead>
          <tr>
            {this.theadArr.map(v=><th key={v}>{v}</th>)}
          </tr>
        </thead>
        <tbody>
          {this.state.investArr.map((v,i)=><TableItem
            item={v}
            index={i}
            key={v.id}
            language={this.state.language}
            openEarnings={this.openEarnings}
            openRedeem={this.openRedeem}
          />)}
        </tbody>
      </table>
      {/* 赎回弹窗 */}
      {this.state.showRedemption &&
        <Redemption
          controller={this.props.controller}
          id = {curInvest.id}
          currency = {curInvest.currency.toUpperCase()}
          holdAsset = {curInvest.canRedeemAsset}
          holdAmount = {curInvest.canRedeemAmount}
          minRedeemMount = {curInvest.minRedeemMount}
          unitPrice = {curInvest.unitPrice}
          fee = {curInvest.fee}
          reg = {curInvest.reg}
          redeem = {this.redeemHandle}
          onClose ={this.closeRedemption}
          cards = {this.state.cards}
        />}
      {/* 历史收益弹窗 */}
      {this.state.showEarnings &&
        <EarningsHistory
          id = {curInvest.id}
          currency = {curInvest.currency}
          name = {curInvest.name}
          unitPrice = {curInvest.unitPrice}
          totalEarnings ={curInvest.totalEarnings}
          getHistory = {this.getEarningsHistory}
          onClose = {this.closeEarnings}
        />
      }
       {/* 资金划转弹窗 */}
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
    </div>;
  }
}

