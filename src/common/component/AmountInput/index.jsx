import React, {Component} from 'react';
import ExchangeViewBase from '@/components/ExchangeViewBase'
import Input from '@/common/baseComponent/Input'

export default class AmountInput extends ExchangeViewBase {
  constructor(props) {
    super();
  }
  add = ()=> this.props.add()
  minus = ()=> this.props.minus()
  onInput = (value)=> this.props.onInput(value)
  onFocus = ()=> (this.props.onFocus && this.props.onFocus())
  onBlur = ()=> (this.props.onBlur && this.props.onBlur())
  render() {
    return <div className={`taolibao-common-input ${this.props.className ? this.props.className : '' }`}>
        <span onMouseDown={this.minus}></span>
        <Input value={this.props.value} onInput={this.onInput} onFocus={this.onFocus} onBlur={this.onBlur}></Input>
        <span onMouseDown={this.add}></span>
    </div>
  }
}
