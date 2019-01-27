import React from 'react'
import ExchangeViewBase from "@/components/ExchangeViewBase.jsx"
import MyAdSearch from './components/MyAdSearch'
import MyAdItem from './components/MyAdItem'
import Pagination  from "@/common/baseComponent/Pagination/index.jsx"
import './stylus/index.styl'

export default class MyAdvertisingList extends ExchangeViewBase{
  constructor(props){
    super(props);
    this.state = {
      myAdList: [],
      adNumber: '',
      type: this.intl.get('all'),
      currency: this.intl.get('all'),
      currencyArr: ['BTC', 'USDT', this.intl.get('all')],
      page_no: 1,
      count: 0,
      hasStore: false,
      dbFlag: false
    };
    this.type = 0;
    this.typeObj = {
      0: this.intl.get('all'),
      1: this.intl.get('sell'),
      2: this.intl.get('buy'),
    }
    this.hasStore = props.controller.userController.hasStore.bind(props.controller.userController)
  }
  async componentDidMount(){
    let result = await this.hasStore();
    if(result === true) {
      this.setState({hasStore: true})
      const {controller} = this.props;
      let currencyArr = controller.store.state.currencyArr;
      let myAdList = await controller.otcSales('', 0, this.props.controller.userId, 0, 2, 7, 1, 10, 0, 0);
      if(!currencyArr.length){
        currencyArr = await controller.canDealCoins();
        currencyArr.push(this.intl.get('all'));
      }
      this.setState({
        count: myAdList.count,
        currencyArr,
        myAdList: myAdList.sales || []
      })
      return;
    }
    this.props.history.push('/advertisingList');
  }

  adNumberInput(adNumber){
    if(!/^[0-9]*$/.test(adNumber)) return;
    adNumber && this.props.controller.changeKey('sale_id', JSON.parse(adNumber));
    this.setState({
      adNumber
    })
  }
  changeType(value){
    // this.props.controller.changeKey('type', value.type);
    this.type = value.type;
    this.setState({
      type: value.name
    })
  }
  changeCurrency(currency){
    // let value = currency ===  this.intl.get('all') ? '' : currency;
    // this.props.controller.changeKey('currency', value);
    this.setState({
      currency
    })
  }
  async search(){
    let myAdList = await this.props.controller.otcSales((this.state.currency !== this.intl.get('all') && this.state.currency || ''),  (this.state.adNumber !== '' && JSON.parse(this.state.adNumber)) || 0, this.props.controller.userId, this.type, 2, 7, 1, 10, 0, 0);
    this.setState({
      myAdList: myAdList.sales || [],
      count: myAdList.count
    })
  }
  async reset(){
    let myAdList = await this.props.controller.otcSales('', 0, this.props.controller.userId, 0, 2, 7, 1, 10, 0, 0);
    this.type = 0;
    this.setState({
      myAdList: myAdList.sales || [],
      count: myAdList.count,
      adNumber: '',
      type: this.intl.get('all'),
      currency: this.intl.get('all'),
    })
  }
  async changeAdLine(ids, state, online){
    if(state === online)
      return;
    if(this.state.dbFlag)
      return;
    this.setState({
      dbFlag: true
    });
    let result = await this.props.controller.otcHandleSale([ids], online);
    this.setState({
      dbFlag: false
    });
    if(result){
      this.props.controller.popupController.setState({
        isShow: true,
        type: 'tip2',
        msg: this.intl.get('otc-out-fail'),
      })
    }
    if(!result){
      let myAdList = this.state.myAdList;
      let index = this.state.myAdList.findIndex(v => JSON.stringify(v.id) === JSON.stringify(ids));
      myAdList[index].state = online;
      this.setState({myAdList})
    }
  }
  async deleteConfirm(id){
    let result = await this.props.controller.otcDelSale(id);
    if(result){
      this.props.controller.popupController.setState({
        isShow: true,
        type: 'tip2',
        msg: this.intl.get('otc-delete-fail'),
      })
    }
    if(!result){
      let myAdList = this.state.myAdList;
      let index = this.state.myAdList.findIndex(v => JSON.stringify(v.id) === JSON.stringify(id));
      myAdList.splice(index,1);
      this.setState({myAdList});
      this.props.controller.popupController.setState({
        isShow: false,
      })
    }
  }
  deleteAd(id){
    this.props.controller.popupController.setState({
      isShow: true,
      type: 'custom',
      icon: 'warning',
      confirmText: this.intl.get('ok'),
      cancelText: this.intl.get('cance'),
      msg: this.intl.get('otc-del-add'),
      onConfirm: () => {this.deleteConfirm(id)}
    })
  }
  async changePage(page_no){
    // this.props.controller.changeKey('page_no', page_no);
    let myAdList = await this.props.controller.otcSales(this.props.controller.store.state.currency,  this.props.controller.store.state.sale_id, this.props.controller.userId, this.props.controller.store.state.type, 2, 7, page_no, 10, 0, 0);
    this.setState({
      myAdList: myAdList.sales,
      page_no,
      adNumber: this.props.controller.store.state.sale_id || '',
      currency: this.props.controller.store.state.currency || this.intl.get('all'),
      type: this.typeObj[this.props.controller.store.state.type]
    })
  }
  render(){
    // console.log('this.props.history', this.props.history)
    return(
        this.state.hasStore ? <div className='otc-my-ad'>
          <MyAdSearch
              adNumber={this.state.adNumber}
              type={this.state.type}
              changeType={this.changeType.bind(this)}
              changeCurrency={this.changeCurrency.bind(this)}
              currency={this.state.currency}
              currencyArr={this.state.currencyArr}
              adNumberInput={this.adNumberInput.bind(this)}
              search={this.search.bind(this)}
              reset={this.reset.bind(this)}
          />
          <MyAdItem
              myAdList={this.state.myAdList}
              changeAdLine={this.changeAdLine.bind(this)}
              deleteAd={this.deleteAd.bind(this)}
              history={this.props.history}
          />
          <div className={`my-ad-page`}>
            <Pagination
                total={this.state.count || 0}
                showTotal={true}
                pageSize={10}
                onChange={this.changePage.bind(this)}
                showQuickJumper={true}
                currentPage={this.state.page_no}/>
          </div>
        </div>: <div></div>
    )
  }
}