import React, {Component} from 'react'
import ExchangeViewBase from "@/components/ExchangeViewBase.jsx"
import PropTypes from "prop-types"

export default class Bussiness extends ExchangeViewBase{
  static defaultProps = {
    // bussinessInfo: {
    //   url: '',
    //   name: '奥多多喜欢奥利奥',
    //   monthRate: 0.99,
    //   totalAmount: 14822,
    //   monthAmount: 2326,
    //   avgCost: 71,
    //   regist: new Date().getTime(),
    //   authenStatus: [0, 1, 2]
    // }
  };
  static propTypes = {
    bussinessInfo: PropTypes.object.isRequired,
  };
  constructor(){
    super();
    this.registStatus = [
      {name: this.intl.get('otc-regist-name'), status: 0},
      {name: this.intl.get('otc-regist-email'), status: 1},
      {name: this.intl.get('otc-regist-phone'), status: 2},
      {name: this.intl.get('otc-regist-super'), status: 3},
    ]
  }
  render(){
    const info = this.props.bussinessInfo;
    return(
        <div className='otc-bussiness-info'>
          <div className='info-base'>
            <div className='info-name'>
              <img src={info.icon} alt=""/>
              <span>{info.name}</span>
            </div>
            <div className='info-detail'>
              <div className='info-detail-item'>
                <p>{Number(info.orders_rate_30_days).toPercent(false)}</p>
                <span>{this.intl.get('otc-month-rate')}</span>
              </div>
              <div className='info-detail-item'>
                <p>{info.trade}</p>
                <span>{this.intl.get('otc-total-amount')}</span>
              </div>
              <div className='info-detail-item'>
                <p>{Number(info.orders_30_days)}</p>
                <span>{this.intl.get('otc-month-amount')}</span>
              </div>
              <div className='info-detail-item'>
                <p>{Number(info.avg_rls_time) < 60 ? Number(info.avg_rls_time) + 's' : Number(Math.round(Number(Number(info.avg_rls_time).div(0.6))).div(100)) + 'min'}</p>
                <span>{this.intl.get('otc-avgCost')}</span>
              </div>
            </div>
          </div>
          <div className='info-regist'>
            <div className='regitst-time'>
              <span>{this.intl.get('otc-regist-time')}:</span>
              <span>{Number(info.register_date).toDate("yyyy-MM-dd HH:mm:ss")}</span>
            </div>
            <div className='regist-status'>
              {this.registStatus.map((v, index) => (
                  <div className={`regist-status-items ${info.authenStatus && (info.authenStatus.indexOf(v.status) >= 0 ? 'regist-status-prof' : '')}`} key={index}>
                  <em></em>
                    <span>{v.name}</span>
                  </div>
              ))}
            </div>
          </div>
        </div>
    )
  }
}