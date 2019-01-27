import React, {Component} from 'react';
import {
  Route,
  Redirect,
  Switch
} from 'react-router-dom'

import FundHome from './component/fundHome' // 套利宝首页
import FundDetail from './component/fundDetail' // 套利宝详情页

import ExchangeViewBase from "@/components/ExchangeViewBase";

import Translate from '@/core/libs/Translate'
import FundLang from '../lang'

class Fund extends ExchangeViewBase {
  constructor(props) {
    super(props);
    // this.sendStatis = props.controller.configController.sendStatis.bind(props.controller.configController)
  }

  render() {
    const {controller} = this.props;
    return (
      <div className="" style={{minHeight: `${window.innerHeight - 210}px`}}>
        <div className="">
          <Switch>
            <Route exact path={'/'} component={({match, history}) => {
              document.getElementById("app").scrollIntoView(true);
              return <FundHome controller={controller} history={history}/>
            }}/>
            <Route path={('/detail')} component={({match, history}) => {
              document.getElementById("app").scrollIntoView(true);
              return <FundDetail controller={controller} history={history}/>
            }}/>
            <Redirect to={'/'} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default Translate(Fund, FundLang)
