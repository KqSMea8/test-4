import React, { Component } from 'react'
import ExchangeViewBase from '@/components/ExchangeViewBase'
import Textarea from "@/common/baseComponent/Input"
import PropTypes from "prop-types";

export default class Remarks extends ExchangeViewBase {
  static propTypes = {
    markers:PropTypes.string.isRequired,
    changeMarkers:PropTypes.func.isRequired,
  };
  constructor(props) {
    super(props)
    this.state={
      length: 200,
    }
  }
  changeMarkers = (value)=>{
    if(value.length>this.state.length){
      this.props.changeMarkers(this.props.markers);
      return;
    }
    this.props.changeMarkers(value);
  }


  render() {
    const {markers} = this.props;
    return (
      <div className='adForm-content-item adForm-content-remarks clearfix'>
        <h3>{this.intl.get('otc-publish-marks')}</h3>
        <div className="adForm-content-main clearfix">
          <div className="textarea  clearfix">
            <Textarea
              type='textarea'
              value={markers}
              placeholder={this.intl.get('otc-publish-inputMarks')}
              onInput={this.changeMarkers}
            />
            <span>
              {`${markers.length}/${this.state.length}`}
            </span>
          </div>
        </div>
      </div>
    )
  }
}
