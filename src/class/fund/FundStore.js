import ExchangeStoreBase from '../../class/ExchangeStoreBase'

export default class TaolibaoStore extends ExchangeStoreBase {
  constructor() {
    super('fund');
    this.state = {
      fundList: [], // 产品数组
      // btc兑美元，美元兑人民币汇率
      rateBU: 6474.95,
      rateUC: 6.8690,
      // 我的投资套利宝
      investArr: [],
    }
  }

  setController(ctl) {
    this.controller = ctl
  }

  getCoin(text) { // 从字符串中截取英文
    return text.replace(/[^A-Z]+/ig,"");
  }

  async fundProduct(id) { // 获取用户信息
    let fundProduct = await this.Proxy.getFundProduct({
      productId: id
    });
    if(fundProduct.errCode) {
      fundProduct = []
    }
    let fundList = fundProduct && fundProduct.map(v => {
      return {
        id: v.productId, // 产品id
        coinId: v.coin_id, // 币种id
        fund: this.getCoin(v.name_cn).toUpperCase(),
        fundType: v.name_cn.search(/usd|cny/) < 0,
        name: this.controller.configController.language === 'zh-CN' ? v.name_cn.toUpperCase() : v.name_en.toUpperCase(), // 中文产品名称
        yields: v.profitRate, // 收益率
        totalAmount: v.totalAmount, // 总共份数
        remainAmount: v.remainAmount, // 剩余份数
        manager: v.manager, // 基金管理人
        riskLevel: v.riskLevel, // 风险等级  0:低风险
        earnStart: v.earningStart, // 起息时间 0：当天 1：次日
        // investAmount: v.ib * v.pb, // 起投金额 pb每份币种等价转化
        establish: v.establish, // 成立时间
        describe: this.controller.configController.language === 'zh-CN' ? v.descCn : v.descEn, // 描述
        redeemRate: v.redeemFeeRate, //赎回手续费
        investNum: v.minPurchase,// 起投份数
        investBase: v.portionBase, // 每份币种等价转化
        investAmount: v.minPurchase * v.portionBase, //起投金额
        isOpen: v.isOpen, // 否开放购买，0-开放 1-不开放
        isOver: v.op_status, // 是否下架，1-开放 2-不开放
        remainPercent: Number((v.remainAmount / v.totalAmount) * 100).toFixedUp(2),  // 剩余%
        buyAmount: v.totalAmount - v.remainAmount // 已购份数
      }
    });
    this.state.fundList = fundList;
    return fundList
  }

  async fundDeal(productId, amount, dealPass, token){
    let result = await this.Proxy.fundDeal({productId, amount, dealPass, token});
    return result
  }

  // 获取我的套利宝投资信息
  async getMyinvest(){
    let result = await this.Proxy.getMyFund({
      token: this.controller.token
    });
    this.state.investArr = result.map(v=>{
      return {
        id: v.pid,//产品id
        coinId: v.ci,//币种id
        currency: v.cn.toUpperCase(),//产品币种
        name: this.controller.lang === 'zh-CN' ? v.nc : v.ne,
        holdAsset: Number(v.hd.multi(v.pb)),//持有产品资产
        holdAmount: v.hd,//持有产品份数
        unitPrice: v.pb,//产品单价
        preEarnings: Number(v.le.multi(v.pb)),//昨日收益
        totalEarnings: Number(v.te.multi(v.pb)),//累计收益
        yearRate: v.er*100 + "%",//预期年化收益
        minRedeemMount: v.mr,//最小赎回份数（btc 0.001, usdt 1)
        fee: v.rfr,
        canBuy: v.pv >= 1,//是否可申购
        canRedeem: v.hd >= v.mr,//是否可赎回
        reg: new RegExp(`^[0-9]+\.?[0-9]{0,${v.mr.toString().split(".")[1] !== undefined ? v.mr.toString().split(".")[1].length : 0}}$`)
      }
    });
    return this.state.investArr;
  }

  // 获取对应套利宝收益记录
  async getEarningsHistory(obj){
    let result = await this.Proxy.fundHistory({
      token: this.controller.token,
      pid: obj.id,
      p: obj.page,
      ps: obj.pageSize,
    });
    return {
      total: result.t || 0,
      list: (result.l || []).map (v=>{
        return {date: v.d, earnings: v.e}
      })
    }
  }

  // 赎回套利宝产品
  async redeem(obj){
    let result = await this.Proxy.redeemFund({
      token: this.controller.token,
      "pid": obj.id, // 产品ID
      "a": Number(obj.amount), // 份数
      "fp": obj.fundPass // 密码
    });
    return result;
  }

}