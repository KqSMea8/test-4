import React, { Component } from "react";
import {
  Route,
  Redirect,
  Switch
} from "react-router-dom";
import Balance from "./component/Balance";
import Charge from "./component/Charge";
import Extract from "./component/Extract";
import History from "./component/History";
import ChargeMessage from "../common/ChargeMessage";
import CommonNav from "../common/Nav";

import "../../style/exchange/index.styl"


export default class Exchange extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const Nav = ()=><CommonNav url='exchange'/>;
    const Bala = ({ location, history }) => {
      return (
        <Balance
          controller={this.props.controller}
          location={location}
          history={history}
          sendStatis={this.sendStatis}
        />
      );
    };
    const Char = ({ location, history }) => {
      return <Charge controller={this.props.controller} location={location} history={history} sendStatis={this.sendStatis} key={location.key}/>;
    };
    const Extr = ({ location, history}) => {
      return <Extract controller={this.props.controller} location={location} history={history} sendStatis={this.sendStatis} key={location.key}/>;
    };
    const Hist = ({ location }) => {
      return <History controller={this.props.controller} location={location} sendStatis={this.sendStatis} key={location.key}/>;
    };
    return (
      <div className="asset-exchange">
        <ChargeMessage controller={this.props.controller}/>
        <div className="clearfix">
          <Switch>
            <Route path={`${('/exchange/balance')}`} render={Nav} />
            <Route path={`${('/exchange/dashboard')}`} render={Nav} />
            <Route render={() => <div style={{width: 0, height: 0}}/>}/>
          </Switch>
          <div className='route'>
            <Switch>
              <Route path={`${('/exchange/balance')}`} render={Bala} />
              <Route path={`${('/exchange/charge')}`} render={Char} />
              <Route path={`${('/exchange/extract')}`} render={Extr} />
              <Route path={`${('/exchange/dashboard')}`} render={Hist} />
              <Redirect to={`${('/exchange/balance')}`} />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}
