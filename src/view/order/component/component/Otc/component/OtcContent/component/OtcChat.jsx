import React, {Component} from "react";
import ExchangeViewBase from "@/components/ExchangeViewBase";
import PropTypes from "prop-types"
import Button from "@/common/baseComponent/Button/index"
import Input from "@/common/baseComponent/Input/index"
import CountDown from '../../../../common/OrderCountDown'
import {goOtcPath, goAssetPath} from "@/config/UrlConfig";
import {ORDER_OTC_GOOD, ORDER_OTC_BAD} from "@/config/ImageConfig";

const scrollbot = require('simulate-scrollbar');

export default class OtcChat extends ExchangeViewBase {
  static defaultProps = {
    state: 6,
    orderType: 1, //订单类型
    orderOver: false, // 订单状态是否结束
  };
  static propTypes = {
    chatItems: PropTypes.array,
    orderOver: PropTypes.bool.isRequired
  };

  constructor() {
    super();
    this.chatFast = [
      [this.intl.get('order-input-buy-tip1'), this.intl.get('order-input-buy-tip2'), this.intl.get('order-input-buy-tip3'), this.intl.get('order-input-buy-tip4'), this.intl.get('order-input-buy-tip5')],
      [this.intl.get('order-input-sell-tip1'), this.intl.get('order-input-sell-tip2'), this.intl.get('order-input-sell-tip3'), this.intl.get('order-input-sell-tip4'), this.intl.get('order-input-sell-tip5')]
    ];
    this.state = {
      chatFastFlag: false,// 快捷用语开关
      evaluateFlag: false, // 评价开关
      disableEvaluateFlag: true //师傅可以评价
    };
    this.evaluateTitle = [
      this.intl.get('otc-evaluate'),
      this.intl.get('order-rate-algood'),
      this.intl.get('order-rate-albad')
    ]
    this.evaluate = [
      {
        type:1,
        name: this.intl.get('order-rate-good'),
        img:ORDER_OTC_GOOD
      },
      {
        type:2,
        name: this.intl.get('order-rate-bad'),
        img:ORDER_OTC_BAD
      }
    ]
  }

  componentDidMount() {
    this.customScrollO = new scrollbot('#chat-window-container');
    this.customScrollO.setOption({
      dirtion: 'bottom',
    })
    this.customScrollO.setStyle({
      block: {
        backgroundColor: '#aaa',
        borderRadius: '5px',
      },//滑块样式
      groove: {
        backgroundColor: '#eee',
        borderRadius: '5px',
      }//滚动槽样式
    })
  }

