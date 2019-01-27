import React, { Component } from "react";
import {
  Route,
  Redirect,
  Switch
} from "react-router-dom";
import Balance from './component/Balance'
import History from './component/History'
import CommonNav from "../common/Nav";

import "../../style/taolibao/index.styl";

export default class Taoli extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const Nav = ()=><CommonNav url='taolibao'/>;

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

    const Hist = ({ location }) => {
      return <History controller={this.props.controller} location={location} sendStatis={this.sendStatis} key={location.key}/>;
    };

    return (
      <div className="asset-taoli">
        <div className="clearfix">
          <Switch>
            <Route path={('/taolibao/balance')} render={Nav} />
            <Route path={('/taolibao/dashboard')} render={Nav} />
            <Route render={() => <div style={{width: 0, height: 0}}/>}/>
          </Switch>
          <div className='route'>
            <Switch>
              <Route path={('/taolibao/balance')} render={Bala} />
              <Route path={('/taolibao/dashboard')} render={Hist} />
              <Redirect to={('/taolibao/balance')} />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}
