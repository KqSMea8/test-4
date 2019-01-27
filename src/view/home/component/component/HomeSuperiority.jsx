import React, { Component } from "react";
import intl from "react-intl-universal";
import { HOME_FINANCIAL_PRO, HOME_SAFE_PRO, HOME_STABLE_PRO, HOME_PLATFORM_PRO } from '@/config/ImageConfig';

export default class HomeSuperiority extends Component {
  constructor(props) {
    super(props);
    this.intl = intl
  }

  render() {
    let lang = this.props.controller.configController.store.state.language;
    return (
      <div className="home-super-wrap-pro">
        <ul className={`clearfix ${lang === 'zh-CN' ? '' : 'en-ul'}`}>
          <li>
            <img src={HOME_FINANCIAL_PRO}/>
            <h2>{this.intl.get("home-advantage-h1")}</h2>
            <p>{this.intl.get("home-advantage-p1")}</p>
          </li>
          <li>
            <img src={HOME_SAFE_PRO}/>
            <h2>{this.intl.get("home-advantage-h2")}</h2>
            <p>{this.intl.get("home-advantage-p2")}</p>
          </li>
          <li>
            <img src={HOME_STABLE_PRO}/>
            <h2>{this.intl.get("home-advantage-h3")}</h2>
            <p>{this.intl.get("home-advantage-p3")}</p>
          </li>
          <li>
            <img src={HOME_PLATFORM_PRO}/>
            <h2>{this.intl.get("home-advantage-h4")}</h2>
            <p>{this.intl.get("home-advantage-p4")}</p>
          </li>
        </ul>
      </div>
    );
  }
}