  componentDidUpdate(preProps, preState) {
    if (this.props.chatItems.length !== preProps.chatItems.length) {
      if(this.props.scrollDirection === 'bottom'){
        this.customScrollO.setOption({
          dirtion: 'bottom',
        })
        this.customScrollO && this.customScrollO.refresh();
      }
      if(this.props.scrollDirection === 'none'){
        this.customScrollO.setOption({
          dirtion: 'none',
        })
        this.customScrollO && this.customScrollO.refresh(true);
      }

    }
  }
  async otcNewRate(credit){
    let result = await this.props.otcNewRate(credit);
    // console.log('credit', credit)
    if(!result){
      this.setState({
        evaluateFlag: false,
        disableEvaluateFlag: true
      })
    }
  }
  render() {
    let {
      chatItems,
      orderType,
      chatContent,
      orderOver,
      chatInput,
      chatClick,
      chatFastClick,
      state,
      changeOrderState,
      appealFlag,
      otcCancelOrder,
      credit,
        time,
      loadMoreFlag,
      loadMoreChat,
      countPopHandler,
      countDelayHandler
    } = this.props;
    // console.log('credit1', credit, state)
    if(state < 7){
      credit = 0
    }
    // console.log('credit2', credit, state)
    return (
        <div className='otc-chat'>
          <p className='otc-chat-tip'>
            {this.intl.get('otc-chat-tip')}
          </p>
          <div id='chat-window-container' style={{height: '284px', width: '100%', overflow: 'hidden'}}>
            <div>
              <div className='otc-chat-window'>
                {loadMoreFlag ?
                    <p onClick={loadMoreChat.bind(this)} className={'otc-chat-load'}>{this.intl.get('order-load')}</p>
                    : null}
                {chatItems.length ? chatItems.map((v, index) => (
                    <div className={`${v.isMe ? 'chat-items-self' : 'chat-items-other' } chat-items`} key={index}>
                      <em>{v.isMe ? (orderType === 0 ? this.intl.get('order-b') : this.intl.get('order-s')) : (orderType === 0 ? this.intl.get('order-s') : this.intl.get('order-b'))}</em>
                      <p>{v.content}</p>
                      <span>{Number(v.time).toDate('HH:mm')}</span>
                    </div>
                )) : null}
              </div>
            </div>
          </div>
          <div className='otc-chat-option'>
            <div className='otc-chat-input'>
              <div>
                <Input
                    value={chatContent}
                    className={orderOver ? 'otc-input-disabled' : 'otc-input-enable'}
                    disabled={orderOver}
                    onInput={chatInput.bind(this)}
                    onFocus={() => {
                      this.setState({chatFastFlag: true})
                    }}
                    onEnter={chatClick}
                    clickOutSide={() => {
                      this.setState({chatFastFlag: false})
                    }
                    }
                />
                {
                  this.state.chatFastFlag && (<ul>
                    {this.chatFast[orderType].map((v, index) => (
                        <li key={index} onClick={chatFastClick.bind(this, v)}>{v}</li>
                    ))}
                  </ul>)
                }
              </div>
              <Button
                  title={this.intl.get('otc-chat-sub')}
                  className={orderOver ? 'otc-button-disabled' : 'otc-button-enable'}
                  onClick={chatClick}
                  disabled={orderOver}
              />
            </div>
            <div className='otc-state-option'>
              {orderType ?
                  (
                      <div>
                        {state === 1 &&
                        <Button title={this.intl.get('order-buy-pay')}
                                className={'otc-option-normal'}
                                disabled={'disable'}
                        />}
                        {/*// <span>{this.intl.get('order-buy-pay')}</span>}*/}
                        {state === 2 && (<div>
                              <Button title={this.intl.get('otc-sell-mark')}
                                      className='otc-option-active'
                                      onClick={() => changeOrderState(6)}
                              />
                              <Button title={this.intl.get('otc-appeal')}
                                      className={'otc-option-button'}
                                      onClick={appealFlag.bind(this)}
                              />
                            </div>
                           )}
                        {state === 3 && (<div>
                              <Button title={this.intl.get('otc-sell-mark')}
                                      className='otc-option-active'
                                      onClick={() => changeOrderState(6)}
                              />
                              <Button title={this.intl.get('order-claiming')}
                                      className={'otc-option-disable'}
                                      disabled={'disable'}
                              />
                            </div>
                        )}
                        {[4, 5].includes(state) && (<div>
                              <Button title={this.intl.get('otc-trade-right')}
                                      className='otc-option-active'
                                      onClick={() => {goOtcPath()}}
                              />
                            </div>
                        )}
                        {[6, 7, 8, 9].includes(state) && (<div>
                          <Button title={this.intl.get('otc-trade-right')}
                                  className='otc-option-active'
                                  onClick={() => {goOtcPath()}}
                          />
                          {!this.props.isOwer && <Button title={this.evaluateTitle[credit]}
                                  onClick={() => {state < 7 && this.setState({evaluateFlag: !this.state.evaluateFlag})}}
                                  className={state < 7 && 'otc-option-button' || 'otc-option-disable'}
                          />}
                        </div>)}
                      </div>
                  ) :
                  (
                      <div>
                        {state === 1 && (<div>
                          <Button title={this.intl.get('otc-buy-mark')}
                                  className='otc-option-active'
                                  onClick={() => changeOrderState(2)}
                          />
                          <Button title={this.intl.get('otc-trade-cancel')}
                                  className={'otc-option-button'}
                                  onClick={() => otcCancelOrder()}
                          />
                        </div>)}
                        {state === 2 && <div>
                          {/*<span>等待放币</span>*/}
                          <Button title={this.intl.get('otc-wait-coin')}
                                  className={'otc-option-normal'}
                          />
                          <Button title={this.intl.get('otc-appeal')}
                                  className={'otc-option-button'}
                                  onClick={appealFlag.bind(this)}
                          />
                        </div>}
                        {state === 3 && (<div>
                              <Button title={this.intl.get('otc-wait-coin')}
                                      className={'otc-option-button'}
                              />
                              <Button title={this.intl.get('order-claiming')}
                                      className={'otc-option-disable'}
                                      disabled={'disable'}
                              />
                            </div>
                        )}
                        {[4, 5].includes(state) && (<div>
                              <Button title={this.intl.get('order-otc-asset')}
                                      className='otc-option-active otc-option-button'
                                      onClick={() => {goAssetPath('/otc/balance')}}
                              />
                              <Button title={this.intl.get('otc-trade-right')}
                                      className={'otc-option-button'}
                                      onClick={() => {goOtcPath()}}
                              />
                            </div>
                        )}
                        {state > 5 && <div>
                          <Button title={this.intl.get('order-otc-asset')}
                                  className='otc-option-active otc-option-button'
                                  onClick={() => {goAssetPath('/otc/balance')}}
                          />
                          <Button title={this.intl.get('otc-trade-right')}
                                  className={'otc-option-button'}
                                  onClick={() => {goOtcPath()}}
                          />
                          {!this.props.isOwer && <Button title={this.evaluateTitle[credit]}
                                  onClick={() => {state < 7 && this.setState({evaluateFlag: !this.state.evaluateFlag})}}
                                  className={state < 7 && 'otc-option-button' || 'otc-option-disable'}
                          />}
                        </div>}
                      </div>
                  )
              }
              {this.state.evaluateFlag && (
                    <div className={'otc-evaluate'}>
                      {this.evaluate.map((v, index) => (
                          <div key={index}
                               className={`otc-evaluate-item ${credit === v.type ? 'otc-evaluate-active': ''}`}
                               onClick={this.otcNewRate.bind(this, v.type)}
                          >
                            <div>
                              <img src={v.img} alt=""/>
                              <p>{v.name}</p>
                            </div>
                          </div>
                      ))}
                    </div>
                )}
            </div>
          </div>
          <div className='order-state-msg'>
            {orderType ?
                (<div>
                      {state === 1 && (<div>
                        <p>{this.intl.get('order-count-down-3')}<CountDown
                            time={time}
                            delayHandler={countDelayHandler.bind(this)}
                            countPopHandler={countPopHandler.bind(this)}
                        />{this.intl.get('order-count-down-2')}</p>
                        {/*<span>请及时付款并点击标记按钮</span>*/}
                      </div>)}
                      {state === 3 && (<p className='msg-red'>{this.intl.get('order-claiming')}</p>)}
                      {[4, 5].includes(state) && (<p className='msg-red'>{this.intl.get('order-canceled')}</p>)}
                      {state > 5 && (<p className='msg-red'>{this.intl.get('order-end')}</p>)}
                    </div>
                ) : (<div>
                      {state === 1 && (<div>
                        <p>{this.intl.get('order-count-down-1')}<CountDown
                            time={time}
                            countPopHandler={countPopHandler.bind(this)}
                            delayHandler={countDelayHandler.bind(this)}
                        />{this.intl.get('order-count-down-2')}</p>
                        <span>{this.intl.get('order-click-pay')}</span>
                      </div>)}
                      {state === 3 && (<p className='msg-red'>{this.intl.get('order-claiming')}</p>)}
                      {[4, 5].includes(state) && (<p className='msg-red'>{this.intl.get('order-canceled')}</p>)}
                      {state > 5 && (<p className='msg-red'>{this.intl.get('order-end')}</p>)}
                    </div>
                )}
          </div>
        </div>
    )
  }
}