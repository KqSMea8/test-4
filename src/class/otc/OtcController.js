
import Util from "@/core/libs/GlobalUtil";
import OtcStore from "./OtcStore";
import Storage from "@/core/storage"
import {goOrderPath, goUserPath, goLoginPath} from "@/config/UrlConfig"

export default class OtcController {
  constructor(props) {
    this.store = new OtcStore();
    this.store.setController(this);
    this.Storage = Storage;
  }
  setView(view) {
    this.view = view;
  }
  get initState() {
    return (this.store && Util.deepCopy(this.store.state)) || {};
  }

  get userId() {
    return this.userController.userId;
  }
  get token() {
    return this.userController.userToken;
  }
  async otcSales(currency, sale_id, uid, type, price, payment, page_no, count, min, state = 1){
    // flag && this.changeKey('uid', this.userId);
    // console.log('otcSales',currency, sale_id, uid, type, price, payment, page_no, count, min)
    let result = await this.store.otcSales(currency, sale_id, uid, type, price, payment, page_no, count, min, state);
    return result
  }

  async canDealCoins(flag = true){
    let result = await this.store.canDealCoins();
    let coins =[];
    result.coins && result.coins.map((v, index) => {
      if(index >= 4)
        return
      coins.push(v.currency)
    });
    // flag && result.coins && this.changeKey('currency', coins[0]);
    // result.coins && this.changeKey('currencyArr', coins);
    return coins
  }

  async traderInfo(){
    let result = await this.store.traderInfo();
    return result
  }
  // 改变store中请求参数
  changeKey(key, value){
    this.store.state [key] = value
  }

  //发布新广告前的前端验证
  verifyNewSale(obj){
    let msg = '';
    if(obj.type === 1 && !obj.tradeable) {
      msg = this.view.intl.get('otc-publish-tip1')
      return msg;
    }
    if(obj.mode === 1 && !obj.price) {
      msg = this.view.intl.get('otc-publish-tip2')
      return msg;
    }
    if(obj.type === 2 && obj.mode === 2 && obj.price !== '' && Number(obj.price) < Number(this.view.state.price)) {
      msg = this.view.intl.get('otc-publish-tip3')
      return msg;
    }
    if(obj.min < 100) {
      msg = this.view.intl.get('otc-publish-tip4')
      return msg;
    }
    if(obj.min >= obj.max) {
      msg = this.view.intl.get('otc-publish-tip5')
      return msg;
    }
    if(!obj.payment){
      msg = this.view.intl.get('otc-publish-tip6')
      return msg;
    }
  }
  //发布新广告
  async otcNewSale(obj){
    let result = await this.store.otcNewSale(obj);
    if(result && result.errCode) {
      if(result.ret === 424) {
        this.popupController.setState({
          type: 'confirm',
          isShow: true,
          msg: result.msg,
          confirmText: this.view.intl.get('otc-to-set'),
          onConfirm: ()=>{
            goUserPath('/safe')
          }
        })
        return
      }
      this.popupController.setState({
        type: 'tip3',
        isShow: true,
        msg: result.msg,
        autoClose: true,
      })
      return;
    }
    this.popupController.setState({
      type: 'tip1',
      isShow: true,
      msg: this.view.intl.get('otc-publish-success'),
      onClose:()=>{
        this.view.props.history.push('/myAd')
      },
      autoClose: true,
    })
  }
  //获取币种价格列表
  async getPriceList(){
    await this.store.getPriceList();
    return {
      priceMap:this.store.state.priceList
    }
  }
  //获取所有广告最低出售价或最高收购价
  async getBoundaryPrice(type){
    await this.store.getBoundaryPrice(type);
    let obj={};
    obj[`${type}PriceMap`] = this.store.state[`${type}PriceMap`]
    return obj;
    // if(result && result.prices) {
    //   this.state.priceList = result.prices;
    // }
  }
  async getOtcAssets(){
    let result = await this.assetController.getOtcAssets()
    let obj = { BTC: 0 };
    if(result.otcWallet) {
      result.otcWallet.forEach(v => {
        obj[v.coinName.toUpperCase()] = v.availableCount
      });
    }
    return {balance: obj};
  }

  async otcApplyStore(name){
    let result = await this.store.otcApplyStore(name);
    // console.log(1111, result)
  }

  // 广告上下架操作
  async otcHandleSale(ids, online){
    let result = await this.store.otcHandleSale(ids, online);
    return result
  }
  //广告删除
  async otcDelSale(id){
    let result = await this.store.otcDelSale(id);
    return result
  }
  // 快速购买
  async quickBuy(currency, payment, amountmc){
    let result = await this.store.quickBuy(currency, payment, amountmc);
    return result
  }
  // 广告列表进入确认订单
  enterConfirm(v){
    let login = this.userId;
    let authenState = v.authenState;
    if(!login){
      this.popupController.setState({
        isShow: true,
        type: 'custom',
        icon: 'warning',
        confirmText: this.view.intl.get('header-login'),
        cancelText: this.view.intl.get('otc-cancel'),
        msg: this.view.intl.get('otc-login-tip'),
        onConfirm: () => {goLoginPath()}
      });
      return
    }
    if((!this.view.getPaymentAccounts || this.view.getPaymentAccounts && !this.view.getPaymentAccounts.length ) && v.type === 'sell'){
      this.popupController.setState({
        isShow: true,
        type: 'custom',
        icon: 'warning',
        confirmText: this.view.intl.get('set'),
        cancelText: this.view.intl.get('otc-cancel'),
        msg: this.view.intl.get('otc-payment-tip'),
        onConfirm: () => {goUserPath('/safe')}
      });
      return;
    }
    if(authenState === 0){
      this.popupController.setState({
        isShow: true,
        type: 'custom',
        icon: 'warning',
        confirmText: this.view.intl.get('otc-regist-name'),
        cancelText: this.view.intl.get('otc-cancel'),
        msg: this.view.intl.get('otc-verify-tip'),
        onConfirm: () => {goUserPath('/identity')}
      });
      return;
    }
    if(authenState === 1){
      this.popupController.setState({
        isShow: true,
        type: 'tip2',
        msg: this.view.intl.get('otc-wait-verify'),
      });
      return;
    }
    goOrderPath('/otc/confirm', {id: v.id, trader: v.trader})
  }
}
