import ExchangeStoreBase from "../ExchangeStoreBase";

export default class AssetStore extends ExchangeStoreBase {
  constructor() {
    super("asset", "general");
    this.otArr = {
      1: 1,
      15000: 2,
      5: 4,
      17000: 8,
      17001: 16,
    }

    this.state = {

      pairFees: [],// 交易对手续费
      // 总资产
      totalAsset: {
        valuationBTC: 0, //总资产
        valuationEN: 0, //换算美元
        valuationCN: 0, //换算人民币
        totalQuota: 0, //24小时提现额度
        availableQuota: 0, //可用额度
        usedQuota: 0, //已用额度
        auth: false
      },
      wallet: [],
      walletList: {},//币种列表
      walletHandle: {},//是否可充提可交易
      walletData:[],//币种资产列表
      // 获取单个币种资产及提现额度
      currencyAmount: {
        coinName: "BTC",
        availableCount: 0, //可用额度
        totalCount: 0, //总额度
        frozenCount: 0, //冻结额度
        totalQuota: 0, //24H提现额度
        availableQuota: 0, //可用提现额度
        usedQuota: 0, //已用额度
        auth: false, //是否身份认证
      },
      //提币信息
      walletExtract: {
        minerFee: 0, //矿工费
        extractAddr: [] //提现地址
      },
      //充币地址
      coinAddress: {},
      assetHistory: {
        total: 0,
        orderList: []
      },

      //otc部分
      otcTotalAsset: {
        valuationBTC: 0, //总资产
        valuationEN: 0, //换算美元
        valuationCN: 0, //换算人民币
      },
      otcWallet:[],//资产列表
      otcWalletList:{},//币种列表
      otcWalletHandle: {},//是否可充提可交易
      otcCoinAddress: {},//充币地址
      // 单个币种资产
      otcCurrencyAmount: {
        availableCount: 0, //可用额度
        totalCount: 0, //总额度
        frozenCount: 0, //冻结额度
      },
      otcHistory: {
        total: 0,
        orderList: []
      },



      //套利宝部分

      // 我的投资套利宝
      investArr: [ ],
      fundAccount: {
        totalCountBTC: 0,
        totalCountCN: 0,
        totalCountEN: 0,
        accountList:[{
          coinName: 'BTC',
          availableCount: 0,
          lockCount: 0,
          totalCount: 0,
          totalCountCN: 0,
          totalCountEN: 0,
          totalCountBTC: 0,
        }]
      },
      rate:{},
      cards: [],

      // 资产记录
      fundHistory: {
        total: 0,
        orderList: []
      },
    };

    // websocket监听用户资产更新推送
    this.WebSocket.general.on("userAssetUpdate", data => {
      let { va, vae, vac, cl } = data;
      this.state.totalAsset.valuationBTC = va; //总资产
      this.state.totalAsset.valuationEN = vae; //换算美元
      this.state.totalAsset.valuationCN = vac; //换算人民币
      this.state.wallet = cl.map(({ cn, fn, cic, cid, avc, frc, va, c, w, e, vac, vae}) => (
        {
          coinName: cn,
          fullName: fn,
          coinIcon: cic, //币种icon
          coinId: cid,
          availableCount: avc, //可用余额
          frozenCount: frc, //冻结余额
          valuationBTC: va, //btc估值
          totalCount: Number(avc).plus(frc), //总量
          valuationCN: vac,
          valuationEN: vae,
          c: c,
          w: w,
          e: e
        })
      );
      // this.controller.taolibaoController.changeAsset(this.state.wallet);
      this.controller.userAssetUpdate();
    });
  }

  setController(ctl) {
    this.controller = ctl
  }

  setStoreState(obj){
    Object.assign(this.state, obj);
  }

  async getFee() {
    let result = await this.Proxy.getFee({
      token: this.controller.token
    });
    result && result.length
      ? (result = result.map(v => {
          return {
            id: v.id,
            name: v.na,
            taker: v.t,
            maker: v.m
          };
        }))
      : (result = []);
    this.state.pairFees = result;
    return result;
  }

