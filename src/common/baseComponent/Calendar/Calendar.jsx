import React, { Component } from "react";
import MonthView from "./MonthView.jsx";
import DecadeView from "./DecadeView.jsx";
import SetMonthView from "./SetMonthView.jsx";
import {CALENDAR_NEXTMONTH, CALENDAR_NEXTYEAR, CALENDAR_PREMONTH, CALENDAR_PREYEAR}from "@/config/ImageConfig";
import exchangeViewBase from "../../../components/ExchangeViewBase";

export default class Calendar extends exchangeViewBase {
  constructor(props) {
    super(props);
    this.state = {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day:  new Date().getDate(),
      view: "month",
      showCalendar: 'none',
      calendarActive: false,
      istarget: false,
      inputValue: '',
      clickActive: 0,
      showActive: true
    };
    this.hide = () => {
      if (this.state.istarget) {
        this.state.istarget = false;
        return
      }
      if (this.state.showCalendar === 'none') return;
      this.setState({
        showCalendar: 'none'
      });
    }
  }

  componentDidMount(){
    // console.log(111, typeof this.props.startInputTime)
    let statTime = new Date(this.props.startInputTime * 1000), endTime = new Date(this.props.endInputTime * 1000)
    document.addEventListener('click', this.hide)
    this.props.startInputTime && this.setState({
      inputValue: `${statTime.getFullYear()}-${statTime.getMonth() + 1}-${statTime.getDate()}`,
      clickActive: statTime.getDate()
    })
    this.props.endInputTime && this.setState({
      inputValue: `${endTime.getFullYear()}-${endTime.getMonth() + 1}-${endTime.getDate()}`,
      clickActive: endTime.getDate()
    })
  }

