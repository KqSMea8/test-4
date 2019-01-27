import OrderListController from '../OrderListController.js'
import Util from "@/core/libs/GlobalUtil";
import Crypto from "@/core/libs/Crypto"
import exportExcel from "@/core/exportExcel"
import UserOrderListStore from './UserOrderListStore'

export default class UserOrderListController extends OrderListController {
  constructor(props) {
    super(props)
    this.store = new UserOrderListStore();
    this.store.setController(this)
    this.RSAencrypt = Crypto;
    this.exportExcel = exportExcel;
  }

  setView(view) {
    this.view = view
  }
  get initState() {
    return (this.store && Util.deepCopy(this.store.state)) || {};
  }

  // 数据的请求以及处理
  orderListHandle(type, params) {
    type === 'orderCurrent' && this.getCurrentOrder(type, params);
    type !== 'orderCurrent' && this.getHistoryOrder(type, params);
  }

  getFundOrder(params) {
    return this.store.getFundOrder(params)
  }

  markFundOrder(params) {
    return this.store.markFundOrder(params)
  }

  changeTradePairId(value) {
    let idArray = [];
    idArray.push(value);
    this.store.state.tradePairId = value;
    let currentParams = {
      idArray,
      "orderType": 2,
    };
    let historyParams = {
      idArray,
      "orderType": 2,
      "orderStatus": [2, 3, 4, 5, 6, 7, 8],
      "startTime": Math.floor(new Date().getTime() / 1000) - 7 * 24 * 60 * 60,
      "endTime": Math.floor(new Date().getTime() / 1000),
      "page": 1,
      "pageSize": 10
    };
    this.getCurrentOrder(false, currentParams);
    this.getHistoryOrder(false, historyParams);
  }

  changeTradePairIdPro(value) {
    this.store.state.tradePairId = value;
    this.getOrderDataPro()
  }

  //更改订单类型
  changeItemsType(value) {
    this.store.state.orderItemsType = value.type;
    this.view.setState(
        {
          orderItemsType: value.type,
          proOrderData: []
        }
    )
    if (value.type > 2) return;
    this.getOrderDataPro();
  }

  //隐藏其他交易对
  hideOther(e) {
    this.view.setState({
      hideOther: !this.store.state.hideOther
    })
    this.store.state.hideOther = !this.store.state.hideOther;
    this.getOrderDataPro()
  }

  //专业版获取订单数据接口
  getOrderDataPro() {
    if (!this.userController.userToken)
      return
    let orderItemsType = this.store.state.orderItemsType;
    let hideOther = this.store.state.hideOther;
    let tradePairId = this.store.state.tradePairId;
    let idArray = hideOther ? [tradePairId] : [];
    let orderType = 2;
    let orderStatus = orderItemsType === 1 ? [2, 3, 4, 5, 6, 7, 8] : [2, 5, 6, 7];
    let currentParams = {
      idArray,
      orderType
    };
    let historyParams = {
      idArray,
      orderType,
      orderStatus,
      "startTime": Math.floor(new Date().getTime() / 1000) - 7 * 24 * 60 * 60,
      "endTime": Math.floor(new Date().getTime() / 1000),
      "page": 1,
      "pageSize": 10
    };
    if (orderItemsType === 0) {
      this.getCurrentOrder(false, currentParams);
    }
    if (orderItemsType === 1 || orderItemsType === 2) {
      this.getHistoryOrder(false, historyParams);
    }
  }

  async getCurrentOrder(trade, params) {
    let currentOrder = await this.store.getCurrentOrder(params);
    if (!trade) {
      this.store.state.currentOrder = currentOrder;
      // this.view.setState({
      //   currentOrder
      // });
      this.changeRenderUseOrder(0)
      return
    }
    this.view.setState({
      orderListArray: currentOrder,
    })
  }

  async getHistoryOrder(trade, params) {
    let historyOrder = await this.store.getHistoryOrder(params);
    if (!trade) {
      this.store.state.historyOrder = historyOrder;
      // this.view.setState({
      //   historyOrder: historyOrder && historyOrder.orderList || []
      // });
      this.changeRenderUseOrder(1)
      return
    }
    this.view.setState({
      // 若orderList为undefined，则默认为空数组
      orderListArray: historyOrder && historyOrder.orderList || [],
      // total: historyOrder && this.view.state.page === 1 && historyOrder.totalCount || 0
    });
    historyOrder && historyOrder.page === 1 && this.view.setState(
        {total: historyOrder.totalCount}
    )
  }

