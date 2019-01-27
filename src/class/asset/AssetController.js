;
import AssetStore from "./AssetStore";
import Util from "@/core/libs/GlobalUtil";
import Crypto from "@/core/libs/Crypto"
import {countDown, countDownStop} from '@/core/countDown'
import {swiper, swiperClear} from '@/core/swiper'
import filter from '@/core/filter';
import sort from '@/core/sort';
import copy from '@/core/copy';
import exportExcel from "@/core/exportExcel"
import {
  goOrderPath,
} from "@/config/UrlConfig"

export default class AssetController {
  constructor(props) {
    this.store = new AssetStore();
    this.store.setController(this);
    this.Util = Util;
    this.RSAencrypt = Crypto;
    this.countDown = countDown;
    this.countDownStop = countDownStop;
    this.swiper = swiper;
    this.swiperClear = swiperClear;
    this.filter = filter;
    this.sort = sort;
    this.copy = copy;
    this.exportExcel = exportExcel;
  }
  setView(view) {
    this.view = view;
  }
  get initState() {
    return (this.store && Util.deepCopy(this.store.state)) || {};
  }
  get assetList() {
    return this.store.state.wallet;
  }
  get configData() {
    return this.configController.initState;
  }
  get userId() {
    return this.userController.userId;
  }
  get token() {
    return this.userController.userToken;
  }
  get account() {
    let { email, phone } = this.userController.userInfo;
    return {
      1: email,
      3: phone
    };
  }

  get userTwoVerify() {
    return this.userController.userVerify;
    //0: 已设置资金密码 1: 未设置资金密码; 2 谷歌验证 1 邮件 3 短信
  }

  get orderType() {
    return {
      1:this.view.intl.get("deposit"),
      15000: this.view.intl.get("asset-withdraw"),
      // 5: this.view.intl.get("asset-transfer"),
      17000: this.view.intl.get("asset-in"),
      17001: this.view.intl.get("asset-out"),
      // 18000: this.view.intl.get("asset-subscribe"),
      // 18001: this.view.intl.get("asset-redeem")
    }
  }

  get otcWallet() {
    return this.store.state.otcWallet;
  }

  get otcWalletList() {
    return this.store.state.otcWalletList;
  }

  // 筛选出可充提币种(lang,h5)
  dealCoin(o, type, key){
    let j = {}
    for (let k in o) {
      if (this.store.state[ key || 'walletHandle'][k][type] === 1) {
        j[k] = o[k];
      }
    }
    return Object.keys(j)
  }

  // 提示性弹窗
  setViewTip(type, str) {
    this.popupController.setState({
      isShow: true,
      type: type ? 'tip1' : 'tip3',
      msg: str,
      autoClose: true
    });
  }

  // 获取用户的两步验证和密码设置信息(lang,h5)
  async getUserInfo() {
      let {
        //0: 已设置资金密码 1: 未设置资金密码; 2 谷歌验证 1 邮件 3 短信 0 无
        userInfo
      } = await this.userController.initData();
      let result = { withdrawVerify: userInfo.withdrawVerify , fundPwd: userInfo.fundPwd};
      return { userTwoVerify: result , firstVerify: userInfo.googleAuth ? 2 : userInfo.phone ? 3 : 1};
  }

  // 获取对应市场下的交易对信息（调用market的api）(lang,h5)
  async getTradePair(coin) {
    let result = await this.marketController.getTradePairHandle();
    return {
      tradePair: result,
      tradePairArr: coin && this.getCoinPair(result, coin) || []
    }
  }

  // 获取总资产和额度(flag true不操作view的State)
  async getAssets(flag) {
    await this.store.getTotalAsset();
    !flag && this.view.setState({
      totalAsset: this.store.state.totalAsset,
      wallet: this.sort(this.store.state.wallet, ["coinName"], 0) || []
    });
    if (this.view.name === "simple") {
      if(!this.view.tradePairId) return;
      this.updataMarketAvaile();
    }
    return {
      totalAsset: this.store.state.totalAsset,
      wallet: this.sort(this.store.state.wallet, ["coinName"], 0) || []
    }
  }

