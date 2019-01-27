import React, { Component } from "react";
import {
  Route,
  NavLink,
  Redirect,
  Switch
} from "react-router-dom";
import Exchange from  "./component/Exchange"
import Otc from  "./component/Otc"
import Taoli from "./component/Taoli";
import Translate from '@/core/libs/Translate'
import AssetLang from '../lang/'
import intl from "react-intl-universal";
import "./style/index.styl";

class Asset extends Component {
  constructor(props) {
    super(props);
    this.intl = intl;
    this.controller = props.controller;
    this.sendStatis = props.controller.configController.sendStatis.bind(props.controller.configController)
  }

  render() {
    const Nav = () => {
      return (
        <ul className="nav">
          <li>
            <NavLink activeClassName="active" to={`${('/exchange')}`}>
              {this.intl.get("asset-coin-account")}
            </NavLink>
          </li>
          <li>
            <NavLink activeClassName="active" to={`${('/otc')}`}>
              {this.intl.get("asset-legal-account")}
            </NavLink>
          </li>
          <li>
            <NavLink activeClassName="active" to={`${('/taolibao')}`}>
              {this.intl.get('tlb-account')}
            </NavLink>
          </li>
        </ul>
      )
    };

    const Exch = ({ location, history }) => {
      return (
        <Exchange
          controller={this.controller}
          location={location}
          history={history}
          sendStatis={this.sendStatis}
        />
      );
    };

    const Tao = ({ location, history }) => {
      return (
        <Taoli
          controller={this.controller}
          location={location}
          history={history}
          sendStatis={this.sendStatis}
        />
      );
    };

    const Ot = ({ location, history }) => {
      return (
        <Otc
          controller={this.controller}
          location={location}
          history={history}
          sendStatis={this.sendStatis}
        />
      );
    };

    return (
      <div className="asset">
        <div className="asset-blow clearfix">
          <Switch>
            <Route path={`${'/exchange'}`} render={Nav} />
            <Route path={`${'/taolibao'}`} render={Nav} />
            <Route path={`${'/otc'}`} render={Nav} />
            <Route render={() => <div style={{width: 0, height: 0}}/>}/>
          </Switch>
          <div className='route'>
            <Switch>
              <Route path={`${'/exchange'}`} render={Exch} />
              <Route path={`${'/taolibao'}`} render={Tao} />
              <Route path={`${'/otc'}`} render={Ot} />
              <Redirect to={`${'/exchange'}`} />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

export default Translate(Asset, AssetLang)
