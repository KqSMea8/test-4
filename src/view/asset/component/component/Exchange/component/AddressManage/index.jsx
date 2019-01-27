import React, {Component} from "react";
import intl from "react-intl-universal";
import QRCode from 'qrcode-react';
import Input from '@/common/baseComponent/Input';
import BasePopup from '@/common/baseComponent/Popup';
import TwoVerifyPopup from '@/common/component/viewsPopup/TwoVerifyPopup';
import Button from '@/common/baseComponent/Button';
import {AsyncAll} from '@/core';
import {getQueryFromPath, changeUrlFromPath} from '@/config/UrlConfig'
import { ADDRESS_CODE_HOVER, ADDRESS_CODE_NORMAL } from '@/config/ImageConfig';

export default class AddressManage extends Component {
  constructor(props) {
    super(props);
    this.intl = intl;
    this.state = {
      value: '',
      currency: 'BTC',
      showSearch: false,
      walletExtract: {},
      newAddress: [],
      addressInput: '',
      remark: '',
      tip: false,
      tipSuccess: true,
      tipContent: '',
      showTwoVerify: false,
      verifyType: 0, //两步验证确认后的操作 0 申请提币订单，1 添加提币地址
      firstVerify: 2,//增加提币地址时优先的二次验证类型 1 邮件，2谷歌，3短信
      verifyNum: this.intl.get('sendCode'),
      deleTip: false,
      deleItem: '',
      deleText: this.intl.get('asset-delet-confirm'),
      showInfoIndex: -1,
      showCodeIndex: -1,
      selectCoin: '',
      selectCoinShow: false
    };
    const controller = this.props.controller;
    controller.setView(this);

    let {walletList, walletExtract} = controller.initState;
    this.state = Object.assign(this.state, {walletList, walletExtract});

    this.deal = controller.dealCoin.bind(controller);
    this.getWalletList = controller.getWalletList.bind(controller);
    this.getExtract = controller.getExtract.bind(controller);
    this.getUserInfo = controller.getUserInfo.bind(controller);
    this.getVerify = controller.getVerify.bind(controller);
    this.twoVerify = controller.twoVerify.bind(controller);
    this.destroy = controller.clearVerify.bind(controller);

    this.addAddress = this.addAddress.bind(this);
    this.deleteAddress = this.deleteAddress.bind(this);
    this.toggleInfo = this.toggleInfo.bind(this);
    this.beforeAppendaddress = controller.beforeAppendaddress.bind(controller);
  }

  async componentDidMount() {
    // this.props.sendStatis({
    //   event: 'assetsPV',//操作代码
    //   type: 'balance',//tab
    // })
    let currency = getQueryFromPath('currency').toUpperCase() || 'BTC';
    let obj = await this.getWalletList(),
        result = await AsyncAll([this.getExtract(currency), this.getUserInfo()])
    this.setState(Object.assign({currency}, obj, ...result));
  }

  // 新增地址
  addAddress(curExtract) {
    let {addressInput, remark} = this.state;
    if (!addressInput.trim() || !remark.trim()) {
      this.setState({tip: true, tipSuccess: false, tipContent: this.intl.get('asset-incomplete')});
      return;
    }
    let obj = Object.assign({ coinName: this.state.currency }, {address: addressInput, addressName: remark});
    let flag = this.beforeAppendaddress(obj, curExtract && curExtract.addressList);
    if(!flag) return;
    let newAddress = [{address: addressInput, addressName: remark}]
    this.setState({
      newAddress,
      showTwoVerify: true,
      verifyType: 1,
      verifyNum: this.intl.get('sendCode')
    });
  }
  // 删除地址
  deleteAddress() {
    this.setState({deleTip: false});
    this.props.controller.deletAddress(Object.assign({coinName: this.state.currency}, this.state.deleItem));
  }

