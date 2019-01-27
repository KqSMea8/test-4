import Util from "@/core/libs/GlobalUtil";
import Crypto from "@/core/libs/Crypto"
// locale data

import TaolibaoStore from './FundStore'

export default class TaolibaoController {
  constructor() {
    this.store = new TaolibaoStore();
    this.store.setController(this);
    this.RSAencrypt = Crypto;
  }

  setView(view) {
    this.view = view;
  }
  get initState() {
    return (this.store && Util.deepCopy(this.store.state)) || {};
  }

  get token() {
    return this.userController.userToken;
  }

  get lang() {
    return this.configController.language;
  }

  // 获取产品信息
  async initData(id) {
    let fundList = await this.store.fundProduct(id);
    return {fundList};
  }

  // 获取我的套利宝投资信息
  async getMyinvest(flag){
    let result = await this.store.getMyinvest();
    return { investArr: result }
  }

  // 获取对应套利宝收益记录
  async getEarningsHistory(obj){
    let result = await this.store.getEarningsHistory(obj);
    return result;
  }

  // 赎回套利宝产品
  async redeem(obj){
    if(obj.fundPass.trim() === '') {
      this.popupController.setState({
        isShow: true,
        type: 'tip3',
        msg: this.view.intl.get("tlb-invest-inputPassword"),
        autoClose: true
      });
      return;
    }
    obj.fundPass = this.RSAencrypt(obj.fundPass.trim());
    let result = await this.store.redeem(obj);
    if(result && result.errCode) {
      this.popupController.setState({
        isShow: true,
        type:'tip3',
        msg: result.msg,
        autoClose: true
      });
      return;
    }
    this.popupController.setState({
      isShow: true,
      type:'tip1',
      msg: this.view.intl.get("optionSuccess"),
      autoClose: true
    });
    let res = await this.getMyinvest()
    return res;
  }

  // 申购
  async fundDeal(productId, amount, fundPass){
    let token = this.userController.userToken,
        dealPass = this.RSAencrypt(fundPass);
    return await this.store.fundDeal(productId, amount, dealPass, token);
  }

  //渲染资产变动
  changeAsset(value){
    if(this.view && this.view.name === 'fundDetail'){
      let assetAmount = value.find(v => v.coinName.toUpperCase() === this.view.state.fund);
      assetAmount = assetAmount.availableCount;
      this.view.setState({assetAmount})
    }

  }
}