  // 获取总资产
  async getTotalAsset() {
    let { va, vae, vac, cl } = await this.Proxy.totalAsset({token: this.controller.token});
    this.state.wallet =
      (cl && cl.map(({ cn, fn, cic, cid, avc, frc, va, c, w, e, vac, vae}) => (
          {
            coinName: cn,
            fullName: fn,
            coinIcon: cic, //币种icon
            coinId: cid,
            availableCount: avc, //可用余额
            frozenCount: frc, //冻结余额
            valuationBTC: va, //btc估值
            totalCount: Number(avc).plus(frc),//总量
            valuationCN: vac,
            valuationEN: vae,
            c:c,
            w:w,
            e:e
          })
        )) || [];

    let { toq, avq, usq, usv} = await this.Proxy.balance({
      id: 0,
      token: this.controller.token
    });
    this.state.totalAsset = {
      valuationBTC: va, //总资产
      valuationEN: vae, //换算美元
      valuationCN: vac, //换算人民币
      totalQuota: toq, //24小时提现额度
      availableQuota: avq, //可用额度
      usedQuota: usq, //已用额度
      auth: usv
    };
  }

  // 获取walletList
  async getWalletList() {
    let result = await this.Proxy.getAllCoinList();
    if (result && result.l && result.l.length) {
      this.state.walletData = result.l;
      let walletList = {}, walletHandle = {};
      this.controller.sort(result.l, ["n"], 1).forEach(v => {
        walletList[v.n.toUpperCase()] = v.id;
        walletHandle[v.n.toUpperCase()]= {
          c: v.c,
          w: v.w,
          e: v.e
        };
      });
      this.state.walletList = walletList;
      this.state.walletHandle = walletHandle;
    }
  }

  //获取全部币种，提币费率
  async getAllCoin() {
    let res = await this.Proxy.getAllCoinList();
    return res && res.l.map(v=>({
      coin:v.n,
      coinFull: v.en,
      num: v.mw,
      fee: v.mf,
      coinImg:v.cl
    })) || [];
  }

  // 获取单个币种资产信息
  async getCurrencyAmount(coin) {
    if(this.state.walletList['BTC'] === undefined)
      await this.getWalletList();
    let result = await this.Proxy.balance({
      id: this.state.walletList[coin],
      token: this.controller.token
    });
    if (result && result.errCode) return result;
    this.state.currencyAmount = {
      availableCount: result.avc, //当前币种可用余额
      totalCount: result.toc, //当前币种总余额
      frozenCount: result.frc, //当前币种冻结额度
      totalQuota: result.toq, //24H提现额度
      availableQuota: result.avq, //可用提现额度
      usedQuota: result.usq,
      auth: result.usv
    };
    return this.state.currencyAmount;
  }

  // 获取充币地址
  async getChargeAddress(coin) {
    let result = await this.Proxy.chargeAddress({
      id: this.state.walletList[coin],
      token: this.controller.token
    });
    this.state.coinAddress = {
      coinId: this.state.walletList[coin], //币种ID
      verifyNumber: result.ven || '', //最大确认数
      coinAddress: result.cad || ''//地址
    }
  }

  // 清空充提记录
  initHistory() {
    this.state.assetHistory.orderList = [];
    this.state.assetHistory.total = 0;
    this.state.otcHistory.orderList = [];
    this.state.otcHistory.total = 0;
    this.state.fundHistory.orderList = [];
    this.state.fundHistory.total = 0;
  }