  // 获取单个币种资产信息(flag false不操作view的State)
  async getCurrencyAmount(coin, flag) {
    let result = await this.store.getCurrencyAmount(coin);
    if (result && result.errCode) return
    let obj = { currencyAmount: this.store.state.currencyAmount }
    if (flag) this.view.setState(obj);
    return obj;
  }

  // 获取交易对手续费
  async getPairFees() {
    if (!this.store.state.pairFees.length) {
      await this.store.getFee();
    }
    return { pairFees: this.store.state.pairFees };
  }

  //费率提币列表(lang)
  async getAllCoin() {
    return this.store.getAllCoin()
  }

  // 获取所有币种
  async getWalletList() {
    this.store.state.walletList["BTC"] === undefined && (await this.store.getWalletList());
    return {
      walletList: this.store.state.walletList,
      walletHandle: this.store.state.walletHandle,
      walletData: this.store.state.walletData
    }
  }

  // 获取矿工费
  async getMinerFee(coin, address) {
    await this.store.getMinerFee(coin, address.address);
    return {
      minerFee: this.store.state.walletExtract.minerFee
    }
  }

  // 获取充币地址
  async getCoinAddress(coin) {
    await this.store.getChargeAddress(coin);
    return {
      coinAddress: this.store.state.coinAddress,
      address: this.store.state.coinAddress.coinAddress
    }
  }

  //初始化充提记录
  initHistory() {
    this.view.setState({
      assetHistory: {
        total: 0,
        orderList: []
      },
      page: 1
    });
    this.store.initHistory();
  }

  // 获取充提记录
  async getHistory(obj) {
    let result = await this.store.getHistory(obj);
    return {
      assetHistory: this.Util.deepCopy(result)
    }
  }

  // 导出资产记录
  async exportHistory() {
    let result = await this.store.exportHistory();
    //   "时间,币种,类型,金额数量,余额，发送地址,接收地址,确认数,审核状态,手续费";
    let str = [
      this.view.intl.get("time"),
      this.view.intl.get("asset-currency"),
      this.view.intl.get("type"),
      this.view.intl.get("asset-amount2"),
      this.view.intl.get("asset-balan"),
      this.view.intl.get("asset-sendAddress"),
      this.view.intl.get("asset-receiveAddress"),
      this.view.intl.get("asset-confirm"),
      this.view.intl.get("asset-checkState"),
      this.view.intl.get("fee")
    ].join(',');
    result.forEach(v => {
      str += ("\n" + [
        v.orderTime.toDate("yyyy-MM-dd HH:mm:ss"),
        v.coinName,
        this.orderType[v.orderType] || '',
        v.count,
        v.balance,
        "—",
        v.receiveAddress || "—",
        v.orderType === 1 && !v.orderStatus ? `${v.doneCount}/${v.verifyCount}` : "—",
        this.view.staticData.status[v.orderStatus],
        v.fee
      ].join(','))
    });
    this.exportExcel(str, `${this.view.intl.get("asset-records")}.xls`);
  }

  // 获取确认中充币信息(顶部轮播web)
  async getChargeMessage() {
    let result = await this.store.getChargeMessage();
    return result;
  }

  // 获取提币信息(币种可用额度,冻结额度，24小时提现额度等信息)
  async getExtract(currency) {
    this.store.setStoreState({extractCoin: currency})
    let result = await this.store.getwalletExtract(currency);
    let res = this.dealCurExtract(result)
    return res;
  }

  // 请求验证码
  async requestCode() {
    let type = !this.view.state.verifyType ? this.view.state.userTwoVerify.withdrawVerify : this.view.state.firstVerify
    let result = await this.userController.getCode(
      this.account[type],
      type === 1 ? 1 : 0,
      !this.view.state.verifyType ? 8 : 10,
      3
    );
    if (result && result.errCode) {
      this.view.setState({ orderTip: true, orderTipContent: result.msg });
      // 错误处理
      return false;
    }
    this.setViewTip(true, this.view.intl.get("sendSuccess"));
    return true;
  }

