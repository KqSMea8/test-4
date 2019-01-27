import React, { Component } from "react";
import intl from "react-intl-universal";
import { NavLink } from "react-router-dom";
import Button from "@/common/baseComponent/Button";
import Input from "@/common/baseComponent/Input";
import Pagination from "@/common/baseComponent/Pagination";
import SelectCoin from "../../../common/SelectCoin";
import ToTrade from "../common/ToTrade";
import TwoVerifyPopup from "@/common/component/viewsPopup/TwoVerifyPopup";
import Popup from "./component/AddressManage";
import BasePopup from "@/common/baseComponent/Popup";
import {
  getQueryFromPath,
  resolveUserPath,
  goUserPath,
  formatQueryToPath,
} from "@/config/UrlConfig"
import {AsyncAll} from '@/core';

export default class Extract extends Component {
  constructor(props) {
    super(props);
    this.intl = intl;
    // 绑定视图，初始化数据
    this.setStateFlag = true;
    let { controller } = this.props;
    controller.setView(this);
    //提币订单状态字典
    this.status = {
      0: this.intl.get("pending"),
      1: this.intl.get("passed"),
      2: this.intl.get("failed"),
      3: this.intl.get("cancel"),
      4: this.intl.get("dealing"),
      5: this.intl.get("dealing")
    };
    // 提币记录表头
    this.theadArr = [
      {className: 'time', text: this.intl.get("asset-withdrawalsTime")},
      {className: 'currency', text: this.intl.get("asset-currency")},
      {className: 'amount', text: this.intl.get("asset-withdrawalsAmount")},
      {className: 'send', text: this.intl.get("asset-sendAddress")},
      {className: 'receive', text: this.intl.get("asset-receiveAddress")},
      {className: 'state', text: this.intl.get("state")},
      {className: 'remark', text: this.intl.get("remark")},
    ];

    this.state = {
      currency: "BTC",
      value: "BTC",//输入框value
      currencyList: [],
      minerFee: 0,
      newAddress: [],//地址管理的待编辑地址
      curExtract: {
        addressList: [],
        minCount: ''
      },
      showAddressPopup: false,
      address: {address: ''},
      searchArr: [],
      extractAmount: "", //提现数量
      password: "",
      showTwoVerify: false,
      verifyType: 0, //两步验证确认后的操作 0 申请提币订单，1 添加提币地址
      firstVerify: 2,//增加提币地址时优先的二次验证类型 1 邮件，2谷歌，3短信
      verifyNum: this.intl.get("sendCode"),
      tradePairArr: [],
      page: 1,
      pageSize: 10,
      noSufficTip: false, // 余额不足提示
      overLimit: false,//可用额度不足提示
      quotaTip: false,//最小提币额度提示
      orderTip: false,
      orderTipContent: "",
      userTwoVerify: { withdrawVerify: -1, fundPwd: -1 },//提币两步验证类型和是否设置资金密码
      showSelect: false,
      recoGoogle: false,
      errCode: '',
      errState: ''
    };
    let {
      walletList,
      walletHandle,
      currencyAmount,
      assetHistory
    } = controller.initState;
    this.state = Object.assign(this.state, {
      walletHandle,
      walletList,
      assetHistory,
      currencyAmount
    });

    this.amountRef = React.createRef();

    this.popupController = controller.popupController;//弹窗controller
    this.deal = controller.dealCoin.bind(controller);//处理出可提币的币种列表
    this.beforeAppendaddress = controller.beforeAppendaddress.bind(controller);//添加地址前的前端验证
    this.beforeExtract = controller.beforeExtract.bind(controller);// 提交提币订单前的验证
    this.getTradePair = controller.getTradePair.bind(controller);//获取市场下交易对
    this.getCurrencyAmount = controller.getCurrencyAmount.bind(controller);//获取当前币种资产信息
    this.getMinerFee = controller.getMinerFee.bind(controller);// 获取矿工费
    this.getExtract = controller.getExtract.bind(controller);// 获取提笔最小数量和地址
    this.getWalletList = controller.getWalletList.bind(controller);// 获取币种列表
    this.getHistory = controller.getHistory.bind(controller); // 获取提币信息
    this.deletAddress = controller.deletAddress.bind(controller);// 删除提币地址
    this.getVerify = controller.getVerify.bind(controller);// 二次验证倒计时
    this.destroy = controller.clearVerify.bind(controller);// 清除定时器
    this.getUserInfo = controller.getUserInfo.bind(controller);// 获取资金密码设置状态和两步验证方式
    this.twoVerify = controller.twoVerify.bind(controller);// 二次验证的确认操作
  }

