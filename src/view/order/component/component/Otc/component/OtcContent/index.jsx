import React from 'react'
import ExchangeViewBase from "@/components/ExchangeViewBase";
import Appeal from './component/Appeal'
import OtcOrderTitle from '../../../common/OtcOrderTitle'
import ExchangeInfo from '../common/ExchangeInfo'
import OtcOrderItem from '../common/OtcOrderItem'
import Faq from '../common/Faq'
import Collection from './component/Collection'
import OtcChat from './component/OtcChat'
import Popup from '@/common/baseComponent/Popup/index'
import {getQueryFromPath} from '@/config/UrlConfig'

import './stylus/index.styl'

export default class OrderContent extends ExchangeViewBase {
  constructor(props) {
    super(props);
    this.name = 'otcOrderContent';
    this.state = {
      orderItems: {},
      collectionArr: [],
      orderType: 1,
      bussinessInfo: {
        name: '梅林的胡子',
        exchangeNumber: 432,
        rate: 0.99,
        fee: 0
      },
      chatContent: '',
      currency: 'BTC',
      chatItems: [],
      popFlag: false,
      appealFlag: false,
      state: '',
      orderOver: false,
      scrollDirection: 'bottom',
      loadMoreFlag: false,
      dbClickCancel: false,
      dbClickMark: false,
      dbClickAppeal: false
    };
    const {controller} = this.props;
    //绑定view
    controller.setView(this);
    this.contentTitle = [this.intl.get('otc-confirm-buy'), this.intl.get('otc-confirm-sell')];
    this.bussiness = [this.intl.get('otc-bussiness-sell'), this.intl.get('otc-bussiness-buy'),];
    this.chatInput = this.chatInput.bind(this);
    this.chatClick = this.chatClick.bind(this);
    this.chatFastClick = this.chatFastClick.bind(this);
    this.changeOrderState = this.changeOrderState.bind(this);
    this.appealFlag = this.appealFlag.bind(this);
    this.otcCancelOrder = this.otcCancelOrder.bind(this);
    this.otcNewRate = this.otcNewRate.bind(this);
    this.loadMoreChat = this.loadMoreChat.bind(this);
    this.countPopHandler = this.countPopHandler.bind(this);
    this.countDelayHandler = this.countDelayHandler.bind(this);
  }

  async componentDidMount() {
    let id = JSON.parse(getQueryFromPath('id'));
    this.props.controller.store.state.oid = id;
    let orderItems = await this.props.controller.otcGetOrders(id);
    let uid = this.props.controller.userController.userId;
    let orderType = JSON.stringify(uid) === JSON.stringify(orderItems.buyer) ? 0 : 1;
    let chatItems = await this.props.controller.otcChat(id);
    await this.props.controller.otcReadOderMessages(id);
    chatItems.content && chatItems.content.reverse();
    let loadMoreFlag = chatItems.count > 10 ? true : false;
    let orderOver = orderItems.state > 3 ? true : false;
    let result = orderType ? null : await this.props.controller.salesPaymentAccounts(id);
    // console.log('orderItems',orderItems, orderType)
    this.setState({
      orderItems,
      orderType,
      credit: orderItems.credit,
      chatItems: chatItems.content,
      state: orderItems.state,
      currency: orderItems.currency.toUpperCase(),
      orderOver,
      collectionArr: result ? result.accounts.filter(v=>[1,2,4].includes(v.type) && v.usable) : [],
      loadMoreFlag
    })
    // if ([4, 5].includes(orderItems.state)) {
    //   this.props.controller.popupController.setState({
    //     isShow: true,
    //     type: 'tip2',
    //     msg: '订单已结束'
    //     // msg: orderType ? '该订单已结束，数字货币已进入对方账户。' : '该订单已结束，请勿进行转账操作。',
    //   })
    //   return
    // }
    if(orderOver){
      this.props.controller.popupController.setState({
        isShow: true,
        type: 'tip2',
        autoClose: true,
        msg: this.intl.get('order-end'),
        // msg: orderType ? '该订单已结束，数字货币已进入对方账户。' : '该订单已结束，请勿进行转账操作。',
      })
    }
  }
  //订单成功弹窗
  orderSuccessHandle(){
    this.props.controller.popupController.setState({
          isShow: true,
          type: 'tip2',
          msg: this.state.orderType ? this.intl.get('order-confirm-end-yes') : this.intl.get('order-confirm-end-no'),
        })
  }
  //聊天输入框
  chatInput(e) {
    if(e.trim().length > 100)
      return
    this.setState({
      chatContent: e
    })
  }

  //快捷用语选中
  chatFastClick(v) {
    this.setState(
        {chatContent: v}
    )
  }

  //聊天发送
  async chatClick() {
    if (this.state.chatContent.trim()) {
      this.props.controller.sendChatMsg(this.state.chatContent);
    }
  }

  //加载更多聊天记录
  async loadMoreChat() {
    let id = JSON.parse(getQueryFromPath('id'));
    this.props.controller.store.state.chatPage += 1;
    let result = await this.props.controller.otcChat(id);
    if (result.content.length) {
      result.content.reverse();
      let chatItems = [... result.content, ... this.state.chatItems];
      this.setState({
        scrollDirection: 'none',
        chatItems
      })
    }
    else {
      this.setState({
        loadMoreFlag: false
      })
    }
  }

  //标记订单状态
  async changeOrderState(state, info = '') {
    const id = JSON.parse(getQueryFromPath('id'));
    if(this.state.dbClickMark)
      return
    this.setState({
      dbClickMark: true
    });
    let result = await this.props.controller.otcUpdateOrder(id, state, info);
    this.setState({
      dbClickMark: false
    });
    if(result && result.errCode){
      this.props.controller.popupController.setState({
        isShow: true,
        type: 'tip3',
        msg: result.msg,
      })
    }
  }

