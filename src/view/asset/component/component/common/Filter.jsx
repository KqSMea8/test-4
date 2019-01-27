import React, {Component} from 'react';
import intl from "react-intl-universal";
import DatePicker from "@/common/baseComponent/DatePicker/DatePicker";
import SelectButton from "@/common/baseComponent/SelectButton";
import Button from "@/common/baseComponent/Button";

export default class Filter extends Component {
  constructor(props) {
    super(props);
    this.intl = intl;
  }
  render() {
    return (
      <div className="filtrate clearfix">
        <ul className="clearfix">
          {this.props.selectArr.map(v => (
            <li key={v.key} className="item">
              <span>{v.text}</span>
              <SelectButton
                title={this.props[v.key]}
                type="main"
                className="select"
                valueArr={v.valueArr}
                onSelect={value => {
                  let o = {};
                  o[v.key] = value;
                  this.props.select(o);
                }}
              />
            </li>
          ))}
        </ul>
        <div className="datepicker">
          <DatePicker
            startTime={this.props.startTime_s}
            endTime={this.props.endTime_s}
            onChangeStart={this.props.onChangeStart}
            onChangeEnd={this.props.onChangeEnd}
          />
        </div>
        <div className="handel">
          <Button
            type="base"
            title={this.intl.get("search")}
            className="search"
            onClick={this.props.searchHandle}
          />
          <Button
            title={this.intl.get("reset")}
            className="reset"
            onClick={this.props.resetHandle}
          />
        </div>
      </div>
    );
  }
}