  async exportHistory(type) {
    let result = await this.store.getHistoryOrder({
      "tradePairId": [],
      "tradePairName": "xxx",
      "orderType": 2,
      "orderStatus": [2, 3, 4, 5, 6, 7, 8],
      "startTime": 0,
      "endTime": Math.floor(new Date().getTime() / 1000),
      "page": 1,
      "pageSize": 0
    });
    if (!result || !result.orderList || !result.orderList) return;
    let str;
    if (type === 'orderHistory') {
      // str = "时间,交易对,类型,价格,平均成交价,成交量,成交额,已成交,状态";
      str = `${this.view.intl.get("time")},${this.view.intl.get("pair")},${this.view.intl.get("type")},${this.view.intl.get("price")},${this.view.intl.get("avgPrice")},${this.view.intl.get("amount")},${this.view.intl.get("dealed")},${this.view.intl.get("total")},${this.view.intl.get("state")}`;
      result.orderList.forEach(v => {
        str +=
            "\n" +
            v.orderTime.toDate("yyyy-MM-dd HH:mm:ss") + "," +
            v.tradePairName + "," +
            (v.orderType ? this.view.intl.get('sell') : this.view.intl.get('buy')) + "," +
            (v.priceType ? this.view.intl.get('marketPrice') : (v.price.format({style: {thousandSign: false}})) + ' ' + v.tradePairName.split('/')[1].toUpperCase()) + "," +
            v.avgPrice.format({style: {thousandSign: false}}) + "," +
            (v.count.format({style: {thousandSign: false}}) + ' ' + v.tradePairName.split('/')[0].toUpperCase()) + "," +
            v.dealDoneCount.format({style: {thousandSign: false}}) + "," +
            (v.turnover.format({style: {thousandSign: false}}) + ' ' + v.tradePairName.split('/')[1].toUpperCase()) + "," +
            this.view.state.orderStatusItems[v.orderStatus]
      });
      this.exportExcel(str, `${this.view.intl.get("order-history")}.xls`);
      return;
    }
    // str = "时间,交易对,类型,平均成交价,成交量,成交额,手续费";
    str = `${this.view.intl.get("time")},${this.view.intl.get("pair")},${this.view.intl.get("type")},${this.view.intl.get("avgPrice")},${this.view.intl.get("volume")},${this.view.intl.get("total")},${this.view.intl.get("fee")}`;
    // console.log(result.orderList.filter(v=>[ 2, 5, 6, 7].includes(v.orderStatus)))
    result.orderList.filter(v => [2, 5, 6, 7].includes(v.orderStatus)).forEach(v => {
      str +=
          "\n" +
          v.orderTime.toDate("yyyy-MM-dd HH:mm:ss") +
          "," +
          v.tradePairName +
          "," +
          (v.orderType ? this.view.intl.get('sell') : this.view.intl.get('buy')) +
          "," +
          (v.avgPrice.format({style: {thousandSign: false}}) + ' ' + v.tradePairName.split('/')[1].toUpperCase()) +
          "," +
          (v.count.format({style: {thousandSign: false}}) + ' ' + v.tradePairName.split('/')[0].toUpperCase()) +
          "," + (
          v.turnover.format({style: {thousandSign: false}}) + ' ' + v.tradePairName.split('/')[1].toUpperCase()) +
          "," +
          v.fee.format({style: {thousandSign: false}}) + ' ' + (v.orderType ? v.tradePairName.split('/')[1].toUpperCase() : v.tradePairName.split('/')[0].toUpperCase())
    });
    // console.log(str)
    this.exportExcel(str, `${this.view.intl.get("order-deal")}.xls`);
    return;
  }

  async getOrderDetail(id) {
    let orderDetail = await this.store.getOrderDetail(id);
    this.view.setState({
      detailFlag: true,
      orderDetail
    })
  }

  wsOrderList() {
    this.store.wsOrderList();
  }