  // 获取确认中充币信息(顶部轮播)
  async getChargeMessage() {
    let result = await this.Proxy.history({
      token: this.controller.token,
      id: -1, //如果不设定 传-1 coin id
      na: -1, //coin name
      ot: 1, //充1提2转4  注意:交易所内提币收方显示为转账  所有状态传-1，如果需要两种状态则将需要的状态相与（|） //order type
      st: -1, //不设定传-1 都传Unix秒 start time
      et: -1, //不设定传-1 都传Unix秒 end time
      ost: 0, //所有状态传-1 //order status
      p: 0, //page
      s: 0 //page size
    });
    if (result && result.errCode) return [];
    return result.ol.filter(v => v.dc !== v.vc).map(v =>(
      {
        orderType: 1,
        orderStatus: v.ost,
        fullname: v.fna,
        coinIcon: v.cic,
        coinName: v.cna,
        coinId: v.cid,
        count: v.cou,
        balance: v.bla, //余额
        postAddress: v.psa, //发送地址
        receiveAddress: v.rea, //接收地址
        fee: v.fee, //手续费
        verifyCount: v.vc, //确认数
        doneCount: v.dc || '0', //已确认数
        hashAddress: v.ha, //hash地址
        blockSite: v.bs, //点击查看交易信息的地址
        orderTime: v.t,
        orderId: v.oid
      })
    );
  }

  // 获取资产记录
  async getHistory({ coinId, coinName, orderType, startTime, endTime, orderStatus, page, pageSize }) {
    let result = await this.Proxy.history({
      token: this.controller.token,
      id: coinId, //如果不设定 传-1 coin id
      na: coinName, //coin name
      ot: orderType, //充1提2转4  注意:交易所内提币收方显示为转账  所有状态传-1，如果需要两种状态则将需要的状态相与（|） //order type
      st: startTime, //不设定传-1 都传Unix秒 start time
      et: endTime, //不设定传-1 都传Unix秒 end time
      ost: orderStatus === 0 ? 0 : (orderStatus || -1), //所有状态传-1 //order status
      p: page, //page
      s: pageSize //page size
    });
    if (result && result.errCode) {
      this.state.assetHistory.orderList = [];
      this.state.assetHistory.total = 0;
      return this.state.assetHistory;
    }
    this.state.assetHistory.orderList =
      result && result.ol.map(v =>(
        {
          orderType: this.otArr[v.ot] || v.ot,
          orderStatus: v.ost,
          fullname: v.fna,
          coinIcon: v.cic,
          coinName: v.cna,
          coinId: v.cid,
          count: v.cou,
          balance: v.bla, //余额
          postAddress: v.psa, //发送地址
          receiveAddress: v.ot === 17000 ? 'exchange' : v.rea, //接收地址
          fee: v.fee, //手续费
          verifyCount: v.vc, //确认数
          doneCount: v.dc, //已确认数
          hashAddress: v.ha, //hash地址
          blockSite: v.bs, //点击查看交易信息的地址
          orderTime: v.t,
          orderId: v.oid
        })
      );
    page === 0 && !result.tc && (this.state.assetHistory.total = 0);
    page === 0 && result.tc && (this.state.assetHistory.total = result.tc);
    return this.state.assetHistory;
  }

  // 导出资产记录
  async exportHistory() {
    let result = await this.Proxy.history({
      token: this.controller.token,
      id: -1, //如果不设定 传-1 coin id
      na: -1, //coin name
      ot: -1, //充1提2转4  注意:交易所内提币收方显示为转账  所有状态传-1，如果需要两种状态则将需要的状态相与（|） //order type
      st: -1, //不设定传-1 都传Unix秒 start time
      et: -1, //不设定传-1 都传Unix秒 end time
      ost: -1, //所有状态传-1 //order status
      p: 0, //page
      s: 0 //page size
    });
    if (result && result.errCode) return [];
    return result.ol.map(v => (
      {
        orderType: v.ot,
        orderStatus: v.ost,
        fullname: v.fna,
        coinIcon: v.cic,
        coinName: v.cna,
        coinId: v.cid,
        count: v.cou,
        balance: v.bla, //余额
        postAddress: v.psa, //发送地址
        receiveAddress: v.rea, //接收地址
        fee: v.fee, //手续费
        verifyCount: v.vc, //确认数
        doneCount: v.dc, //已确认数
        hashAddress: v.ha, //hash地址
        blockSite: v.bs, //点击查看交易信息的地址
        orderTime: v.t,
        orderId: v.oid
      })
    );
  }

