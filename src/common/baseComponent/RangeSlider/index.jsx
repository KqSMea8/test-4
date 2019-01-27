import React, { Component } from "react";
import PropTypes from "prop-types";

export default class RangeSlider extends Component {
  static defaultProps = {
    // defaultValue: 0, //设置初始取值
    value: 0,
    // disabled: false, //值为 true 时，滑块为禁用状态
    // dots: false, //是否只能拖拽到刻度上
    // marks: [{key: 0, title: '0%'},{key: 20, title: '20%'},{key: 40, title: '40%'},{key: 80, title: '80%'},{key: 100, title: '100%'},],//刻度标记，格式[{key: 30, title: 'aaa'}], key 的类型必须为 number 且取值在闭区间 min, max 内
    marks: [],//刻度标记，格式[{key: 30, title: 'aaa'}], key 的类型必须为 number 且取值在闭区间 min, max 内
    min: 0,//最小值
    max: 100,//最大值
    step: 1, //步长，取值必须大于 0，并且可被 (max - min) 整除。当 marks 不为空对象时，可以设置 step 为 null，此时 Slider 的可选值仅有 marks 标出来的部分。
    tipFormatter: (value)=> {return value+'%'}, //Slider 会把当前值传给 tipFormatter，并在 Tooltip 中显示 tipFormatter 的返回值，若为 null，则隐藏 Tooltip。
    onChange: (value)=> value, //当 Slider 的值发生改变时，会触发 onChange 事件，并把改变后的值作为参数传入。
    // onAfterChange: (value)=> value,//与 onmouseup 触发时机一致，把当前值作为参数传入
    color: '#FF9E2F'//滑动槽active颜色
  };

  static propTypes = {
    value: PropTypes.number,
    // disabled: PropTypes.bool,
    // dots: PropTypes.bool,
    marks: PropTypes.array,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    tipFormatter: PropTypes.func,
    onChange: PropTypes.func,
    onAfterChange: PropTypes.func,
    color: PropTypes.string,
  };
  constructor(props) {
    super(props);
    this.state={
      // value: props.defaultValue > props.max ? props.max : props.defaultValue < props.min ? rops.min : props.defaultValue,
      range: props.max - props.min,
      step: props.step,
      marks: props.marks.filter((v)=> v.key >= props.min && v.key <= props.max),
      tipValue: '',
      showTip: false
    }
  }

  computedValue = (value)=>{
    let curValue = Number(Math.round(value / this.state.step).multi(this.state.step))
    if(curValue > this.props.max) return this.props.max;
    if(curValue < this.props.min) return this.props.min;
    return curValue;
  }

  marksClickHandle = (value)=>{
    this.props.onChange(this.computedValue(value))
    this.setState({tipValue: this.props.tipFormatter(this.computedValue(value)), showTip: true})
  }
  dragMouseDownHandle = (e)=>{
    if(e.nativeEvent.target.className !== 'range-block') {
      let value = (e.nativeEvent.offsetX / this.refs.groove.clientWidth) * this.state.range + this.props.min;
      // let computedValue = Math.floor(value / this.state.step) * this.state.step
      this.marksClickHandle(value)
      // this.setState({value: this.computedValue(value)})
      // this.props.onChange(this.computedValue(value))
      // this.props.tipFormatter(this.computedValue(value))
    }

    let x0 = e.nativeEvent.pageX;
    // console.log('x0', x0)

    document.onmousemove = (e)=>{
      if(Math.abs((e.pageX - x0) / this.refs.groove.clientWidth * this.state.range) < this.state.step) return;
      let value = this.props.value + (e.pageX - x0) / this.refs.groove.clientWidth * this.state.range
      // let value = (e.offsetX / this.refs.groove.clientWidth) * this.state.range + this.props.min;
      if(value > this.props.max) value = this.props.max;
      if(value < this.props.min) value = this.props.min;
      // console.log(value)
      x0 = e.pageX
      this.marksClickHandle(value)
      // this.setState({value: this.computedValue(value)})
      // this.props.onChange(this.computedValue(value))
    }
    document.onmouseup = ()=>{
      document.onmousemove = null;
      this.blockLeaveHandle()
    }
  }

  blockEnterHandle = ()=>{
    this.setState({tipValue: this.props.tipFormatter(this.computedValue(this.props.value)), showTip: true})
  }
  blockLeaveHandle = ()=>{
    this.setState({showTip: false})
  }

  render() {
    // console.log(this.state.marks)
    let position = (this.props.value -  this.props.min) * 100 / this.state.range
    return (
      <div className="range-wrap">
        <div className={`range-groove ${this.state.marks.length ? 'marks' : ''}`} ref="groove">
          <p className="range-groove-active" style={{width: `${position}%`, background: this.props.color}}></p>
          <p className="range-groove-drag" ref="drag" onMouseDown={this.dragMouseDownHandle}>
            {this.state.marks.map((v)=><b
              key={v.key}
              className={`${(v.key - this.props.min) * 100 / this.state.range <= position ? 'active' : ''}`}
              style={{left: `${(v.key - this.props.min) * 100 / this.state.range}%`}}
              onMouseDown={(e)=>{
                e.stopPropagation();
                e.nativeEvent.stopImmediatePropagation();
                this.marksClickHandle(v.key)}
              }
            ></b>)}
            <span
              className="range-block"
              style={{left: `${position}%`, borderColor: this.props.color}}
              onMouseEnter={this.blockEnterHandle}
              onMouseLeave={this.blockLeaveHandle}
            >{this.state.showTip && <i>{this.state.tipValue}</i>}</span>
          </p>
        </div>
        <ul className="range-title">
          {this.state.marks.map((v)=><li key={v.key} style={{left: `${(v.key - this.props.min) * 100 / this.state.range}%`}}>{v.title}</li>)}
        </ul>
      </div>
    );
  }
}
