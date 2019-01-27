import React, { Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import AdvertisingList from "./AdvertisingList/index";
import PublishAdvertising from "./PublishAdvertising/index";
import FastBuy from "./FastBuy/index";
import BussinessInfo from "./BussinessInfo/index";
import MyAdvertisingList from "./MyAdvertisingList/index";



export default class OTC extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const Advertising = ({ location, history }) => {
      return (
        <AdvertisingList
          location={location}
          history={history}
          controller={this.props.controller}
        />
      );
    };
    const Publish = ({ location, history }) => {
      return (
        <PublishAdvertising
          location={location}
          history={history}
          controller={this.props.controller}
        />
      );
    };
    const Fast = ({ location, history }) => {
      return (
        <FastBuy
          location={location}
          history={history}
          controller={this.props.controller}
        />
      );
    };
    const Bussiness = ({ location, history }) => {
      return (
        <BussinessInfo
          location={location}
          history={history}
          controller={this.props.controller}
        />
      );
    };
    const MyAd = ({ location, history }) => {
      return (
        <MyAdvertisingList
          location={location}
          history={history}
          controller={this.props.controller}
        />
      );
    };
    const RouteMap = [
      { path: "/advertisingList", component: Advertising },
      { path: "/publishAdvertising", component: Publish, authLogin: true },
      { path: "/fastBuy", component: Fast },
      { path: "/bussiness", component: Bussiness },
      { path: "/myAd", component: MyAd, authLogin: true }
    ];
    let token = this.props.controller.Storage.userToken.get();
    return (
      <div>
        <Switch>
          {RouteMap.map((item, i) => (
            <Route
              path={item.path}
              key={i}
              render={props => {
                return ((item.authLogin && token) || !item.authLogin) ? (
                    <item.component {...props} />
                  ) : (
                    <Redirect to={"/advertisingList"} />
                  )
                }
              }
            />
          ))}
          <Redirect to={"/advertisingList"} />
        </Switch>
      </div>
    );
  }
}