  // 切换地址列表详情
  toggleInfo(index) {
    if (this.state.showInfoIndex === index) {
      this.setState({showInfoIndex: -1, showCodeIndex: -1});
    } else {
      this.setState({showInfoIndex: index, showCodeIndex: -1});
    }
  }

  render() {
    let walletList = this.deal(this.state.walletList, 'w');
    let searchArr = this.props.controller.filter(
      walletList,
      this.state.currency.toUpperCase()
    );
    let extractAddr = this.state.walletExtract.extractAddr,
    filteExtractAddr = this.state.selectCoin === '' ? extractAddr : extractAddr.filter(v=>v.coinName.toUpperCase().includes(this.state.selectCoin.toUpperCase()))
    let curExtract = this.state.walletExtract.extractAddr.filter(
      v => v.coinName === this.state.currency.toLowerCase()
    )[0];
    let searchCoin = this.props.controller.filter(walletList, this.state.value.toUpperCase());

    return (
        <div className='address-manage-wrap'>
          <h3><span>{this.intl.get("asset-withdraw")}</span>&nbsp;&gt;&nbsp;<span className='active'>{this.intl.get('asset-address-manage')}</span></h3>
          <div className="form">
            <div className='coinname section clearfix'>
              <span className='section-title'>{this.intl.get("asset-selectCoin")}</span>
              <Input
                type='search2'
                value={this.state.currency}
                onInput={value => this.setState({currency: value})}
                onFocus={() => this.setState({showSearch: true})}
                onEnter={() => {
                  let currency = searchArr[0] || 'BTC';
                  this.setState({currency, showSearch: false});
                  changeUrlFromPath('currency', currency.toLowerCase());
                }}
                clickOutSide={() => {
                  if(!this.state.showSearch) return;
                  let currency = searchArr[0] || 'BTC';
                  this.setState({currency, showSearch: false});
                  changeUrlFromPath('currency', currency.toLowerCase());
                }}
              >
                <ul className={`search-list ${this.state.showSearch && searchArr.length ? '' : 'hide'}`}>
                  {searchArr.map((item, index) => (
                    <li key={index} onClick={(e) => {
                      e.stopPropagation();
                      e.nativeEvent.stopImmediatePropagation();
                      this.setState({currency: item, showSearch: false});
                      changeUrlFromPath('currency', item.toLowerCase());
                    }}>{item}</li>
                  ))}
                </ul>
              </Input>
            </div>
            <div className='address section clearfix'>
              <span className='section-title'>{this.intl.get('asset-withdrawAddress')}</span>
              <Input
                type='default'
                placeholder={this.intl.get('asset-address-input')}
                value={this.state.addressInput}
                onInput={value => this.setState({addressInput: value})}
              />
            </div>
            <div className='remarks section clearfix'>
              <span className='section-title'>{this.intl.get('name')}</span>
              <Input
                type='default'
                placeholder={this.intl.get('asset-address-input-remark')}
                value={this.state.remark}
                onInput={value => this.setState({remark: value})}
              />
            </div>
            <button className='add-button' onClick={()=>{this.addAddress(curExtract)}}>{this.intl.get('add')}</button>
          </div>
          <div className='list section clearfix'>
            <span className='section-title'>{this.intl.get('asset-list')}</span>
            <div className='list-container'>
              <div className='list-head clearfix'>
                <div className='list-head-first'>
                  <Input type='search2' placeholder={this.intl.get("asset-currency")}
                    value={this.state.value}
                    onInput={value => this.setState({value: value})}
                    onFocus={() => this.setState({selectCoinShow: true})}
                    onEnter={() => {
                      if (this.state.value.trim()) {
                        this.setState({selectCoin: this.state.value, selectCoinShow: false})
                      } else {
                        this.setState({selectCoin: '', selectCoinShow: false})
                      }
                    }}
                    clickOutSide={() => {
                      if(!this.state.selectCoinShow) return;
                      if (this.state.value.trim()) {
                        this.setState({selectCoin: this.state.value, selectCoinShow: false})
                      } else {
                        this.setState({selectCoin: '', selectCoinShow: false})
                      }
                    }}
                  >
                    {this.state.selectCoinShow && <ul className='search-list'>
                      {searchCoin.map((coinname, index) => (
                        <li key={index} onClick={(e) => {
                          e.stopPropagation();
                          e.nativeEvent.stopImmediatePropagation();
                          this.setState({selectCoin: coinname, value: coinname, selectCoinShow: false})
                        }}
                        >{coinname}</li>
                      ))}
                    </ul>}
                  </Input>
                </div>
                <div className='list-head-second'>{this.intl.get('asset-address-amount')}</div>
                <div className='list-head-third'>{this.intl.get('option')}</div>
              </div>
              {filteExtractAddr.length ? filteExtractAddr.map((item, outerIndex) => (
                <div key={outerIndex}>
                  <div className='list-item'>
                    <span>{item.coinName.toUpperCase()}</span>
                    <span>{item.addressList.length}</span>
                    <span onClick={() => {this.toggleInfo(outerIndex)}} className={this.state.showInfoIndex === outerIndex ? 'active' : ''}>详情
                    </span>
                  </div>
                  {this.state.showInfoIndex === outerIndex && <div className='list-info'>
                    {item.addressList.length > 0 ? (
                      <div className='info-content clearfix'>
                        <div className='name'>{this.intl.get('remark')}</div>
                        <div className='address'>&nbsp;</div>
                        <div className='delete'>{this.intl.get('asset-create-time')}</div>
                      </div>
                    ):(
                      <div className='info-prompt'>
                        <p>{this.intl.get('asset-add-address')}</p>
                      </div>
                    )}

                    {item.addressList.map((item, index) => (
                      <div className='info-content clearfix' key={index}>
                        <div className='name'>{item.addressName}</div>
                        <div className='address clearfix'>
                          <img
                            src={(this.state.showCodeIndex === index && this.state.showInfoIndex === outerIndex) ? ADDRESS_CODE_HOVER : ADDRESS_CODE_NORMAL}
                            onMouseEnter={() => this.setState({showCodeIndex: index})}
                            onMouseLeave={() => this.setState({showCodeIndex: -1})}/>
                          <p>{item.address}</p>
                          {(this.state.showCodeIndex === index && this.state.showInfoIndex === outerIndex) && <div className='code'>
                            <QRCode value={item.address} level='M'/>
                          </div>}
                        </div>
                        <div className='delete'>
                          <Button
                            title={this.intl.get('delete')}
                            theme='danger'
                            onClick={() => this.setState({deleTip: true, deleItem: item})}
                          />
                        </div>
                        <div className='code'></div>
                      </div>
                    ))}
                  </div>}
                </div>
              ))
              :
              <div className="empty">
                <p>{this.intl.get('noRecords')}</p>
              </div>
              }
            </div>
          </div>
          {this.state.showTwoVerify && (
            <TwoVerifyPopup
              verifyNum={this.state.verifyNum}
              type={!this.state.verifyType ? this.state.userTwoVerify.withdrawVerify : this.state.firstVerify} //两步验证码类型
              getVerify={this.getVerify}
              onClose={() => {
                this.setState({ showTwoVerify: false });
              }}
              destroy={this.destroy}
              onConfirm={async (code) => {
                this.twoVerify(code, curExtract)
              }}
            />
          )}
          {this.state.tip && (
            <BasePopup
              type={this.state.tipSuccess ? 'tip1' : 'tip3'}
              msg={this.state.tipContent}
              onClose={() => {
                this.setState({ tip: false });
              }}
              autoClose={true}
            />
          )}
          {this.state.deleTip && (
            <BasePopup
              type='confirm'
              msg={this.state.deleText}
              onConfirm={this.deleteAddress}
              onClose={()=>{
                this.setState({deleTip: false});
              }}
            />
          )}
        </div>
    );
  }
}