import ExchangeViewBase from '@/components/ExchangeViewBase'
import React, {Component} from "react";
import SelectButton from "@/common/baseComponent/SelectButton";
import Button from "@/common/baseComponent/Button";
import Input from "@/common/baseComponent/Input";
import DatePicker from "@/common/baseComponent/DatePicker/DatePicker";
import OrderCountDown from '../../../../common/OrderCountDown'
import Pagination  from "@/common/baseComponent/Pagination/index.jsx"
import PropTypes from "prop-types"
import {
  NavLink,
} from "react-router-dom";
import {
  formatQueryToPath,
  resolveOtcPath
} from "@/config/UrlConfig"


export default class OrderOtcInfo extends ExchangeViewBase {
  static defaultProps = {
    type: 'orderCurrent',
    // personType: 0,
  };
  static propTypes = {
    type: PropTypes.string.isRequired,
    otcOrderContent: PropTypes.array.isRequired,
    // personType: PropTypes.number.isRequired,
    currency: PropTypes.string.isRequired,
    currencyArr: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
    const {controller} = this.props;
    //绑定view
    controller.setView(this);
    this.state = {
      page_no: 1,
      personType: 2,
      currency: this.intl.get('all'),
      oid: '',
      startTime: Math.floor(new Date().getTime() / 1000) - 7 * 24 * 60 * 60,
      endTime: Math.floor(new Date().getTime() / 1000),
      count: 0
    };
    this.tableHead = {
      orderCurrent: [
        {name: this.intl.get('date'), type: 'create'},
        {name: this.intl.get('order-no'), type: 'id'},
        {name: this.intl.get('amount'), type: 'amountc', disType: true, currency: true},
        {name: this.intl.get('order-price-s'), type: 'price', digital: true},
        {name: this.intl.get('order-price-t'), type: 'amountm', digital: true},
        {name: this.intl.get('state'), type: 'state'},
        {name: this.intl.get('order-limit-time'), type: 'time', msg: true,},
        {name: this.intl.get('order-remark'), type: 'remark', jump: true},
      ],
      orderDeal: [
        {name: this.intl.get('date'), type: 'date'},
        {name: this.intl.get('order-no'), type: 'number'},
        {name: this.intl.get('amount'), type: 'amount', disType: true, currency: true},
        {name: this.intl.get('order-price-s'), type: 'singlePrice', digital: true},
        {name: this.intl.get('order-price-t'), type: 'totalPrice', digital: true},
        {name: this.intl.get('fee'), type: 'fee'},
        {name: this.intl.get('order-remark'), type: 'remark', jump: true},
      ],
      orderCancel: [
        {name: this.intl.get('date'), type: 'date'},
        {name: this.intl.get('order-no'), type: 'number'},
        {name: this.intl.get('amount'), type: 'amount', disType: true, currency: true},
        {name: this.intl.get('order-price-s'), type: 'singlePrice', digital: true},
        {name: this.intl.get('order-price-t'), type: 'totalPrice', digital: true},
        {name: this.intl.get('fee'), type: 'fee', digital: true},
        {name: this.intl.get('order-remark'), type: 'remark', jump: true},
      ],
    };
    this.disType = [this.intl.get('buy'), this.intl.get('sell')];
    this.person = [
      {name: this.intl.get('order-bussiness'), type: 1},
      {name: this.intl.get('order-user'), type: 2},
     ]
    this.orderStateB = {
      1: this.intl.get('otc-lock-coin'),
      2: this.intl.get('otc-wait-coin'),
      3: this.intl.get('otc-claiming'),
    };
    this.orderStateS = {
      1: this.intl.get('otc-wait-payed'),
      2: this.intl.get('otc-payed'),
      3: this.intl.get('otc-claiming'),
    };
    this.uid = ''
    //初始化数据，数据来源即store里面的state
  }