  componentDidUpdate(props, preState) {
    if (this.props.startInputTime === props.startInputTime && this.props.endInputTime === props.endInputTime ) return;
    let statTime = new Date(this.props.startInputTime * 1000),
      endTime = new Date(this.props.endInputTime * 1000);
    this.props.startInputTime && this.setState({
        inputValue: `${statTime.getFullYear()}-${statTime.getMonth() + 1}-${statTime.getDate()}`,
        clickActive: statTime.getDate()
      });
    this.props.endInputTime && this.setState({
        inputValue: `${endTime.getFullYear()}-${endTime.getMonth() + 1}-${endTime.getDate()}`,
        clickActive: endTime.getDate()
      });
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.hide)
  }


  //变为下一月
  goNextMonth() {
    //如果当前是12月，那么下一月就是下一年的1月
    let statTime = new Date(this.props.startInputTime * 1000),
      endTime = new Date(this.props.endInputTime * 1000),
      yearPro = (this.props.startInputTime && (statTime.getFullYear())) || (this.props.endInputTime && (endTime.getFullYear())),
      monthPro = (this.props.startInputTime && (statTime.getMonth() + 1)) || (this.props.endInputTime && (endTime.getMonth() + 1)),
      year = this.state.year,
      month = this.state.month;
    if (month + 1 === 13) {
      this.setState({
        month: 1,
        year: year + 1
      })
    }
    this.setState({
      year: month === 12 ? year + 1 : year,
      month: month === 12 ? 1 : month + 1,
      showCalendar: 'block',
      istarget: true,
      showActive: (month + 1 === monthPro && year === yearPro) || (monthPro === 1 && month === 12 && year === yearPro) ? true : false
    })
  };

  //变为上一月
  goPrevMonth() {
    let statTime = new Date(this.props.startInputTime * 1000),
      endTime = new Date(this.props.endInputTime * 1000),
      yearPro = (this.props.startInputTime && (statTime.getFullYear())) || (this.props.endInputTime && (endTime.getFullYear())),
      monthPro = (this.props.startInputTime && (statTime.getMonth() + 1)) || (this.props.endInputTime && (endTime.getMonth() + 1)),
      year = this.state.year,
      month = this.state.month;
    this.setState({
      year: month === 1 ? year - 1 : year,
      month: month === 1 ? 12 : month - 1,
      showCalendar: 'block',
      istarget: true,
      showActive: (month - 1 === monthPro && year === yearPro) || (monthPro === 12 && month === 1 && year === yearPro)? true : false
    })
  };

  goNextYear() {
    let statTime = new Date(this.props.startInputTime * 1000),
      endTime = new Date(this.props.endInputTime * 1000),
      yearPro = (this.props.startInputTime && (statTime.getFullYear())) || (this.props.endInputTime && (endTime.getFullYear())),
      year = this.state.year;
    this.setState({
      year: year + 1,
      showCalendar: 'block',
      istarget: true,
      showActive: year + 1 === yearPro ? true : false
    });
  };

  goPrevYear() {
    let statTime = new Date(this.props.startInputTime * 1000),
      endTime = new Date(this.props.endInputTime * 1000),
      yearPro = (this.props.startInputTime && (statTime.getFullYear())) || (this.props.endInputTime && (endTime.getFullYear())),
      year = this.state.year;
    this.setState({
      year: year - 1,
      showCalendar: 'block',
      istarget: true,
      showActive: year - 1 === yearPro ? true : false
    });
  };

  goNextTenYear() {
    this.setState({
      year: this.state.year + 10,
      showCalendar: 'block',
      istarget: true,
      showActive: false
    });
  };

  goPreTenYear() {
    this.setState({
      year: this.state.year - 10,
      showCalendar: 'block',
      istarget: true,
      showActive: false
    });
  };

  setYear(year) {
    this.setState({
      year,
      view: "changeMonth",
      showCalendar: 'block',
      istarget: true,
      showActive: false
    });
  };

  setMonth(month) {
    this.setState({
      month,
      view: "month",
      showCalendar: 'block',
      istarget: true,
      showActive: false
    });
  };

  setDay(day) {
    let statTime = new Date(this.props.startInputTime * 1000),
        endTime = new Date(this.props.endInputTime * 1000),
        dayNone = (this.props.startInputTime && (statTime.getDate())) || (this.props.endInputTime && (endTime.getDate()));
    let time = day && (day === this.intl.get('today') ? `${this.state.year}-${this.state.month}-${new Date().getDate()}` : `${this.state.year}-${this.state.month}-${day}`) || `${this.state.year}-${this.state.month}-${dayNone}`;
    this.setState({
      inputValue: time,
      clickActive: day,
      showActive: true
    });
    this.props.onChange(time)
  };

  showCalendar(state) {
    let statTime = new Date(this.props.startInputTime * 1000),
      endTime = new Date(this.props.endInputTime * 1000),
      year = (this.props.startInputTime && (statTime.getFullYear())) || (this.props.endInputTime && (endTime.getFullYear())),
      month = (this.props.startInputTime && (statTime.getMonth() + 1)) || (this.props.endInputTime && (endTime.getMonth() + 1)),
      day = (this.props.startInputTime && (statTime.getDate())) || (this.props.endInputTime && (endTime.getDate()));
    this.setState({
      showCalendar: 'block',
      istarget: true,
      calendarActive: true,
      showActive: true,
      view: "month",
      year,
      month,
      day
    });
  };

  render() {
    let statTime = new Date(this.props.startInputTime * 1000),
        endTime = new Date(this.props.endInputTime * 1000),
        year = (this.props.startInputTime && (statTime.getFullYear())) || (this.props.endInputTime && (endTime.getFullYear())),
        month = (this.props.startInputTime && (statTime.getMonth() + 1)) || (this.props.endInputTime && (endTime.getMonth() + 1)),
        day = (this.props.startInputTime && (statTime.getDate())) || (this.props.endInputTime && (endTime.getDate()));
    return (
      <div className="calendar-wrap">
        <div className={`${this.state.calendarActive ? "active" : ""} input-wrap`}>
          <input type="text"
                 placeholder="选择日期"
                 onFocus={this.showCalendar.bind(this)}
                 readOnly
                 onBlur={() => {this.setState({calendarActive: false})}}
                 value={this.state.inputValue}/>
                 {/*value="dddd"/>*/}
        </div>
        <div className="calendar" style={{display: this.state.showCalendar}}>
          {this.state.view == "month" ? (
            <h3>
              <img src={CALENDAR_PREYEAR} alt="" onClick={this.goPrevYear.bind(this)} className="pre-year-img"/>
              <img src={CALENDAR_PREMONTH} alt=""  onClick={this.goPrevMonth.bind(this)} className="pre-month-img"/>
              <i className="year-i" onClick={() => {this.setState({view: "decade", showCalendar: "block", istarget: true})}}>{this.state.year}{this.intl.get('yearSp')}</i>
              <i onClick={() => {this.setState({view: "changeMonth", showCalendar: "block", istarget: true})}}>{this.state.month}{this.intl.get('month')}</i>
              <img src={CALENDAR_NEXTMONTH} alt=""  onClick={this.goNextMonth.bind(this)} className="next-month-img"/>
              <img src={CALENDAR_NEXTYEAR} alt="" onClick={this.goNextYear.bind(this)} className="next-year-img"/>
            </h3>
          ) : (this.state.view == "decade" ? (
            <h3>
              <img src={CALENDAR_PREMONTH} alt="" onClick={this.goPreTenYear.bind(this)} className="pre-month-img"/>
              {this.state.year - (this.state.year % 10)}{this.intl.get('year')} - {this.state.year - (this.state.year % 10) + 9}{this.intl.get('year')}
              <img src={CALENDAR_NEXTMONTH} alt="" onClick={this.goNextTenYear.bind(this)} className="next-month-img"/>
            </h3>
          ) : (
            <h3>{this.state.year}{this.intl.get('year')}</h3>
          ))}

          {this.state.view == "month" ? (
            <MonthView year={this.state.year}
                       month={this.state.month}
                       day={this.state.day}
                       showActive={this.state.showActive}
                       setDay={this.setDay.bind(this)}
                       index={this.state.clickActive}
                       isStart={this.props.startTime}
                       isEnd={this.props.endTime}/>
          ) : (this.state.view == "decade" ? (
            <DecadeView
              year={this.state.year}
              setYear={this.setYear.bind(this)}
            />
          ) : (
            <SetMonthView
              month={this.state.month}
              setMonth={this.setMonth.bind(this)}
            />
          ))}
        </div>
      </div>
    );
  }
}
