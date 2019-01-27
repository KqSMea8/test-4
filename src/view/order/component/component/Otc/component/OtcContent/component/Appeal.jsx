import React from 'react'
import ExchangeViewBase from "@/components/ExchangeViewBase";
import Button from '@/common/baseComponent/Button/index.jsx'
import Input from '@/common/baseComponent/Input/index.jsx'
const scrollbot = require('simulate-scrollbar');
import PropTypes from "prop-types";
import {
  COMMON_RADIO_GET,
  COMMON_RADIO_NORMAL,
  ASSET_CLOSED
} from '@/config/ImageConfig'
export default class Appeal extends ExchangeViewBase {
  static propTypes = {
    onConfirm: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    // reasonArr: PropTypes.array.isRequired,
  };
  constructor(props) {
    super(props)
    this.state={
      text: '',
      reason: '',
      contact: ''
    }
    this.rules = [
      this.intl.get('order-appeal-rules1'),
      this.intl.get('order-appeal-rules2'),
      this.intl.get('order-appeal-rules3'),
    ]
    this.reason = [
      this.intl.get('order-appeal-select-reason1'),
      this.intl.get('order-appeal-select-reason2'),
      this.intl.get('order-appeal-select-reason3'),
      this.intl.get('order-appeal-select-reason4'),
      this.intl.get('order-appeal-select-reason5'),
    ]
  }

  componentDidMount() {
    this.customScroll = new scrollbot('#appeal_scroll', 10);
    this.customScroll.setStyle({
      block: {
        backgroundColor: '#eee',
        borderRadius: '5px',
      },//滑块样式
      groove: {
        backgroundColor: '#FFF',
        borderRadius: '5px',
      }//滚动槽样式
     })
  }

  changeText=(text)=>{
    this.setState({text})
  }
  changeContact=(contact)=>{
    this.setState({contact})
  }

  confirm=()=>{
    if(!(this.state.reason && this.state.contact) && this.state.reason !==0) return;
    this.props.onConfirm(this.state)
  }
  close=()=>{
    this.props.onClose()
  }
  render() {
    return (
      <div className="otc-order-appeal">
        <div className="otc-order-appeal-content">
          <h3 className="otc-order-appeal-title">
            {this.intl.get('order-appeal-know')}
            <img src={ASSET_CLOSED} alt="" onClick={this.close} />
          </h3>
          <div id="appeal_scroll" style={{width:'100%', height: '420px', overflow: 'hidden'}}>
            <div>
              <div className="otc-order-appeal-main">
                <ol className="appeal-rules">
                  {this.rules.map((v, i)=><li key={i}>{v}</li>)}
                </ol>
                <div className="appeal-radio">
                  <h4>{this.intl.get('order-appeal-select-type')}</h4>
                  <ul className="appeal-reasons">
                    {this.reason.map((v,i)=><li key={i}>
                      <label onClick={()=>{this.setState({reason: i+1})}}>
                        <img src={i+1 === this.state.reason ? COMMON_RADIO_GET : COMMON_RADIO_NORMAL} alt=""/>
                        {v}
                      </label>
                    </li>)}
                  </ul>
                </div>
                <div className="textarea">
                  <Input
                    type='textarea'
                    value={this.state.text}
                    placeholder={this.intl.get('order-appeal-input')}
                    onInput={this.changeText}
                  />
                </div>
                <div className="contact">
                  <h4>{this.intl.get('order-appeal-contact')}</h4>
                  <Input
                    value={this.state.contact}
                    onInput={this.changeContact}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="otc-order-appeal-foot">
            <Button title={this.intl.get('ok')} type="base" disable={!(this.state.reason && this.state.contact) && this.state.reason !==0 } onClick={this.confirm}/>
          </div>
        </div>
      </div>
    )
  }
}