  updateUserOrder(para) {
    if (this.view.name !== 'tradeOrder' || this.store.state.tradePairId !== para.tradePairId)
      return
    let currentOrder = this.store.state.currentOrder;
    let historyOrder = this.store.state.historyOrder && this.store.state.historyOrder.orderList || [];
    let changeIndex = currentOrder.findIndex(v => JSON.stringify(v.orderId) === JSON.stringify(para.orderId));
    let historyIndex = historyOrder.findIndex(v => JSON.stringify(v.orderId) === JSON.stringify(para.orderId))
    if ((para.orderStatus === 0 || para.orderStatus === 1) && para.priceType === 0) {
      changeIndex !== -1 && currentOrder.splice(changeIndex, 1, para) || currentOrder.unshift(para);
      // this.view.setState(currentOrder);
      this.store.state.currentOrder = currentOrder;
      this.changeRenderUseOrder(0)
      return
    }
    para.priceType === 0 && changeIndex !== -1 && currentOrder.splice(changeIndex, 1);
    historyIndex === -1 && historyOrder.unshift(para) || (para.orderStatus === 2 && historyOrder.splice(historyIndex, 1, para));

    this.store.state.historyOrder.orderList = historyOrder;
    this.store.state.currentOrder = currentOrder;
    // this.view.setState({
    //   historyOrder,
    //   currentOrder
    // })
    this.changeRenderUseOrder(2)
  }

  updateUserOrderPro(para) {
    if (this.store.state.hideOther === true && this.store.state.tradePairId !== para.tradePairId)
      return
    let currentOrder = this.store.state.currentOrder;
    let historyOrder = this.store.state.historyOrder && this.store.state.historyOrder.orderList || [];
    // let changeIndex = currentOrder.findIndex(v => JSON.stringify(v.orderId) === JSON.stringify(para.orderId));
    // let historyIndex = historyOrder.findIndex(v => JSON.stringify(v.orderId) === JSON.stringify(para.orderId))
    let orderArray = currentOrder.concat(historyOrder);
    let findIndex = orderArray.findIndex(v => JSON.stringify(v.orderId) === JSON.stringify(para.orderId));
    if (findIndex === -1) {
      orderArray.unshift(para)
    }
    else {
      orderArray[findIndex].seq ? (
          (orderArray[findIndex].seq < para.seq || Math.abs(orderArray[findIndex].seq - para.seq) > Math.pow(2, 30)) && orderArray.splice(findIndex, 1, para)
      ) : orderArray.splice(findIndex, 1, para)
    }
    this.store.state.currentOrder = orderArray.filter((v) => [0, 1].includes(v.orderStatus) && v.priceType === 0);
    this.store.state.historyOrder && (this.store.state.historyOrder.orderList = orderArray.filter((v) => [2, 3, 4, 5, 6, 7, 8].includes(v.orderStatus)));
    this.changeRenderUseOrder(2)
  }

  async cancelOrder(orderId, opType, dealType, tradePairId, v = 1) {
    let orderListArray = this.view.state.orderListArray;
    let msg = await this.store.cancelOrder(orderId, opType, dealType, tradePairId);
    if (orderListArray) {
      let index = orderListArray.findIndex((item) => Number(item.orderId) === Number(orderId))
      orderListArray.splice(index, 1)
      this.view.setState({
        orderListArray
      })
    }
    if (!v) {
      msg && this.view.setState(
          {
            orderCancelType: 'passive',
            resetPopFlag: true,
            resetPopMsg: msg.msg
          }
      ) || this.view.setState({
            resetPopFlag: true,
            orderCancelType: 'positi',
            resetPopMsg: this.view.intl.get('cancel-successful')
          },// 下单弹窗}
      );
    }
  }

  setUnitsType(v) {
    // this.view.setState({
    //   unitsType: v
    // });
    this.store.state.unitsType = v;
    this.changeRenderUseOrder(2)
  }

  setAccuracyAll(value) {
    this.store.state.accuracyList = value
  }

