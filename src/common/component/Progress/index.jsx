/*
  percent 进度条长度
  position: top right 指标位置 false  不显示指标
  width 总长度
 */

import React, { Component } from "react";

export default class Progress extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    let {percent, position, width} = this.props
    return (
      <div className="progress-wrap clearfix">
        {(position && (position === 'top' && <span className={position} style={{left: `${(percent / 100) * 400}px`}}>{`${percent}%`}</span>)) || null}
        {(position && (position === 'right' && <span className={position}>{`${percent}%`}</span>)) || null}
        <div className="progress-line">
          <p style={{width: `${(percent / 100) * width}px`}}></p>
        </div>
      </div>
    );
  }
}