  // 二次验证倒计时
  async getVerify() {
    if (!([this.view.intl.get("sendCode"), 0].includes(this.view.state.verifyNum))) return;
    let flag = await this.requestCode();
    if (flag) {
      this.view.setState({ verifyNum: 60 });
      this.countDown("verifyCountDown", "verifyNum", this.view);
    }
  }

  //提交提币订单
  async extractOrder(obj) {
    let type = this.userTwoVerify.withdrawVerify;
    (type === 1 || type === 3) && (obj.account = this.account[type]);
    obj.mode = (type%3);
    let result = await this.store.extractOrder(obj);
    // web端处理
    if (result && result.errCode) {
      if([607, 608, 2001].includes(result.ret)){
        this.view.setState({
          errCode: result.ret,
          errState: this.view.intl.get(result.ret)
        })
        return;
      }
      let o = {
        orderTip: true,
        orderTipContent: result.errCode === "CWS_ERROR" ? this.view.intl.get("asset-withdrawal-failed") : result.msg
      };
      if (result.errCode === "NO_VERIFIED"){
        o.orderTipContent = this.view.intl.get("asset-auth-tip");
        o.overLimit = true;
      }
      this.view.setState(o);
      return;
    }
    if (result && result.quota !== undefined) {
      this.setViewTip(true, !result.quota ? this.view.intl.get("optionSuccess") : this.view.intl.get("asset-wait-auditing"))
      this.view.setState({
        showTwoVerify: false,
        extractAmount: "", //提现数量
        password: ""
      });
      this.getCurrencyAmount(this.view.state.currency, true);
    }
  }

  // 添加提现地址前验证
  beforeAppendaddress(obj, addressList=[]){
    let flag = false;
    addressList.forEach(v => {
        v.address === obj.address && (flag = 713);// 验证地址是否存在
        v.addressName === obj.addressName && (flag = "asset-name-existing");// 验证地址名称是否存在
      });
      if(!flag) return true;
      this.setViewTip(false, this.view.intl.get(flag));
      return false;
  }

// 处理出提币地址
  dealCurExtract(result){
    let currency = this.store.state.extractCoin;
    let curExtract = result.extractAddr.filter(
      v => v.coinName === currency.toLowerCase()
    )[0];
    let address = (curExtract && curExtract.addressList[0] && this.sort(curExtract.addressList, ["addressName"], 1)[0]) || {address: ''};
    return { walletExtract: result, curExtract, address}
  }

  // 添加提现地址
  async appendAddress(obj) {
    // 发送添加地址请求交由后台校验
    let result = await this.store.appendAddress(obj);
    if (result && result.errCode) {
      if([607, 608, 2001].includes(result.ret)){
        this.view.setState({
          errCode: result.ret,
          errState: this.view.intl.get(result.ret)
        })
        return false
      }
      this.setViewTip(false, result.msg);
      return false;
    }
    this.setViewTip(true, this.view.intl.get("asset-add-success"));
    this.view.setState(this.dealCurExtract(result));
    return true;
  }

  //删除提现地址(lang)
  async deletAddress(obj) {
    let result = await this.store.deletAddress(obj);
    if (result.errCode) {
      this.setViewTip(false, this.view.intl.get("asset-delet-fail"));
      return false;
    }
    this.setViewTip(true, this.view.intl.get('asset-delete-success'));
    this.view.setState(this.dealCurExtract(result));
    return true;
  }

  // 处理出币种对应的交易对数组
  getCoinPair(o, coin) {
    if (!o || !coin) return [];
    let keyArr = 'pairNameCoin', usdt = false, key = 'pairIdCoin';
    if (coin.toUpperCase() === "USDT") {
      keyArr = 'pairNameMarket';
      usdt = true;
      key = 'pairIdMarket';
    }
    // console.log(o, keyArr, coin)
    return o[keyArr] && o[keyArr][coin.toLowerCase()] && o[keyArr][coin.toLowerCase()].map(v => ({
        name: usdt && `${v.toUpperCase()}/USDT` || `${coin}/${v.toUpperCase()}`,
        id: o[key][coin.toLowerCase()][v]
      }) || []
    );

  }