  //申诉弹窗
  appealFlag() {
    this.setState({
      appealFlag: true
    })
  }

  //申诉订单
  async otcNewAppealAdd(obj) {
    if(this.state.dbClickAppeal)
      return
    this.setState({
      dbClickAppeal: true
    });
    let result = await this.props.controller.otcNewAppealAdd(obj.reason, obj.contact, obj.text);
    this.setState({
      dbClickAppeal: false
    });
    if(result && result.errCode){
      this.props.controller.popupController.setState({
        isShow: true,
        type: 'tip2',
        msg: result.msg,
      });
      return
    }
    this.setState({
      appealFlag: false
    });
    this.props.controller.popupController.setState({
      isShow: true,
      type: 'tip1',
      msg: this.intl.get('order-appel-succuess'),
    })
  }
  //取消otc订单弹窗
  async otcCancelOrder() {
    this.setState({
      popFlag: true
    })
  }
  // 取消otc订单
  async otcCancelConfirm(){
    // console.log('otcCancelConfirm')
    const id = JSON.parse(getQueryFromPath('id'));
    if(this.state.dbClickCancel)
      return;
    this.setState({
      dbClickCancel: true
    })
    let result = await this.props.controller.otcCancelOrder(id);
    this.setState({
      popFlag: false,
      dbClickCancel: false
    })
    await this.props.controller.Sleep(1000)
    if(result && result.errCode){
      this.props.controller.popupController.setState({
        isShow: true,
        type: 'tip3',
        msg: result.msg,
      })
      return
    }
    this.setState({
      orderOver: true,
      state: 4,
    })
    
  }
  // 评价
  async otcNewRate(credit) {
    console.log(credit)
    if ([7, 8, 9].includes(this.state.orderItems.state))
      return true;
    let result = await this.props.controller.otcNewRate(credit);
    if(result === null){
      this.setState({
        state: 9,
        credit
      })
    }
    return result
  }

  // 倒计时的弹窗处理
  countPopHandler() {
    this.props.controller.popupController.setState({
      isShow: this.state.orderType ? false : true,
      type: 'tip3',
      // msg: `${this.state.currency}托管时间剩余1分钟，请及时标记付款`,
      msg: this.intl.get('order-confirm-soon', {name: this.state.currency}),
    })
  }
  // 订单超时处理
  countDelayHandler() {
    this.props.controller.popupController.setState({
      isShow: true,
      type: 'tip3',
      msg: this.state.orderType ? this.intl.get('order-confirm-end-sale') : this.intl.get('order-confirm-end-buy')
    })
    this.setState({
      state: 5,
      orderOver: true
    })
  }
  render() {
    let uid = this.props.controller.userController.userId;
    return (
        <div className='order-otc-content'>
          <div className='otc-content-l'>
            <ExchangeInfo orderType={this.state.orderType}/>
            <div style={{marginTop: '10px'}}>
              {this.state.orderType ?
                  null
                  : <Collection collectionArr={this.state.collectionArr}/>
              }
            </div>
          </div>
          <div className='otc-content-r'>
            <OtcOrderTitle content={this.contentTitle[this.state.orderType]}/>
            <div className='otc-content-fee'>
            <span className='otc-content-bussiness'>
              {this.bussiness[this.state.orderType]}
              {this.state.orderItems.name}
              {this.state.orderType ? this.intl.get('sell') : this.intl.get('buy')}
              {this.state.currency}
            </span>
              <span className='fee-item'>
              {JSON.stringify(this.state.orderItems.sale_trader) === JSON.stringify(uid) ? `${this.intl.get('fee')}: ${this.state.orderItems.fee} ${this.state.currency}` : this.intl.get('otc-fee-free')}
            </span>
            </div>
            <OtcOrderItem
                confirmType={1}
                currency={this.state.currency}
                orderItems={this.state.orderItems}
            />
            <div className='order-otc-chat'>
              <OtcOrderTitle content={this.intl.get('otc-chat-window')}/>
              <OtcChat
                  orderType={this.state.orderType}
                  chatInput={this.chatInput}
                  chatClick={this.chatClick}
                  chatFastClick={this.chatFastClick}
                  chatContent={this.state.chatContent}
                  chatItems={this.state.chatItems}
                  changeOrderState={this.changeOrderState}
                  appealFlag={this.appealFlag}
                  otcCancelOrder={this.otcCancelOrder}
                  state={this.state.state}
                  orderOver={this.state.orderOver}
                  credit={this.state.credit}
                  otcNewRate={this.otcNewRate}
                  time={this.state.orderItems.overtime}
                  loadMoreFlag={this.state.loadMoreFlag}
                  loadMoreChat={this.loadMoreChat}
                  countPopHandler={this.countPopHandler}
                  countDelayHandler={this.countDelayHandler}
                  scrollDirection={this.state.scrollDirection}
                  isOwer={JSON.stringify(this.state.orderItems.sale_trader) === JSON.stringify(uid)}
              />
            </div>
            <Faq type={this.state.orderType}/>
          </div>
          {this.state.popFlag && <Popup
              onConfirm={() => {
                this.setState({popFlag: false})
              }}
              onClose={this.otcCancelConfirm.bind(this)}
              confirmText={this.intl.get('order-confirm-await')}
              cancelText={this.intl.get('order-confirm-sure')}
              className={'order-otc-popup'}
              type='custom'
              msg={this.intl.get('order-confirm-cancel3')}
              icon='warning'
              clickOutSide={false}
          />}
          {this.state.appealFlag && <Appeal
              onClose={() => {
                this.setState({appealFlag: false})
              }}
              onConfirm={this.otcNewAppealAdd.bind(this)}
          />}
        </div>
    )
  }
}