  changeRenderUseOrder(type) {
    let historyOrder = this.store.state.historyOrder && this.store.state.historyOrder.orderList && [... this.store.state.historyOrder.orderList] || [];
    let currentOrder = this.store.state.currentOrder && [... this.store.state.currentOrder] || [];
    let currentOrderR = [];
    let historyOrderR = [];
    let unitsType = this.store.state.unitsType;
    let userPriceList = [];
    let accuracyList = this.store.state.accuracyList || {};
    let proFlag = false;
    window.location.href.includes('/trade') && (proFlag = true);
    let items = {
      CNY: 'priceCN',
      USD: 'priceEN'
    };
    let formatKey = (unitsType === "CNY" || unitsType === 'USD') ? 'legal' : '';
    let formatProperty = (unitsType === "CNY" || unitsType === 'USD') ? 'legal' : '';
    let itemsAvg = {
      CNY: 'avgPriceCN',
      USD: 'avgPriceEN',
    };
    let itemsTurnover = {
      CNY: 'turnoverCN',
      USD: 'turnoverEN'
    };
    let formatObj = {
      digital: '',
      legal: {number: 'legal', style: {name: unitsType && unitsType.toLowerCase()}},
      property: ''
      // {number: 'property', style: {decimalLength: this.accuracy.priceAccuracy + this.accuracy.volumeAccuracy}}
    };
    if (type !== 1) {
      currentOrderR = currentOrder && currentOrder.filter(v => accuracyList[v.tradePairName]).map(v => {
        v.priceH = items[unitsType] ? v[items[unitsType]] : v.price;
        v.priceR = formatObj[formatKey] ? Number(v.priceH).format(formatObj[formatKey]) : Number(v.priceH).format({
          number: 'digital',
          style: {decimalLength: accuracyList[v.tradePairName] && accuracyList[v.tradePairName].pb}
        });
        v.countR = Number(v.count).formatFixNumberForAmount(accuracyList[v.tradePairName] && accuracyList[v.tradePairName].vb, false);
        v.turnoverR = formatObj[formatProperty] ? Number(Number(v.priceH).multi(v.count)).format(formatObj[formatProperty]) : Number(Number(v.priceH).multi(v.count)).format({
          number: 'property',
          style: {decimalLength: (accuracyList[v.tradePairName] && accuracyList[v.tradePairName].pb) + (accuracyList[v.tradePairName] && accuracyList[v.tradePairName].vb)}
        });
        v.dealDoneCountR = Number(v.dealDoneCount).formatFixNumberForAmount(accuracyList[v.tradePairName] && accuracyList[v.tradePairName].vb, false);
        v.undealCountR = Number(v.undealCount).formatFixNumberForAmount(accuracyList[v.tradePairName] && accuracyList[v.tradePairName].vb, false);
        // v.fee = Number(v.fee).format({number: 'property',style:{decimalLength :this.accuracy.priceAccuracy + this.accuracy.volumeAccuracy}})   \
        userPriceList.push({price: v.price, type: v.orderType, tradePairName: v.tradePairName});
        return v
      });
      this.TradeOrderListController && this.TradeOrderListController.setPriceList(userPriceList);
      if (proFlag && this.store.state.orderItemsType === 0) {
        if (currentOrderR.length > 0 && currentOrderR.length < 6) {
          let emptyArray = new Array(6 - currentOrderR.length).fill(0);
          currentOrderR = currentOrderR.concat(emptyArray)
        }
        this.view.setState({
          proOrderData: currentOrderR
        })
      }
      else {
        this.view.setState({
          currentOrder
        })
      }
    }
    if (type !== 0) {
      historyOrderR = historyOrder.slice(0, 10);
      historyOrderR = historyOrder && historyOrder.filter(v => accuracyList[v.tradePairName]).map(v => {
        v.priceH = items[unitsType] ? v[items[unitsType]] : v.price;
        v.priceR = formatObj[formatKey] ? Number(v.priceH).format(formatObj[formatKey]) : Number(v.priceH).format({
          number: 'digital',
          style: {decimalLength: accuracyList[v.tradePairName].pb}
        });
        v.countR = Number(v.count).formatFixNumberForAmount(accuracyList[v.tradePairName].vb, false);
        v.dealDoneCountR = Number(v.dealDoneCount).formatFixNumberForAmount(accuracyList[v.tradePairName].vb, false);
        v.undealCountR = Number(v.undealCount).formatFixNumberForAmount(accuracyList[v.tradePairName].vb, false);
        v.avgPriceR = itemsAvg[unitsType] ? Number(v[itemsAvg[unitsType]]).format(formatObj.legal) : Number(v.avgPrice).toFixedUp(accuracyList[v.tradePairName].pb);
        v.turnoverH = itemsTurnover[unitsType] ? v[itemsTurnover[unitsType]] : v.turnover;
        v.turnoverR = formatObj[formatProperty] ? Number(v.turnoverH).format(formatObj[formatProperty]) : Number(v.turnoverH).format({
          number: 'property',
          style: {decimalLength: accuracyList[v.tradePairName].pb + accuracyList[v.tradePairName].vb}
        });
        v.fee = Number(v.fee).format({number: 'property'});
        return v
      });
      if (proFlag && (this.store.state.orderItemsType === 2 || this.store.state.orderItemsType === 1)) {
        this.store.state.orderItemsType === 2 && historyOrderR.filter(v => [2, 5, 6, 7].includes(v.orderStatus))
        this.view.setState({
          proOrderData: historyOrderR
        })
      }
      else {
        this.view.setState({
          historyOrder
        })
      }
    }
  }