  async componentDidMount() {
    window.addEventListener("click", this.hideSelect);
    // pv统计
    // this.props.sendStatis({
    //   event: 'assetsPV',//操作代码
    //   type: 'withdraw',//tab
    // })

    let obj = await this.getWalletList();
    // 处理出币种
    let arr = this.deal(obj.walletList, 'w');
    let query = getQueryFromPath("currency").toUpperCase();
    let currency = query && (arr.includes(query) && query || 'BTC') || "BTC";

    if(!arr.includes(query) && query!=='BTC') {
      this.props.history.replace({
        pathname: formatQueryToPath('/exchange/extract', {currency: currency.toLowerCase()})
      });
      return
    }
    // !arr.includes(query) && this.props.history.replace({
    //   pathname: this.props.history.location.pathname,
    //   search: `?currency=${currency.toLowerCase()}`
    // })
    this.setStateFlag && this.setState({
      currency: currency,
      value: currency
    });
    let res = await this.getExtract(currency),
        result = await AsyncAll(
      [
        this.getUserInfo(),
        this.getTradePair(currency),
        this.getCurrencyAmount(currency),
        !res.address.address && await this.getMinerFee(currency, res.address) || {},
        this.getHistory({
          page: 0,
          pageSize: this.state.pageSize,
          coinId: obj.walletList[currency.toUpperCase()],
          coinName: currency.toUpperCase(),
          orderType: 2,
          orderStatus: -1,
          startTime: -1,
          endTime: -1
        })
      ]
    );
    this.setStateFlag && this.setState(Object.assign({
        currencyList: arr
      },
      obj,
      res,
      ...result
    ));
    }

  async componentDidUpdate(preProps, preState) {
    // 更换提币地址时请求矿工费
    if(this.state.address.address!==preState.address.address){
      let result = await this.getMinerFee(this.state.currency, this.state.address);
      this.setState({
        extractAmount: "",
        minerFee: result.minerFee
      })
    }
    // 地址列表发生变化时设置提币地址为列表第一项
    if (this.state.curExtract.addressList.length !== preState.curExtract.addressList.length) {
      let curExtract = this.state.curExtract;
      this.setState(
        {
          address:(curExtract.addressList[0] && this.props.controller.sort(curExtract.addressList, ["addressName"], 1)[0] || {address: ''}),
        }
      );
    }
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
    window.removeEventListener("click", this.hideSelect);
    this.setStateFlag = false;
  }

  // 显示下拉地址列表
  showSelectList = e =>{
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    this.setState({ showSelect: true });
  };

  hideSelect= () => this.setState({ showSelect: false });//隐藏下拉地址列表

  //地址未保存的提示
  notSaved = () => {
    this.popupController.setState({
      isShow: true,
      type: 'tip3',
      msg: this.intl.get('asset-address-notSaved'),
      autoClose: true
    })
  };

  // 选择提币地址
  selectedAddress = (e,v)=> {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    this.setState({
      showSelect: false,
      address: {
        address: v.address,
        addressName: v.addressName
      }
    })
  };

  // 显示地址管理弹窗
  showAddressManage = e => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    this.setState({ showAddressPopup: true });
  };

  changeNewAddress = value => this.setState({newAddress:JSON.parse(JSON.stringify(value))}); //为地址管理弹窗提供改变newAddress的方法
  resetCode = () => this.setState({errCode: ''}); // 两步验证弹窗重置错误码的方法
  setValue = value => this.setState({ value });
  setCurrency = currency=> this.setState({ currency });

  // 提现数量输入处理
  amountHandleInput = value => {
    value = value.replace(/[^\d.]/g, "");
    if (!/^[0-9]+\.?[0-9]{0,8}$/.test(value) && value !== "")
      return;
    this.setState({ extractAmount: value });
  };

  // 密码输入
  passwordHandleInput = value => {
    this.setState({ password: value });
  };

  // 提现数量获取焦点处理
  amountHandleFocus = () => {
    this.setState({
      quotaTip: false,
      noSufficTip: false,
      overLimit: false
    })
  };

