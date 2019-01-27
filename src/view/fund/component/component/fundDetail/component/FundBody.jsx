import React, {Component} from 'react';
import ExchangeViewBase from "@/components/ExchangeViewBase";
import {TLB_CIRCLE} from '@/config/ImageConfig';

export default class FundBody extends ExchangeViewBase {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className='fund-body'>
        {this.props.children}
      </div>
    )
  }
}

class title extends FundBody {
  render() {
    return (
      <div className='fund-title'>
        <img src={TLB_CIRCLE} alt=""/>
        <h3>{this.props.content}</h3>
      </div>
    )
  }
}

class ul extends FundBody {
  render() {
    return (
      <ul className='fund-body-ul'>
        {this.props.ulItems.map((v, index) => (
          <li key={index}>
            <p>{v.title}</p>
            <span>{v.content}</span>
          </li>
        ))
        }
      </ul>
    )
  }
}

FundBody.title = title;
FundBody.ul = ul;