  // 获取矿工费
  async getMinerFee(coin, address) {
    let result = await this.Proxy.minerFee({
      id: this.state.walletList[coin],
      add: address,
      token: this.controller.token
    });
    this.state.walletExtract.minerFee = result.fee;
  }

  // 获取提币地址信息
  async getwalletExtract() {
    if(this.state.walletExtract.extractAddr && this.state.walletExtract.extractAddr.length) return this.state.walletExtract;
    let result = await this.Proxy.extractAddress({token: this.controller.token});
    if (result && result.errCode) return result;
    this.state.walletExtract.extractAddr = result.add.map(v =>(
      {
        coinId: v.id,
        coinName: v.na,
        minCount: v.mic, //最小提币数量
        addressList: v.adl.map(i =>(
          {
            addressId: i.aid,
            addressName: i.ana,
            address: i.add
          })
        )
      })
    );
    return this.state.walletExtract;
  }

  // 提交提币订单
  async extractOrder(obj) {
    obj.fundPass = this.controller.RSAencrypt(obj.fundPass);
    let result = await this.Proxy.extractOrder({
      token: this.controller.token,
      id: this.state.walletList[obj.coinName], //coin id
      na: obj.coinName.toLowerCase(), //coin name
      tad: obj.toAddr, //to addre
      a: obj.amount, //amount
      // "rm": obj.remark,// 备注，可空remark
      fp: obj.fundPass, //资金密码
      cd: obj.code, //code
      ac: obj.account, // Googlecode传空 account
      md: obj.mode,//mode
      os: 3
    });
    if (result && result.ri !== undefined) {
      result = {
        recordId: result.ri,
        status: result.sta, // 0 审核 1通过 2未通过 4处理
        quota: result.qut // 是否超出限额
      };
    }
    return result;
  }

  // 增加提现地址
  async appendAddress({ coinName, addressName, address, code, account, mode, os=3}) {
    let result = await this.Proxy.addAddress({
      token: this.controller.token,
      id: this.state.walletList[coinName], //coin id
      na: coinName.toLowerCase(), //coin name
      ana: addressName, //address name
      add: address,//address
      cd: code,
      ac: account,
      md: mode,
      os: os
    });
    if (result && result.errCode) return result;
    this.state.walletExtract.extractAddr.forEach(v => {
      v.coinId === this.state.walletList[coinName] &&
        v.addressList.push({
          addressName: addressName,
          address: address,
          addressId: result.aid
        });
    });
    return this.state.walletExtract;
  }

  // 删除提现地址
  async deletAddress({ coinName, addressId, addressName, address }) {
    let result = await this.Proxy.delAddress({
      aid: addressId,
      token: this.controller.token
    });
    if (result && result.errCode) return result;
    this.state.walletExtract.extractAddr.forEach(v => {
      v.coinId === this.state.walletList[coinName] &&
        (v.addressList = v.addressList.filter(
          item => item.address !== address
        ));
    });
    return this.state.walletExtract;
  }

