import React, {Component} from 'react'
import ExchangeViewBase from "@/components/ExchangeViewBase.jsx"
import PayWay from "@/common/component/PayWay/index.jsx"
import Button from "@/common/baseComponent/Button/index.jsx"
import PropTypes from "prop-types"
import {goOtcPath} from '@/config/UrlConfig'

export default class MyAdItem extends ExchangeViewBase {
  static defaultProps = {
    myAdList: [
      {
        adNumber: 'GG-123456',
        dealNumber: 5,
        price: 10.79,
        lastPrice: 0.08,
        currency: 'BTC',
        digital: 'CNY',
        highValue: 200,
        lowValue: 100,
        time: new Date().getTime(),
        adName: 'BTC周中特惠',
        adType: 0,
        priceType: 0,
        payWay: 7,
        status: 0,
      },
      {
        adNumber: 'GG-123456',
        dealNumber: 5,
        price: 10.79,
        lastPrice: 0.08,
        currency: 'BTC',
        digital: 'CNY',
        highValue: 200,
        lowValue: 100,
        time: new Date().getTime(),
        adName: 'BTC周中特惠',
        adType: 1,
        priceType: 1,
        payWay: 7,
        status: 0,
      },
      {
        adNumber: 'GG-123456',
        dealNumber: 5,
        price: 10.79,
        lastPrice: 0.08,
        currency: 'BTC',
        digital: 'CNY',
        highValue: 200,
        lowValue: 100,
        time: new Date().getTime(),
        adName: 'BTC周中特惠',
        adType: 0,
        priceType: 1,
        payWay: 6,
        status: 1,
      },
      {
        adNumber: 'GG-123456',
        dealNumber: 5,
        price: 10.79,
        lastPrice: 0.08,
        currency: 'BTC',
        digital: 'CNY',
        highValue: 200,
        lowValue: 100,
        time: new Date().getTime(),
        adName: 'BTC周中特惠',
        adType: 1,
        priceType: 0,
        payWay: 6,
        status: 2,
      }, {
        adNumber: 'GG-123456',
        dealNumber: 5,
        price: 10.79,
        lastPrice: 0.08,
        currency: 'BTC',
        digital: 'CNY',
        highValue: 200,
        lowValue: 100,
        time: new Date().getTime(),
        adName: 'BTC周中特惠',
        adType: 0,
        priceType: 0,
        payWay: 7,
        status: 3,
      }
    ]
  };
  static propTypes = {
    myAdList: PropTypes.array.isRequired
  };

  constructor() {
    super();
    this.adType = [
      this.intl.get('otc-buy-ad'),
      this.intl.get('otc-sell-ad'),
    ];
    this.priceType =
        {
          1: this.intl.get('otc-price-st'),
          2: this.intl.get('otc-price-fl')
        };
    this.status = {
      1: this.intl.get('otc-ad-up'),
      2: this.intl.get('otc-ad-down'),
      3: this.intl.get('otc-ad-com'),
      4: this.intl.get('otc-ad-dead')
    }
    this.statusType = [
      {
        name: this.intl.get('otc-up'),
        status: 1
      },
      {
        name: this.intl.get('otc-down'),
        status: 2
      }
    ];
  }

  render() {
    const {
      myAdList,
      changeAdLine,
      deleteAd,
      history
    } = this.props;
    return (
        <div className='my-ad-list'>
          {myAdList.length ? myAdList.map((v, index) => (
                  <div className='my-ad-items' key={index}>
                    <ul className='my-ad-title'>
                      <li className='my-ad-li my-ad-title-li'>
                        <span className='ad-title-lab'>{this.intl.get('otc-ad-no')}:</span>
                        <span className='ad-title-content'>{JSON.stringify(v.id)}</span>
                      </li>
                      <li className='my-ad-li'>
                        <span className='ad-title-lab'>{this.intl.get('otc-ad-deal')}:</span>
                        <span className='ad-title-content'>{v.order_num}</span>
                      </li>
                      <li className='my-ad-li'>
                        <span className='ad-title-lab'>{this.intl.get('price')}:</span>
                        <span className='ad-title-content'>{Number(v.price).maxHandle(2)}</span>
                      </li>
                      <li className='my-ad-li'>
                        <span className='ad-title-lab'>{this.intl.get('otc-ad-last')}:</span>
                        <span className='ad-title-content'>{(Number(v.tradeable).format({
                          number: "property",
                          style: { decimalLength: 6 }
                        }))}{v.currency && v.currency.toUpperCase()}</span>
                      </li>
                      <li className='my-ad-li'>
                        <span className='ad-title-lab'>{this.intl.get('otc-ad-limit')}:</span>
                        <span className='ad-title-content'>{v.min}-{v.max}{v.money && v.money.toUpperCase()}</span>
                      </li>
                    </ul>
                    <ul className='my-ad-content'>
                      <li className='my-ad-li'>
                        {v.create && v.create.toDate('yyyy-MM-dd HH:mm')}
                      </li>
                      <li className='my-ad-li'>
                        {v.trader}
                      </li>
                      <li className='my-ad-li'>
                        {this.adType[2 - v.type]}
                        ({this.priceType[v.mode]})
                      </li>
                      <li className='my-ad-li'>
                        <PayWay payWayStatus={v.payments}/>
                      </li>
                      <li className='my-ad-li'>
                        <span className='ad-status-lab'>{this.status[v.state]}</span>
                        {(v.state === 1 || v.state === 2) ?
                            (<span>
                      {this.statusType.map((vv, number) => (
                          <em key={number}
                              className={(v.state === vv.status) ? 'ad-radio-select' : 'ad-radio-normal'}
                              onClick={changeAdLine.bind(this, v.id, v.state, vv.status,)}
                          >{vv.name}</em>))}
                    </span>)
                            : ''}
                      </li>
                      <li className='my-ad-li'>
                        {/*<NavLink to={resolveOtcPath()} className={`${(v.state === 2) && ''}`}>{this.intl.get('otc-check')}</NavLink>*/}
                        <Button
                          onClick={() => (v.state !== 2) && history.push('/')}
                          title={this.intl.get('otc-check')}
                          className={`ad-content-button ${(v.state === 2) && 'ad-content-button-disable' || 'check-button'}`}
                        />
                        <Button
                            onClick={deleteAd.bind(this, v.id)}
                            title={this.intl.get('otc-delete')}
                            className='delete-button ad-content-button'
                        />
                      </li>
                    </ul>
                  </div>
              ))
              : (
                  <div className={'my-ad-none'}>
                    暂无数据
                  </div>
              )
          }
        </div>
    )

  }
}