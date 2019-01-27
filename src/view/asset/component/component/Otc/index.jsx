import React, {Component} from 'react';
import {
  Route,
  Redirect,
  Switch
} from "react-router-dom";
import ChargeMessage from "../common/ChargeMessage";
import CommonNav from "../common/Nav";
import OtcCharge from "./component/OtcCharge/";
import OtcBalance from "./component/OtcBalance/";
import OtcHistory from "./component/OtcHistory/";


export default class Exchange extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const Nav = ()=><CommonNav url='otc'/>;
    const Bala = ({ location, history }) => {
      return (
        <OtcBalance
          controller={this.props.controller}
          location={location}
          history={history}
          sendStatis={this.sendStatis}
        />
      );
    };
    const Char = ({ location, history }) => {
      return <OtcCharge controller={this.props.controller} location={location} history={history} sendStatis={this.sendStatis} key={location.key}/>;
    };
    const Hist = ({ location }) => {
      return <OtcHistory controller={this.props.controller} location={location} sendStatis={this.sendStatis} key={location.key}/>;
    };
    return (
      <div className="asset-otc">
        <ChargeMessage controller={this.props.controller} origin='otc'/>
        <div className="clearfix">
          <Switch>
            <Route path={`${('/otc/balance')}`} render={Nav} />
            <Route path={`${('/otc/dashboard')}`} render={Nav} />
            <Route render={() => <div style={{width: 0, height: 0}}/>}/>
          </Switch>
          <div className='route'>
            <Switch>
              <Route path={`${('/otc/balance')}`} render={Bala} />
              <Route path={`${('/otc/charge')}`} render={Char} />
              <Route path={`${('/otc/dashboard')}`} render={Hist} />
              <Redirect to={`${('/otc/balance')}`} />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}