  // 验证资金密码
  async verifyPass(fundPass) {
    let result = await this.Proxy.verifyFundPass({
      token: this.controller.token,
      fpd: this.controller.RSAencrypt(fundPass)
    });
    return result;
  }


//OTC部分

async getOtcWalletList() {
  let result = await this.Proxy.otcAccount({token: this.controller.token});
  if(result && result.asl){
    this.state.otcWallet = result.asl.map(({ cn, cic, cid, avc, frc, c, w, e, vac, vae}) => (
      {
        coinName: cn,
        coinIcon: cic, //币种icon
        coinId: cid,
        availableCount: avc, //可用余额
        frozenCount: frc, //冻结余额
        totalCount: Number(avc).plus(frc),//总量
        valuationCN: vac,
        valuationEN: vae,
        c:c,
        w:w,
        e:e
      })
    ) || [];
    result.asl.forEach(item => {
      let key = item.cn.toUpperCase();
      this.state.otcWalletList[key] = item.cid;
      this.state.otcWalletHandle[key] = {
        c: item.c,
        w: item.w,
        e: item.e
      };
    })
  }

}

async getOtcTotalAsset() {
  let { asl } = await this.Proxy.otcAccount({token: this.controller.token});
  if(asl && asl.length){
    this.state.otcTotalAsset = {
      valuationBTC: 0,
      valuationEN: 0,
      valuationCN: 0
    }
    this.state.otcWallet = asl.map(({ cn, cic, cid, avc, frc, c, w, e, vac, vae, vab}) => {
      let key = cn.toUpperCase();
      this.state.otcWalletList[key] = cid;
      this.state.otcWalletHandle[key] = {
        c: c,
        w: w,
        e: e
      };
      this.state.otcTotalAsset.valuationBTC = Number(this.state.otcTotalAsset.valuationBTC.plus(vab))
      this.state.otcTotalAsset.valuationEN = Number(this.state.otcTotalAsset.valuationEN.plus(vae))
      this.state.otcTotalAsset.valuationCN = Number(this.state.otcTotalAsset.valuationCN.plus(vac))
      return {
        coinName: cn,
        coinIcon: cic, //币种icon
        coinId: cid,
        availableCount: avc, //可用余额
        frozenCount: frc, //冻结余额
        totalCount: Number(avc.plus(frc)),//总量
        valuationCN: vac,
        valuationEN: vae,
        c:c,
        w:w,
        e:e
      }
    }) || [];
  }
  // let { toq, avq, usq, usv} = await this.Proxy.balance({
  //   id: 0,
  //   token: this.controller.token
  // });
}

async getOtcChargeAddress(coin) {
  let result = await this.Proxy.otcChargeAddress({
    token: this.controller.token,
    coinName: coin.toLowerCase(),
  });
  this.state.otcCoinAddress = {
    coinId: this.state.otcWalletList[coin], //币种ID
    verifyNumber: result.ven || '', //最大确认数
    coinAddress: result.cad || ''//地址
  }
}