  async componentDidMount() {
    const {type, getCurrency, otcOrderStore, otcUnread} = this.props;
    let uid = this.props.uid;
    this.uid = JSON.stringify(uid);
    const state = {
      orderCurrent: 1,
      orderDeal: 2,
      orderCancel: 3,
    };
    if(type === 'orderDeal'){
      let currency = this.state.currency === this.intl.get('all') ? '' : this.state.currency;
      await getCurrency();
      await this.props.otcOrderStore(2,this.state.page_no, this.state.personType, this.state.startTime * 1000, this.state.endTime * 1000, currency)
    }
    if(type !== 'orderDeal'){
      await otcOrderStore(state[type]);
    }
    if(type === 'orderCurrent'){
      await otcUnread();
    }
    this.setState({
      count: this.props.count
    })
  }

  startTime(e) {
    this.setState({
      startTime: parseInt(e / 1000)
    })
  }

  endTime(e) {
    this.setState({
      endTime: parseInt(e / 1000)
    })
  }
  oidInput(value){
    if (!(/^[0-9]*$/).test(value.trim()))
      return;
    this.setState({oid: value})
  }
  changePersonType(value){
    this.setState({
      personType: value.type
    })
  }
  async search(){
    // this.props.resetPage();
    let currency = this.state.currency === this.intl.get('all') ? '' : this.state.currency;
    await this.props.otcOrderStore(2,1,this.state.personType, this.state.startTime * 1000, this.state.endTime * 1000, currency, (this.state.oid !== '') && JSON.parse(this.state.oid) || 0);
    this.setState({
      page_no: 1,
      count: this.props.count
    })
  }
  async reset(){
    // this.props.resetPage();
    await this.props.otcOrderStore(2, 1, 2);
    this.setState({
      personType: 2,
      currency: this.intl.get('all'),
      oid: '',
      startTime: Math.floor(new Date().getTime() / 1000) - 7 * 24 * 60 * 60,
      endTime: Math.floor(new Date().getTime() / 1000),
      page_no:1,
      count: this.props.count
    })
  }
  async changePage(page_no){
    const state = {
      orderCurrent: 1,
      orderDeal: 2,
      orderCancel: 3,
    };
    if(this.props.type === 'orderDeal'){
      await this.props.otcOrderStore(2, page_no, this.state.personType, this.state.startTime * 1000, this.state.endTime * 1000, this.state.currency === this.intl.get('all') ? '' : this.state.currency)
    }
    else{
      await this.props.otcOrderStore(state[this.props.type], page_no);
    }
    this.setState({
      page_no
    })
  }
  render() {
    const {
      type,
      otcOrderContent,
      currencyArr
    } = this.props;
    return (
        <div className='order-otc-info'>
          {type === 'orderDeal' ? (
              <div className='order-otc-filter'>
                <Input
                    placeholder={this.intl.get('order-num-input')}
                    className='order-otc-input'
                    onInput={this.oidInput.bind(this)}
                    value={this.state.oid}
                />
                <span>{this.intl.get('order-person')}</span>
                <SelectButton
                    title={this.person[this.state.personType - 1].name}
                    type="main"
                    className="order-otc-select"
                    onSelect={this.changePersonType.bind(this)}
                    valueArr={this.person}
                />
                <span>{this.intl.get('order-cur')}</span>
                <SelectButton
                    title={this.state.currency}
                    type="main"
                    className="order-otc-select"
                    onSelect={(value) => {this.setState({
                      currency: value,
                    })}}
                    valueArr={currencyArr}
                />
                <DatePicker
                    startTime={this.state.startTime}
                    endTime={this.state.endTime}
                    onChangeStart={(e) => this.startTime(e)}
                    onChangeEnd={(e) => this.endTime(e)}
                />
                <Button
                    title={this.intl.get('search')}
                    className='order-filter-search order-otc-button'
                    onClick={this.search.bind(this)}
                />
                <Button
                    title={this.intl.get('reset')}
                    className='order-filter-reset order-otc-button'
                    onClick={this.reset.bind(this)}
                />
              </div>
          ) : null}
          <table className='order-otc-info-table'>
            <thead>
            <tr>
              {this.tableHead[type].map((v, index) => (
                  <td key={index}>
                    {v.name}
                  </td>
              ))}
            </tr>
            </thead>
            <tbody>
            {otcOrderContent.map((v, index) => (
                <tr key={index}>
                  <td>{Number(v.create).toDate('yyyy-MM-dd HH:mm')}</td>
                  <td>{JSON.stringify(v.id)}</td>
                  <td><span className={JSON.stringify(v.seller) === this.uid ? 'otc-sell' : 'otc-buy'}> {this.disType[JSON.stringify(v.seller) === this.uid ? 1 : 0]}&nbsp;&nbsp;&nbsp;</span> {Number(v.amountc).maxHandle(6)}{v.currency.toUpperCase()}</td>
                  <td>{Number(v.price).maxHandle(2)}{v.money.toUpperCase()}</td>
                  <td>{Number(v.amountm).maxHandle(2)}{v.money.toUpperCase()}</td>
                  {type === 'orderCurrent' && (<td><span className={v.state === 1 ? 'otc-sell' : 'otc-buy'}>{this.uid === JSON.stringify(v.seller) ? this.orderStateS[v.state] : this.orderStateB[v.state]}</span></td>)}
                  {type === 'orderCurrent' ?
                      (<td>
                        {v.state === 1 ? <OrderCountDown time={v.overtime}/> : '-'}
                        {v.unRead ? <em>{this.intl.get('otc-new-message')}<b>{v.unRead}</b></em> : null}
                      </td>) : null}
                  {type !== 'orderCurrent' ? ( <td>{v.fee} {v.currency.toUpperCase()}</td>) : null}
                  <td>{(JSON.stringify(v.buyer) === this.uid && v.type === 1) || (JSON.stringify(v.seller) === this.uid && v.type === 2) ? (<a href={resolveOtcPath('/bussiness', {trader: JSON.stringify(v.buyer) === this.uid ? JSON.stringify(v.seller): JSON.stringify(v.buyer)})}>{v.sotre_name}</a>) : <span>{v.name}</span>}
                    &nbsp;&nbsp;
                      <NavLink to={formatQueryToPath('/otc/content',{id: JSON.stringify(v.id)})}>{this.intl.get('order-jump')}</NavLink></td>
                  {/*{*/}
                    {/*// this.tableHead[type].map((vv, num) => (*/}
                    {/*//     <td key={num} className={vv.jump ? 'otc-active' : ''}>*/}
                    {/*//       {vv.disType ? (<span className={v.type === 2 ? 'otc-sell' : 'otc-buy'}> {this.disType[2 - v.disType]}&nbsp;&nbsp;&nbsp;</span>) : null}*/}
                    {/*//       {vv.type === 'remark' ? (<a href="" className='otc-remark'>{v[vv.type]}</a>) : ''}*/}
                    {/*//       {(vv.type !== 'remark' && vv.type !== 'time') && v[vv.type]}*/}
                    {/*//       {vv.type === 'time' ? (<OrderCountDown time={v.time}/>) : null}*/}
                    {/*//       {vv.currency ? v.currency : ''}*/}
                    {/*//       {vv.digital ? v.digital : ''}*/}
                    {/*//       {vv.jump ? (<a href="">{this.intl.get('order-jump')}</a>) : null}*/}
                    {/*//     </td>*/}
                    {/*// ))*/}
                  {/*}*/}
                </tr>
            ))}
            </tbody>
          </table>
          {!otcOrderContent || !otcOrderContent.length && <div className="no-order-detail-list">{this.intl.get('noRecords')}</div> || ''}
          <div className={`order-content-page`}>
            <Pagination
                total={this.state.count}
                showTotal={true}
                pageSize={20}
                onChange={page => {this.changePage(page)}}
                showQuickJumper={true}
                currentPage={this.state.page_no}/>
          </div>
        </div>
    )
  }
}