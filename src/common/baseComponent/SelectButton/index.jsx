import React, { Component } from "react";

export default class SelectButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      istarget: false,
    };
    this.clickoutside = () => {
      if (this.state.istarget) {
        this.state.istarget = false;
        return;
      }
      if (!this.state.show) return;
      this.setState({
        show: false
      });
    };
  }
  componentDidMount() {
    window.addEventListener("click", this.clickoutside);
  }
  componentWillUnmount() {
    window.removeEventListener("click", this.clickoutside);
  }
  render() {
    /*
  title 按钮文案
  type  默认default, 可选main, trade(币币交易页面计价方式select), tradePro(币币交易页面计价方式专业版select)
  simple type为main时有效，简化，不显示title
  className 自定义类名方便自定义样式
  valueArr 选项菜单内容数组
  onSelect  选项click 事件的 handler
  children 自定义下拉菜单
*/
    let {
      type,
      title,
      className,
      valueArr,
      onSelect,
      simple,
      children
    } = this.props;
    let { show } = this.state;
    !type && (type = "default");
    !valueArr && (valueArr = []);
    return (
      <div className="select-button">
        {type === "default" ? (
          <button
            className={`${className ? className : ""} ${
              show ? "" : "hidden"
            } ${type}`}
            onClick={e => {
              this.state.istarget = true;
              this.setState({ show: show ? false : true });
            }}
          >
            {title}
          </button>
        ) : (
          <div
            className={`${className ? className : ""} ${
              show ? "" : "hidden"
            } ${type} ${simple ? "simple" : ""}`}
            onClick={e => {
              this.state.istarget = true;
              this.setState({ show: show ? false : true });
            }}
          >
            <p>{simple ? "" : title}</p>
            {['trade', 'tradePro'].includes(type) && <i className={show ? 'selected' : ''}></i>}
          </div>
        )}

        {valueArr.length > 0 && (
          <ul className={`${ ['trade', 'tradePro'].includes(type) ? (type === 'trade' ? 'trade-list' : 'tradePro-list') : 'base-list'} ${show ? "" : "hide"}`}>
            {valueArr.map((item, index) => {
              let value = typeof(item) === 'object' ? item.name : item;
              return (
                <li
                  className={['trade', 'tradePro'].includes(type) ? (title.indexOf(value) > -1 ? "active" : '') : (value === title ? "active" : "") }
                  key={index}
                  onClick={e => {
                    e.nativeEvent.stopImmediatePropagation();
                    onSelect && onSelect(item);
                    this.setState({ show: false});
                  }}
                >
                  <p>{value}</p>
                </li>
              );
            })}
          </ul>
        )}
        {children && this.state.show && children}
      </div>
    );
  }
}