 // 获取单个币种资产信息-otc(flag表示重新请求资产)
async getOtcCurrencyAmount(coin, flag) {
  if(!flag) await this.getOtcTotalAsset();
  let obj = this.state.otcWallet.filter(v=>v.coinName.toUpperCase() === coin)[0]
  if(!obj) return;
  this.state.otcCurrencyAmount = {
    availableCount: obj.availableCount, //当前币种可用余额
    totalCount: Number(obj.availableCount).plus(obj.frozenCount), //当前币种总余额
    frozenCount: obj.frozenCount, //当前币种冻结额度
  };
}

// 获取otc充币记录
async getOtcChargeHistory(obj) {
  obj.token = this.controller.token;
  let result = await this.Proxy.otcChargeHistory(obj)
  if (result && result.errCode) {
    this.state.otcHistory.orderList = [];
    this.state.otcHistory.total = 0;
    return this.state.otcHistory;
  }
  result && result.recordList && (this.state.otcHistory.orderList =
    result.recordList.map(v =>(
      {
        orderTime: v.create,
        coinName: v.coinName.toUpperCase(),
        count: v.amount,
        receiveAddress: v.to,
        orderStatus: v.status === 1 ? 0 : !v.status ? 1 : v.status,
        blockSite: v.blockSite,
        doneCount: v.verifyCount,
        verifyCount: v.totalCount,
      })
    ));
  obj.page === 0 && !result.count && (this.state.otcHistory.total = 0);
  obj.page === 0 && result.count && (this.state.otcHistory.total = result.count);
  return this.state.otcHistory;
}

// 获取确认中充币信息(otc顶部轮播)
async getOtcChargeMessage() {
  let result = await this.Proxy.otcChargeHistory({
    token: this.controller.token,
    "status":-1,
    "page":0,
    "size":10
  });
  if (result && result.errCode) return [];
  return result && result.recordList && result.recordList.filter(v => v.totalCount !== v.verifyCount).map(v =>(
    {
      orderTime: v.create,
      coinName: v.coinName.toUpperCase(),
      count: v.amount,
      doneCount: v.verifyCount,
      verifyCount: v.totalCount,
    })
  ) || [];
}


async getOtcHistory({ coinName, dir, startTime, endTime, page, pageSize }) {
  let result = await this.Proxy.otcHistory({
    token: this.controller.token,
    "coinName": coinName,
    "catalog": dir,//1充值; 2提币; 3买入; 4卖出; 11转入 12转出;
    "startTime": startTime,
    "endTime": endTime,
    "page": page,
    "size": pageSize,
  });

  if (result && result.errCode) {
    this.state.otcHistory.orderList = [];
    this.state.otcHistory.total = 0;
    return this.state.otcHistory;
  }
  let list = result && result.recordsList || [];
  this.state.otcHistory.orderList =
    list.map(v =>(
      {
        dir: v.catalog,
        orderStatus: v.status,
        count: v.amount,
        coinName: v.coinName.toUpperCase(),
        orderTime: v.create,
        orderId: v.id,
      })
    );
  page === 0 && !result.count && (this.state.otcHistory.total = 0);
  page === 0 && result.count && (this.state.otcHistory.total = result.count);
  return this.state.otcHistory;
}

//资金划转
async transfer(obj){
  obj.token = this.controller.token;
  let flag = obj.dir, result;
  delete obj['dir']
  if(flag){
    result = await this.Proxy.transferIn(obj);
    return result;
  }
  result = await this.Proxy.transferOut(obj);
  return result;
}



//套利宝部分
   // 获取我的套利宝投资信息
   async getMyinvest(){
    let result = await this.Proxy.getMyFund({
      token: this.controller.token
    });
    if(result && result.data){
      this.state.investArr = result.data.map(v=>{
        let holdingAmount = v.totalAmount,
            islegal = ['CNY', 'USD'].includes(v.coinName.toUpperCase()) ? true : false,
            digit = v.portionBase.toString().split(".")[1] !== undefined ? v.portionBase.toString().split(".")[1].length : 0,
            amountDigit =  islegal ? 2 - digit : 8 - digit;
        return {
          id: v.productId,//产品id
          currency: v.coinName,//产品币种
          name: this.Storage.language.get() === 'zh-CN' ? v.productNameCn.toUpperCase() : this.Storage.language.get() === 'en-US' ? v.productNameEn.toUpperCase() : v.productNameCn.toUpperCase(),
          holdAsset: Number(holdingAmount.multi(v.portionBase)).format(islegal ? { number: "legal", style: { decimalLength: 2 }} : { number: "property" , style:{ decimalLength: 8}}),//持有产品资产
          holdAmount: holdingAmount.format({ number: "digital", style: { decimalLength: amountDigit }}),//持有产品份数
          canRedeemAsset: Number(v.validAmount.multi(v.portionBase)).format(islegal ? { number: "legal", style: { decimalLength: 2 }} : { number: "property" , style:{ decimalLength: 8}}),//可赎回的资产
          canRedeemAmount: v.validAmount.format({ number: "digital", style: { decimalLength: amountDigit }}),//可赎回的份额
          unitPrice: v.portionBase,//产品单价
          preEarnings: Number(v.lastEarning).format(islegal ? { number: "legal", style: { decimalLength: 2 }} : { number: "property" , style:{ decimalLength: 8}}),//昨日收益
          totalEarnings: Number(v.totalEarning).format(islegal ? { number: "legal", style: { decimalLength: 2 }} : { number: "property" , style:{ decimalLength: 8}}),//累计收益
          yearRate: v.profitRate + "%",//预期年化收益
          minRedeemMount: v.minRedeem,//最小赎回份数（btc 0.001, usdt 1)
          canBuy: v.remainAmount > 0 && v.op_status === 1 ,
          canRedem: v.validAmount > 0 ? true : false,
          fee: v.redeemFeeRate,
          reg: new RegExp(`^[0-9]+\.?[0-9]{0,${amountDigit}}$`)
        }
      })
    }
    return this.state.investArr;
  }