  // 账户余额页面筛选
  filte(wallet, value, hideLittle, hideZero) {
    let arr1 = this.filter(wallet, item => {
      return (
        item.coinName.toLowerCase().includes(value.toLowerCase()) ||
        item.fullName && item.fullName.toLowerCase().includes(value.toLowerCase())
      );
    });
    let arr2, result;
    if(hideLittle !== undefined){
      arr2 = this.filter(arr1, item => {
        return !hideLittle || item.valuationBTC > 0.001;
      });
    }
    if(hideZero !== undefined){
      result = this.filter(arr2, item => {
        return !hideZero || item.valuationBTC > 0;
      });
    }
    return result || arr1;
  }

  // 账户余额页面排序
  rank(arr, object) {
    let sortValue, type;
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        if (object[key] !== 2) {
          sortValue = [key];
          type = object[key];
          break;
        }
      }
    }
    if (!sortValue) {
      sortValue = ["valuationCN"];
      type = 0;
    }
    return this.sort(arr, sortValue, type, ['coinName']);
  }
// 清除验证码倒计时循环任务(lang，h5)
  clearVerify() {
    // 清除短信验证码
    this.countDownStop("verifyCountDown");
  }

  // 提现前前端验证(lang)
  async beforeExtract(minCount, password) {
    let obj = {
      orderTip: true,
      orderTipContent: ""
    };
    // 校验地址不为空
    if (this.view.state.address.address === "") {
      obj.orderTipContent = this.view.intl.get("asset-input-address");
      this.view.setState(obj);
      return;
    }
    // 校验数量大于最小提现数量
    if (this.view.state.extractAmount < minCount) {
      obj.orderTipContent = this.view.intl.get("asset-input-extractAmount");
      this.view.setState(obj);
      return;
    }
    // 校验是否输入密码
    if (this.view.state.password === "") {
      obj.orderTipContent = this.view.intl.get("asset-inputFundPassword");
      this.view.setState(obj);
      return;
    }
    // 校验密码是否正确（5次错误后会冻结一段时间）
    let result = await this.store.verifyPass(password);
    if (result && result.msg) {
      obj.orderTipContent = result.msg;
      this.view.setState(obj);
      return;
    }
    let verify = await this.getUserInfo();
    // 校验是否设置资金密码
    if (verify.userTwoVerify.fundPwd === 1) {
      obj.orderTipContent = this.view.intl.get("asset-password-unset");
      this.view.setState(obj);
      return;
    }
    //不是谷歌二次，推荐谷歌二次
    if (verify.userTwoVerify.withdrawVerify !== 2) {
      this.view.setState({
        recoGoogle: true
      });
      return;
    }
    this.view.setState({
      showTwoVerify: true,
      verifyType: 0,
      verifyNum: this.view.intl.get("sendCode")
    });
  }

  //两步验证的确认操作(lang)
  async twoVerify(code, curExtract){
    let { verifyType, currency, address, password, extractAmount } = this.view.state;
    // 提币申请
    if(!verifyType) this.extractOrder({
      coinName: currency,
      toAddr: address.address,
      amount: Number(extractAmount),
      fundPass: password,
      code: code
    });
    // 添加地址
    if(verifyType){
      let obj = Object.assign({
        coinName: this.view.state.currency,
        code: code,
        account: '',
        mode: 2,
        os: 3
      }, this.view.state.newAddress[0]);
      let type = this.view.state.firstVerify;
        (type === 1 || type === 3) && (obj.account = this.account[type]);
        obj.mode = type%3;
      let result = await this.appendAddress(obj,curExtract);
      if(result) {
        this.view.setState({newAddress: [], showTwoVerify: false, addressInput: '', remark: ''})
      }
    }
  }

  // 获取我的QBT
  async getMyQbt() {
    let result = await this.activityController.getMyQbt();
    return result;
  }

  // 更新币币交易页委托币种可用(lang)
  updataMarketAvaile(pid) {
    if(!this.view || this.view.name !== "simple") return;
    if(pid!==undefined) this.view.tradePairId = pid;
    let curPair =
        this.view.state.pairFees &&
        this.view.state.pairFees.filter(
          item => item.id === this.view.tradePairId
        )[0],
        currencyArr = curPair && curPair.name.split("/"),
        avail1 = this.store.state.wallet.filter(
          item => item.coinName === (currencyArr && currencyArr[0])
        )[0],
        avail2 = this.store.state.wallet.filter(
          item => item.coinName === (currencyArr && currencyArr[1])
        )[0];
    this.TradePlanController &&
      this.TradePlanController.setWallet(
        (avail1 && avail1.availableCount) || 0,
        (avail2 && avail2.availableCount) || 0
      );
  }

  // 设置simple的state
  setSimpleAsset(o) {
    this.view && this.view.setState(o);
  }

  // websocke更新(lang)
  userAssetUpdate() {
    if (this.view && this.view.name === "simple") {
      this.setSimpleAsset({
        totalAsset: this.store.state.totalAsset,
        wallet: this.store.state.wallet
      });
      this.updataMarketAvaile();
    }
  }

  //OTC部分
  //资产列表-otc
  async getOtcAssets() {
    await this.store.getOtcTotalAsset();
    return {
      otcTotalAsset: this.store.state.otcTotalAsset,
      otcWallet: this.sort(this.store.state.otcWallet, ["coinName"], 0) || []
    }
  }
  //充币地址-otc
  async getOtcChargeAddress(coin) {
    await this.store.getOtcChargeAddress(coin);
    return {
      coinAddress: this.store.state.otcCoinAddress,
      address: this.store.state.otcCoinAddress.coinAddress
    }
  }

  async getOtcChargeMessage() {
    let result = await this.store.getOtcChargeMessage();
    return result;
  }

  //资产记录-otc
  async getOtcHistory(obj) {
    let result = await this.store.getOtcHistory(obj);
    return {
      assetHistory: result
    }
  }

  //充币记录-otc
  async getOtcChargeHistory(obj){
    let result = await this.store.getOtcChargeHistory(obj)
    return {
      assetHistory: result
    }
  }

  async getOtcWalletList() {
    this.store.state.otcWalletList["BTC"] === undefined && (await this.store.getOtcWalletList());
    return {
      walletList: this.store.state.otcWalletList,
      walletHandle: this.store.state.otcWalletHandle,
    }
  }

  // 获取单个币种资产信息-otc(flag表示不重新请求资产)
  async getOtcCurrencyAmount(coin, flag) {
    await this.store.getOtcCurrencyAmount(coin, flag);
    let obj = { currencyAmount: this.store.state.otcCurrencyAmount }
    return obj;
  }

  async transfer(obj) {
    obj.pass = this.RSAencrypt(obj.pass.trim());
    let result = await this.store.transfer(obj);
    return result;
  }


  //套利宝部分

  // 我的投资列表
  async getMyinvest(){
    let result = await this.store.getMyinvest();
    return { investArr: result }
  }

  async getFundAccount(coinId){
    await this.store.getFundAccount(coinId);
    return { fundAccount: this.store.state.fundAccount }
  }

  // 获取对应套利宝收益记录
  async getEarningsHistory(obj){
    let result = await this.store.getEarningsHistory(obj);
    return result;
  }

  // 赎回套利宝产品
  async redeem(obj){
    obj.fundPass = this.RSAencrypt(obj.fundPass.trim());
    let result = await this.store.redeem(obj);
    if(result && result.errCode) {
      this.setViewTip(false, result.msg);
      return;
    }
    this.popupController.setState({
      isShow: true,
      type:'tip1',
      msg: this.view.intl.get("optionSuccess"),
      autoClose: true,
      onClose:()=> goOrderPath('/fund/detail/confirm')
    });
    let res = await this.getMyinvest()
    return res;
  }

  async getBankCard(type){
    await this.store.getBankCard(type);
    return {
      cards: this.store.state.cards
    }
  }

  async getFundHistory(obj){
    let result = await this.store.getFundHistory(obj);
    return {
      assetHistory: result
    };
  }
  //套利宝资金划转
  async fundTransfer(obj) {
    obj.pass = this.RSAencrypt(obj.pass.trim());
    let result = await this.store.fundTransfer(obj);
    return result;
  }
}