  async getPrice(currency) {
    let result = await this.store.getPrice(currency);
    return result.cny
  }

  async otcSaleDetail(id) {
    let result = await this.store.otcSaleDetail(id)
    return result
  }

  async otcOrderStore(state, page_no, role, begin_time, end_time, currency, id) {
    let result = await this.store.otcOrderStore(
        {
          state,
          page_no,
          "page_size": 20,
          role, begin_time, end_time, currency, id
        }
    )
    return result
  }

  async otcNewOrder(id, price, currency, money, fund_pass, type) {
    let password = fund_pass ? this.RSAencrypt(fund_pass) : '';
    let result = await this.store.otcNewOrder(
        {
          id, price, currency, money, fund_pass: password, type
        }
    )
    return result;
  }

  async getFundCard(cardType) {
    let result = await this.store.fundGatheringCard(cardType)
    return result
  }

  async getFundOrderInfo(orderId) {
    let result = await this.store.fundOrderInfo(orderId)
    return result[0]
  }

  //获取单个订单详情
  async otcGetOrders(id) {
    let result = await this.store.otcGetOrders(id);
    this.store.state.otcOrderId = result.id;
    return result
  }

  //获取聊天列表
  async otcChat(oid) {
    let result = await this.store.otcChat(oid);

    let uid = this.userController.userId;
    let chatItems = result.ms ? result.ms.map((v) => {
      return {
        content: v.data.m,
        isMe: JSON.stringify(v.si) === JSON.stringify(uid) ? true : false,
        time: v.ct,
        type: v.type
      }
    }) : [];
    this.store.state.chatItems = chatItems;
    return {
      content: chatItems,
      count: result.count
    }
  }

  // 获取未读消息
  async otcUnread() {
    let result = await this.store.otcUnread();
    return result
  }

  // 标记订单状态
  async otcUpdateOrder(id, state, info = '') {
    let result = await this.store.otcUpdateOrder(id, state, info);
    return result
  }

  // 取消订单
  async otcCancelOrder(id) {
    let result = await this.store.otcCancelOrder(id);
    return result
  }

  // 发送聊天消息
  sendChatMsg(msg) {
    this.store.sendChatMsg(msg)
  }

  // 更新聊天列表消息
  updateChatItems(data) {
    if (this.view.name !== 'otcOrderContent')
      return;
    if (JSON.stringify(this.store.state.otcOrderId) !== JSON.stringify(data.d.ooi))
      return;
    this.store.state.chatItems = [... this.view.state.chatItems,
      {
        content: data.d.data.m,
        isMe: true,
        time: new Date().getTime() / 1000
      }];
    this.view.setState(
        {
          chatItems: [... this.view.state.chatItems,
            {
              content: data.d.data.m,
              isMe: true,
              time: new Date().getTime() / 1000
            }],
          chatContent: ''
        }
    )
  }

  //salesPaymentAccounts
  async salesPaymentAccounts(id) {
    let result = await this.store.salesPaymentAccounts(id);
    return result
  }

  // 申诉订单
  async otcNewAppealAdd(type, contact, info) {
    let result = await this.store.otcNewAppealAdd(type, contact, info);
    return result
  }

  // 用户评价
  async otcNewRate(credit) {
    let result = await this.store.otcNewRate(credit);
    return result
  }

  // 聊天信息处理
  chatItemWs(result) {
    let chatItems = this.store.state.chatItems;
    if (this.view.name === 'otcOrderContent' && JSON.stringify(result.orderId) !== JSON.stringify(this.store.state.otcOrderId)) {
      this.popupController.setState({
        isShowTip: true,
        autoClose: true
      })
      return
    }
    if (result.messageType) {
      if (result.messageType === 6) {
        this.view.orderSuccessHandle()
        this.view.setState({orderOver: true})
      }
      if (result.messageType === 4) {
        this.popupController.setState({
          isShow: true,
          type: 'tip2',
          msg: this.view.state.orderType ? '用户已取消订单。' : this.view.intl.get('order-over'),
        })
        this.view.setState({orderOver: true})
      }
      this.view.setState({state: result.messageType});
    }
    else {
      this.otcReadOderMessages();
      chatItems.push({
        content: result.message.m,
        isMe: JSON.stringify(result.sender) === JSON.stringify(result.userId) ? true : false,
        time: result.date
      });
      this.view.setState({chatItems})
    }
  }

  // 设置订单消息已读
  async otcReadOderMessages(oid) {
    let result = await this.store.otcReadOderMessages(oid)
    return result
  }
}