  async getFundAccount(coinId){
    let rate=[], result;
    result = await this.Proxy.fundAccount({
      token: this.controller.token,
      coinId: !coinId && coinId !== 0 ? -1 : coinId
    });
    // console.log(this)
    !rate.BTC && (rate = await this.controller.marketController.getRate())
    if(!result || !result.data || !result.data.length) return;
      rate.forEach(v => {
        this.state.rate[v.na.toUpperCase()] = {
          cny: v.cr,
          usd: v.ur
        }
      });
      // console.warn(this.state.rate)
    this.state.fundAccount.totalCountCN = 0;
    this.state.fundAccount.totalCountEN = 0;
    this.state.fundAccount.totalCountBTC = 0;
    this.state.fundAccount.accountList = result.data.map( v => {
      let totalCount = Number(v.avail.plus(v.Lock)),
          coinName = v.coinName.toUpperCase();
          this.state.rate[coinName]['btc'] = coinName === 'BTC' ? 1 : Number(Number(totalCount.multi(this.state.rate[coinName]['cny'])).div(this.state.rate['BTC']['cny']));
      let totalCountCN = Number(totalCount.multi(this.state.rate[coinName]['cny'])),
          totalCountEN = Number(totalCount.multi(this.state.rate[coinName]['usd'])),
          totalCountBTC = Number(totalCount.multi(this.state.rate[coinName]['btc']));
          this.state.fundAccount.totalCountCN += totalCountCN;
          this.state.fundAccount.totalCountEN += totalCountEN;
          this.state.fundAccount.totalCountBTC += totalCountBTC;
      return {
        coinName: coinName,
        coinImage: v.coinImage,
        availableCount: v.avail,
        lockCount: v.Lock,
        totalCount: totalCount,
        totalCountCN: totalCountCN,
        totalCountEN: totalCountEN,
        totalCountBTC: totalCountBTC
      }
    })
  }

//套利宝资产记录
  async getFundHistory({page, pageSize}){
    let result = await this.Proxy.fundHistory({
      token: this.controller.token,
      pageNo: page,
      pageSize: pageSize,
    });
    if (result && result.errCode) {
      this.state.fundHistory.orderList = [];
      this.state.fundHistory.total = 0;
      return this.state.fundHistory;
    }
    //'类型 0:购买 1:赎回 2: 转至币币账户 3：由币币账户转入'
    let mapType={
      0: 4,
      1: 3,
      2: 12,
      3: 11,
    }

    let list = result && result.data || []
    this.state.fundHistory.orderList =
      list.map(v =>(
        {
          dir: mapType[v.type],
          count: v.amount,
          coinName: v.coinName || 'xxx',
          coinId: v.coinId,
          orderTime: v.createTime,
          fee: v.fee
        })
      );
    page === 1 && !result.page.total && (this.state.fundHistory.total = 0);
    page === 1 && result.page.total && (this.state.fundHistory.total = result.page.total);
    return this.state.fundHistory;
    // return result;
  }

  // 获取对应套利宝收益记录
  async getEarningsHistory(obj){
    let result = await this.Proxy.earningsHistory({
      token: this.controller.token,
      productId: obj.id,
      pageNo: obj.page,
      pageSize: obj.pageSize,
    });
    return {
      total: result && result.page && result.page.total || 0,
      list: (result && this.controller.sort(result.data, ['createTime'], 0) || []).map (v=>{
        return {date: v.createTime, earnings: v.earn}
      })
    }
  }

  async getBankCard(type){
    let result = await this.Proxy.bankCard({
      token: this.controller.token,
      cardType: type
    });
    if(result && result.cards) this.state.cards = result.cards.map(v=>{
      v.name = v.number;
      return v
    });
  }

  // 赎回套利宝产品
  async redeem(obj){
    let result = await this.Proxy.redeemFund({
      token: this.controller.token,
      "productId": obj.id, // 产品ID
      "amount": Number(obj.amount), // 份数
      "dealPass": obj.fundPass,// 密码
      "cardId": Number(obj.cardId)
    });
    return result;
  }

  //套利宝资金划转
  async fundTransfer(obj) {
    obj.token = this.controller.token;
    let result = await this.Proxy.fundTransfer(obj);
    return result;
  }
}