// 提现数量失去焦点处理
  amountHandleBlur = () => {
    if (this.state.extractAmount === "") return;
    if (Number(this.state.extractAmount) < this.state.curExtract.minCount) {
      this.setState({quotaTip: true});
      return;
    }
    this.state.currencyAmount.availableCount < Number(this.state.extractAmount) &&
      !this.state.noSufficTip &&
      this.setState({ noSufficTip: true });
  };

// 添加地址
  saveAddress = () => {
    let obj = Object.assign({ coinName: this.state.currency }, this.state.newAddress[0]);
    if (obj.addressName.trim() === "" || obj.address.trim() === "") {
      this.popupController.setState({
          isShow: true,
          type: 'tip3',
          msg: this.intl.get("asset-incomplete"),
          autoClose: true
        });
      return false;
    }
    let flag = this.beforeAppendaddress(obj, this.state.curExtract.addressList);
    if(!flag) return;
    this.setState({
      showTwoVerify: true,
      verifyType: 1,
      verifyNum: this.intl.get("sendCode")
    })
  };

// 删除地址
  deleteAddress = del => {
    this.deletAddress(Object.assign({ coinName: this.state.currency }, del));
  };

  // 基本确认弹窗的确认操作
  baseConfirm = () => {
    if (this.state.orderTipContent === this.intl.get("asset-auth-tip")) {
      goUserPath(`/identity/`);
      return
      }
    if(this.state.orderTipContent === this.intl.get(616)){
      goUserPath(`/safe/`);
      return
    }
    this.setState({ orderTip: false });
  };

  // 可提现余额点击处理
  availableCountHandleClick = () => {
    this.amountRef.current.focus();
    this.setState({ extractAmount: this.state.currencyAmount.availableCount });
  };

  // 提交按钮操作
  submitHandleClick = () => {
    if (Number(this.state.extractAmount) >= this.state.curExtract.minCount && Number(Number(this.state.extractAmount).minus(this.state.minerFee)) < this.state.curExtract.minCount) {
      this.setState({
        orderTip: true,
        orderTipContent: this.intl.get('asset-FeeInsufficient'),
      });
      return
    }
    if (this.state.quotaTip || this.state.noSufficTip) return;
    this.beforeExtract(this.state.curExtract.minCount, this.state.password);
  };

  // 翻页
  changePageHandle = async (page) => {
    this.setState({ page });
    let result = await this.getHistory({
      page: page - 1,
      pageSize: this.state.pageSize,
      coinId: this.state.walletList[this.state.currency],
      coinName: this.state.currency,
      orderType: 2,
      orderStatus: -1,
      startTime: -1,
      endTime: -1
    });
    this.setState(result);
  };

  // 推荐谷歌验证关闭
  recoGoogleCloseHandle = () => {
    this.setState({
      showTwoVerify: true,
      verifyType: 0,
      recoGoogle: false,
      verifyNum: this.intl.get("sendCode")
    })
  };

  // 推荐谷歌验证确认
  recoGoogleConfirmHandle = () => goUserPath('/safe/');
  // 两步验证确认
  twoVerifyConfirmHandle = code => this.twoVerify(code, this.state.curExtract);
  // 隐藏地址管理弹窗
  addressCloseHandle = () => this.setState({ showAddressPopup: false });
  // 隐藏两步确认弹窗
  twoVerifyCloseHandle = () => this.setState({ showTwoVerify: false });
  // 隐藏基本弹窗
  baseCloseHandle = () =>this.setState({ orderTip: false });

  render() {
    let {
      totalCount,
      frozenCount,
      availableCount,
      totalQuota,
      usedQuota,
      auth
    } = this.state.currencyAmount,
    orderList = this.state.assetHistory.orderList,
    {currency, minerFee, curExtract} = this.state;
    return (
      <div className="extract">
        <h3>
          {this.intl.get("asset-withdraw")}-{currency}
          <NavLink to={formatQueryToPath('/exchange/balance')}>
            <Button
              title={this.intl.get('asset-back')}
            />
          </NavLink>
        </h3>
        {/* 搜索切换币种以及单个币种资产信息 */}
        <div className="extract-content">
          <SelectCoin
            origin='/exchange/extract'
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
          {/* 表单区域 */}
          <div className="address">
            <p className="tips">
              {this.intl.getHTML("asset-minWithdraw", { number: curExtract.minCount, currency: currency })}
            </p>
            <div className="currency-address clearfix">
              <span className="title">
                {currency}{this.intl.get("asset-withdrawAddress")}
              </span>
              <div className="content">
                <div className="select-address">
                  <div
                    className="select-input"
                    onClick={this.showSelectList}
                  >
                    <p>
                      <span>{this.state.address.addressName}</span>
                      <span>{this.state.address.address}</span>
                    </p>
                    {this.state.showSelect && (
                      <ul className="search-list">
                        {this.props.controller.sort(curExtract.addressList, ["addressName"], 1).map((v, i) => (
                          <li key={i} onClick={(e)=>{this.selectedAddress(e, v)}}>
                            <span>{v.addressName}</span><span>{v.address}</span>
                          </li>))}
                      </ul>
                    )}
                  </div>
                </div>
                <a onClick={this.showAddressManage}>{this.intl.get("asset-addAddress")}</a>
              </div>
            </div>
            <div className="extract-amount clearfix">
              <span className="title">{this.intl.get("asset-withdrawAmount")}</span>
              <div className="content">
                <p className="limit clearfix">
                  <span className="asset-24hQuota">
                    {this.intl.get("asset-24hQuota")}：{Number(usedQuota)}/{totalQuota}{" "}BTC
                  </span>
                  {auth ? <span className="apply">{this.intl.get("asset-limitApply")}</span> : (
                    <a href={resolveUserPath('/identity')}>{this.intl.get("asset-limitApply")}</a>)}
                </p>
                {/* 错误提示 */}
                <div className="input err-parent">
                  {this.state.quotaTip && <b className="err-children min-amount">{this.intl.get("asset-minWithdraw-tip", {number: curExtract.minCount,currency: currency})}</b>}
                  {this.state.noSufficTip && <b className="err-children">{this.intl.get("asset-not-enough")}</b>}
                  {this.state.overLimit && <b className="err-children">{this.intl.get("asset-overLimit")}</b>}
                  <Input
                    className={`${this.state.quotaTip || this.state.noSufficTip || this.state.overLimit ? 'error' : ''}`}
                    ref={this.amountRef}
                    placeholder={this.intl.get("asset-withdrawAmount")}
                    value={this.state.extractAmount}
                    onInput={this.amountHandleInput}
                    onFocus={this.amountHandleFocus}
                    onBlur={this.amountHandleBlur}
                  />
                  <a onClick={this.availableCountHandleClick}>
                    {this.intl.get("asset-withdrawAvailable")}: {availableCount}
                  </a>
                  <span>{currency}</span>
                </div>
                <div className="fee">
                  <p>
                    {this.intl.get("asset-gasFee")}：{minerFee + ` ${currency}`}
                    {/* 到账数量 */}
                    <span>
                      {this.intl.get("asset-withdrawActual")}{" "}
                      {Number(Number(this.state.extractAmount).minus(minerFee)) >
                        0 &&
                      Number(this.state.extractAmount) <= availableCount &&
                      Number(this.state.extractAmount) >= curExtract.minCount
                        ? Number(Number(this.state.extractAmount).minus(minerFee))
                        : 0}{" "}
                      {currency}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="password clearfix">
              <span className="title">{this.intl.get("fundPass")}</span>
              <div className="content">
                <Input
                  oriType="password"
                  value={this.state.password}
                  placeholder={this.intl.get("asset-inputFundPassword")}
                  onInput={this.passwordHandleInput}
                />
                <div className="set">
                  <a href={resolveUserPath('/safe')} target="_blank">{this.state.userTwoVerify.fundPwd === 0 ? this.intl.get("asset-forget-pwd")+'？' : this.intl.get("asset-setFundPassword")}</a>
                </div>
              </div>
            </div>
            <div className="handel">
              <Button
                title={this.intl.get("asset-submit")}
                type="base"
                onClick={this.submitHandleClick}
              />
            </div>
          </div>
          {/* 温馨提示 */}
          <div className="tip clearfix">
            <span className="title">{this.intl.get("asset-reminder")}</span>
            <ol>
              <li>{this.intl.get('asset-safe-tip')}</li>
              <li>
                {this.intl.get("asset-depositReminder2-1")}{" "}
                <NavLink to={formatQueryToPath('/exchange/dashboard')}>
                  {this.intl.get("asset-records")}
                </NavLink>{" "}
                {this.intl.get("asset-depositReminder2-2")}
              </li>
            </ol>
          </div>
          {/* 币种交易对 */}
          <ToTrade
            pairArr={this.state.tradePairArr}
          />
          {/* 币种资产记录 */}
          <div className="history clearfix">
            <span className="title">
              {this.intl.get("asset-withdrawalsHistory")}
            </span>
            {this.state.assetHistory.total ? (
              <div className="table">
                <table>
                  <thead>
                    <tr>{this.theadArr.map(v=><th className={v.className} key={v.className}>{v.text}</th>)}</tr>
                  </thead>
                  <tbody>
                    {orderList && orderList.map((v,index) => (
                      <tr key={index}>
                        <td className="time">{v.orderTime.toDate()}</td>
                        <td className="currency">{v.coinName.toUpperCase()}</td>
                        <td className="amount">
                          <i>-{v.count}</i>
                        </td>
                        <td className="send">
                          <i>{"—"}</i>
                        </td>
                        <td className="receive">
                          <i>{v.receiveAddress}</i>
                        </td>
                        <td className="state">
                          <span>{this.status[v.orderStatus]}</span>
                        </td>
                        <td className="remark">{v.fee || '—'}</td>
                      </tr>)
                    )}
                  </tbody>
                </table>
                <div className="pagina">
                  <Pagination
                    total={this.state.assetHistory.total}
                    pageSize={this.state.pageSize}
                    showTotal={true}
                    onChange={this.changePageHandle}
                    showQuickJumper={true}
                    currentPage={this.state.page}
                  />
                </div>
                <p className="more">
                  <NavLink to={formatQueryToPath('/exchange/dashboard')}>{this.intl.get("asset-viewAll")}</NavLink>
                </p>
              </div>
            ) : (
              <div className="kong">{this.intl.get("noRecords")}</div>
            )}
          </div>

          {/* 地址管理弹窗 */}
          {this.state.showAddressPopup && (
            <Popup
              addressArr={curExtract.addressList}
              newAddress={this.state.newAddress}
              addTip={this.notSaved}
              changeNewAddress={this.changeNewAddress}
              onSave={this.saveAddress}
              onDelete={this.deleteAddress}
              onClose={this.addressCloseHandle}
            />
          )}

          {/* 两步认证弹窗 */}
          {this.state.showTwoVerify && (
            <TwoVerifyPopup
              verifyNum={this.state.verifyNum}
              errCode={this.state.errCode}
              errState={this.state.errState}
              resetCode={this.resetCode}
              type={!this.state.verifyType ? this.state.userTwoVerify.withdrawVerify : this.state.firstVerify} //两步验证码类型
              getVerify={this.getVerify}
              onClose={this.twoVerifyCloseHandle}
              destroy={this.destroy}
              onConfirm={this.twoVerifyConfirmHandle}
            />
          )}

          {/* 基本确认弹窗 */}
          {this.state.orderTip && (
            <BasePopup
              type="confirm"
              msg={this.state.orderTipContent}
              onClose={this.baseCloseHandle}
              onConfirm={this.baseConfirm}
            />
          )}

          {/* 提币谷歌验证推荐弹窗 */}
          {this.state.recoGoogle && <BasePopup
              type="confirm"
              msg={this.intl.get('asset-recoGoogle')}
              onClose={this.recoGoogleCloseHandle}
              onConfirm={this.recoGoogleConfirmHandle}
              confirmText={this.intl.get('home-setPwdGo')}
              cancelText={this.intl.get('asset-nextTime')}
            />
          }
        </div>
      </div>
    );
  }
}
